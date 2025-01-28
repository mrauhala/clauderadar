# Weather Radar Application

An interactive weather radar web application that displays animated radar data from the Finnish Meteorological Institute on a map. Built with React, OpenLayers, and TypeScript.

## Features

- Real-time weather radar visualization with smooth animations
- Last 2 hours of radar data with automatic updates
- Interactive timeline with playback controls
- Layer controls:
  - Radar data toggle
  - Satellite layer toggle
  - Lightning data toggle
  - Weather observations toggle
  - Geolocation toggle
- Dark theme map base layer from ESRI
- Keyboard shortcuts for all controls
- Progressive Web App (PWA) support
- Responsive design for all devices
- Settings persistence across sessions

## Prerequisites

- Node.js (version 18 or newer)
- npm (included with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-radar-app
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Keyboard Shortcuts

- Space: Play/Pause animation
- , (comma): Previous frame
- . (period): Next frame
- A: Change animation speed
- G: Toggle geolocation
- S: Toggle satellite layer
- R: Toggle radar layer
- L: Toggle lightning layer
- O: Toggle observations
- Arrow keys: Pan map
- + / -: Zoom map
- Ctrl: Show keyboard shortcuts help

## Data Sources

- Radar data: Finnish Meteorological Institute (FMI)
  - WMS endpoint: https://openwms.fmi.fi/geoserver/wms
  - Layer: Radar:suomi_dbz_eureffin
- Base map: ESRI Dark Gray Canvas

## Technical Details

- Built with:
  - React 18
  - OpenLayers 8
  - TypeScript
  - Vite
- Uses WMS capabilities polling for latest radar data
- Implements smooth frame transitions
- Caches radar frames for better performance
- Follows PWA guidelines for offline capability
- Includes automatic deployment via GitHub Actions

## Development Guidelines

- Map interactions are handled by OpenLayers
- Time dimension parsing supports both range and discrete time formats
- Animation frame caching implemented for smooth playback
- Settings stored in localStorage for persistence
- Error handling implemented for all network requests
- Responsive design breakpoints at 600px

## Browser Support

Tested and supported on latest versions of:
- Chrome
- Firefox
- Safari

No polyfills required.

## License

[Add your license here]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request