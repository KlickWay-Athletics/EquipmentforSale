# Gym Equipment For Sale

A responsive web application for showcasing and selling gym equipment with an integrated contact form and image gallery.

## Features

- **Dynamic Equipment Loading**: Automatically loads equipment data from CSV file
- **Responsive Image Gallery**: Grid-based layout that adapts to different screen sizes
- **Interactive Lightbox**: Click on any equipment image to view in full-screen with navigation
- **Contact Form**: Integrated inquiry form with equipment selection
- **Mobile-Friendly**: Touch/swipe support for mobile devices
- **Accessibility**: Keyboard navigation and screen reader support

## Project Structure

```
GymEquipmentSale/
├── index.html                              # Main HTML file
├── style.css                               # Styling and responsive design
├── script.js                               # JavaScript functionality
├── Final_Gym_Equipment_Identification.csv  # Equipment data source
├── EquipmentPhotos/                        # Equipment images directory
└── README.md                               # This file
```

## Equipment Data Management

The application now dynamically loads equipment data from `Final_Gym_Equipment_Identification.csv`. This eliminates the need to manually update JavaScript code when adding new equipment.

### CSV Format
```csv
File Name,Equipment Type,available
IMG_8150.jpg,Incline Chest Press Machine (Plate-Loaded),Yes
IMG_8185.jpg,Pendulum Squat Machine,No
```

### Adding New Equipment
1. Add equipment photos to the `EquipmentPhotos/` directory
2. Update the CSV file with the new equipment details
3. The website will automatically display the new equipment

## Technical Improvements Made

1. **Automated Data Loading**: Replaced hardcoded equipment list with CSV parsing
2. **Error Handling**: Fallback system if CSV fails to load
3. **Data Synchronization**: Single source of truth for equipment data
4. **Performance**: Async loading prevents blocking page render
5. **Maintainability**: Easier to add/remove equipment without code changes

## Usage

1. Open `index.html` in a web browser
2. Browse available equipment in the gallery
3. Click on images to view in lightbox mode
4. Use the contact form to inquire about specific equipment

## Browser Compatibility

- Modern browsers with ES6+ support
- Mobile browsers with touch support
- Keyboard navigation for accessibility

## Contact Integration

The contact form is integrated with Formspree for email handling. Equipment selections are automatically populated from the available inventory.
