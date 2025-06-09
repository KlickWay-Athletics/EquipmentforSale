document.addEventListener('DOMContentLoaded', function () {
  // Load equipment data from CSV file
  let equipmentList = [];
  
  // Function to load and parse CSV data
  async function loadEquipmentData() {
    try {
      const response = await fetch('Final_Gym_Equipment_Identification.csv');
      const csvText = await response.text();
      const lines = csvText.trim().split('\n');
      
      // Skip header row and parse data
      for (let i = 1; i < lines.length; i++) {
        const [file, desc, available, category] = lines[i].split(',');
        if (file && desc && available) {
          equipmentList.push({
            file: file.trim(),
            desc: desc.trim(),
            available: available.trim(),
            category: category ? category.trim() : 'Other'
          });
        }
      }
      
      // Initialize the page after data is loaded
      initializePage();
    } catch (error) {
      console.error('Error loading equipment data:', error);
      
      // Show error message
      const loadingMessage = document.getElementById('loading-message');
      if (loadingMessage) {
        loadingMessage.textContent = 'Error loading equipment data. Please refresh the page or contact us directly.';
        loadingMessage.className = 'error-message';
      }
      
      // Fallback to hardcoded data if CSV fails to load
      equipmentList = [
        { file: "IMG_8150.jpg", desc: "Incline Chest Press Machine (Plate-Loaded)", available: "Yes" },
        { file: "IMG_8185.jpg", desc: "Pendulum Squat Machine", available: "No" },
        { file: "IMG_8184.jpg", desc: "Smith Machine (Counterbalanced Barbell)", available: "Yes" }
      ];
      initializePage();
    }
  }

  // Initialize page content after data is loaded
  function initializePage() {
    // Hide loading message and show equipment count
    const loadingMessage = document.getElementById('loading-message');
    const equipmentCount = document.getElementById('equipment-count');
    const categoryFilter = document.getElementById('category-filter');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    
    // Filter only available items
    const availableEquipment = equipmentList.filter(item => item.available === "Yes");
    
    // Show equipment count
    if (equipmentCount) {
      equipmentCount.textContent = `${availableEquipment.length} items available`;
      equipmentCount.style.display = 'block';
    }

    // Set up category filtering
    const categories = [...new Set(availableEquipment.map(item => item.category).filter(cat => cat))].sort();
    const categorySelect = document.getElementById('category-select');
    
    if (categorySelect && categories.length > 0) {
      // Populate category dropdown
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
      
      // Show category filter
      if (categoryFilter) categoryFilter.style.display = 'flex';
      
      // Add category filter event listener
      categorySelect.addEventListener('change', function() {
        renderEquipment(availableEquipment, this.value);
      });
    }

    const gallery = document.querySelector('.gallery-grid');
    // For lightbox navigation
    let currentIndex = 0;
    let currentFilteredEquipment = availableEquipment;

    // Populate equipment select dropdown in the form
    const equipmentSelect = document.getElementById('equipment-select');
    if (equipmentSelect) {
      availableEquipment.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.desc;
        option.textContent = item.desc;
        equipmentSelect.appendChild(option);
      });
    }

    // Function to render equipment based on category filter
    function renderEquipment(equipment, selectedCategory = 'all') {
      // Clear existing content
      gallery.innerHTML = '';
      
      // Filter equipment by category
      const filteredEquipment = selectedCategory === 'all' 
        ? equipment 
        : equipment.filter(item => item.category === selectedCategory);
      
      currentFilteredEquipment = filteredEquipment;
      
      // Update equipment count
      if (equipmentCount) {
        const countText = selectedCategory === 'all' 
          ? `${filteredEquipment.length} items available`
          : `${filteredEquipment.length} items in ${selectedCategory}`;
        equipmentCount.textContent = countText;
      }
      
      // Group equipment by category for organized display
      if (selectedCategory === 'all') {
        const groupedEquipment = {};
        filteredEquipment.forEach(item => {
          const category = item.category || 'Other';
          if (!groupedEquipment[category]) {
            groupedEquipment[category] = [];
          }
          groupedEquipment[category].push(item);
        });
        
        // Render by categories
        Object.keys(groupedEquipment).sort().forEach(category => {
          const categorySection = document.createElement('div');
          categorySection.className = 'category-section';
          
          const categoryTitle = document.createElement('h3');
          categoryTitle.className = 'category-title';
          categoryTitle.textContent = `${category} (${groupedEquipment[category].length})`;
          categorySection.appendChild(categoryTitle);
          
          const categoryGrid = document.createElement('div');
          categoryGrid.className = 'gallery-grid';
          
          groupedEquipment[category].forEach((item, idx) => {
            const globalIdx = filteredEquipment.indexOf(item);
            const card = createEquipmentCard(item, globalIdx);
            categoryGrid.appendChild(card);
          });
          
          categorySection.appendChild(categoryGrid);
          gallery.appendChild(categorySection);
        });
      } else {
        // Render single category as grid
        filteredEquipment.forEach((item, idx) => {
          const card = createEquipmentCard(item, idx);
          gallery.appendChild(card);
        });
      }
    }
    
    // Function to create equipment card
    function createEquipmentCard(item, idx) {
      const card = document.createElement('div');
      card.className = 'equipment-card';
      card.setAttribute('data-category', item.category);

      const img = document.createElement('img');
      img.src = `EquipmentPhotos/${item.file}`;
      img.alt = item.desc;
      img.tabIndex = 0;
      img.style.cursor = "pointer";
      img.addEventListener('click', () => openLightbox(idx));
      img.addEventListener('keydown', (e) => {
        if (e.key === "Enter" || e.key === " ") openLightbox(idx);
      });

      const desc = document.createElement('div');
      desc.className = 'description';
      desc.textContent = item.desc;
      
      // Add category badge
      const categoryBadge = document.createElement('div');
      categoryBadge.className = 'category-badge';
      categoryBadge.textContent = item.category || 'Other';
      categoryBadge.style.cssText = `
        background: #E6232E;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        margin-top: 8px;
        text-align: center;
      `;

      card.appendChild(img);
      card.appendChild(desc);
      card.appendChild(categoryBadge);
      return card;
    }

    // Initial render - show all equipment organized by category
    renderEquipment(availableEquipment);

  // Lightbox functionality
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  function openLightbox(idx) {
    currentIndex = idx;
    showLightboxImage();
    lightboxModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightboxModal.style.display = "none";
    document.body.style.overflow = "";
  }

  function showLightboxImage() {
    const item = currentFilteredEquipment[currentIndex];
    lightboxImg.src = `EquipmentPhotos/${item.file}`;
    lightboxImg.alt = item.desc;
    lightboxCaption.textContent = item.desc;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentFilteredEquipment.length) % currentFilteredEquipment.length;
    showLightboxImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentFilteredEquipment.length;
    showLightboxImage();
  }

  if (lightboxClose) lightboxClose.onclick = closeLightbox;
  if (lightboxPrev) lightboxPrev.onclick = showPrev;
  if (lightboxNext) lightboxNext.onclick = showNext;

  // Close on background click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (lightboxModal.style.display === "flex") {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeLightbox();
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = null;
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
    });
    lightboxModal.addEventListener('touchend', function (e) {
      if (touchStartX !== null && e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (dx > 50) showPrev();
        else if (dx < -50) showNext();
        touchStartX = null;
      }
    });
  }

  // Form feedback (for Formspree or similar)
  const form = document.getElementById('inquiry-form');
  const statusDiv = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      statusDiv.textContent = "Sending...";

      // Handle multiple select for equipment
      const equipmentSelect = document.getElementById('equipment-select');
      if (equipmentSelect && equipmentSelect.multiple) {
        // Remove any existing hidden input for equipment
        const oldHidden = form.querySelector('input[name="equipment_hidden"]');
        if (oldHidden) oldHidden.remove();

        // Collect selected options
        const selected = Array.from(equipmentSelect.selectedOptions).map(opt => opt.value);
        // Create a hidden input to submit as a comma-separated string
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'equipment';
        hidden.value = selected.join(', ');
        hidden.setAttribute('data-generated', 'true');
        form.appendChild(hidden);
        // Remove name from select so only hidden is submitted
        equipmentSelect.removeAttribute('name');
      }

      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          statusDiv.textContent = "Thank you! Your inquiry has been sent.";
          form.reset();
          // Restore select name for next submission
          if (equipmentSelect) equipmentSelect.name = "equipment";
        } else {
          statusDiv.textContent = "Sorry, there was a problem sending your inquiry. Please try again or DM us on Instagram.";
        }
      } catch (err) {
        statusDiv.textContent = "Network error. Please try again later.";
      }
    });
  }
  
  } // Close initializePage function
  
  // Load equipment data when page loads
  loadEquipmentData();
});
