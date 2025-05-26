document.addEventListener('DOMContentLoaded', function () {
  // Fetch and parse the CSV file
  fetch('Final_Gym_Equipment_Identification.csv')
    .then(response => response.text())
    .then(csvText => {
      const equipmentList = parseCSV(csvText);

      // Filter only available items
      const availableEquipment = equipmentList.filter(item => item.available.toUpperCase() === 'YES');

      const gallery = document.querySelector('.gallery-grid');
      // For lightbox navigation
      let currentIndex = 0;

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

      // Render available equipment in the gallery
      availableEquipment.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'equipment-card';

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

        card.appendChild(img);
        card.appendChild(desc);
        gallery.appendChild(card);
      });

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
        const item = availableEquipment[currentIndex];
        lightboxImg.src = `EquipmentPhotos/${item.file}`;
        lightboxImg.alt = item.desc;
        lightboxCaption.textContent = item.desc;
      }

      function showPrev() {
        currentIndex = (currentIndex - 1 + availableEquipment.length) % availableEquipment.length;
        showLightboxImage();
      }

      function showNext() {
        currentIndex = (currentIndex + 1) % availableEquipment.length;
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
    });

  // Simple CSV parser for 3 columns: file, desc, available
  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    // Assume first line is header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const fileIdx = headers.indexOf('file');
    const descIdx = headers.indexOf('desc');
    const availableIdx = headers.indexOf('available');
    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (cols.length >= 3) {
        items.push({
          file: cols[fileIdx],
          desc: cols[descIdx],
          available: cols[availableIdx]
        });
      }
    }
    return items;
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
});
