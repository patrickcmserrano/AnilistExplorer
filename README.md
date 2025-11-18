# AnilistExplorer

A modern, high-performance web application for browsing and exploring anime metadata from AniList and MyAnimeList APIs. Built with Astro, React, and TypeScript, deployed as a static site on GitHub Pages.

## Features

- **Static Site Generation**: Lightning-fast page loads with pre-rendered HTML
- **Interactive Carousel**: Immersive browsing experience with keyboard and touch navigation
- **Advanced Search**: Real-time search with multi-genre filtering and sorting
- **Infinite Scroll**: Smooth, virtualized grid rendering for optimal performance
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Rich Metadata**: Comprehensive anime data including characters, screenshots, trailers, and streaming links
- **Accessibility**: Full keyboard navigation and ARIA support

## Live Demo

Visit the live application: [https://patrickcmserrano.github.io/AnilistExplorer/](https://patrickcmserrano.github.io/AnilistExplorer/)

## Technology Stack

### Frontend
- **Astro 4.0** - Static site generator with partial hydration
- **React 18.2** - Interactive UI components
- **TypeScript 5.9** - Type-safe development
- **Tailwind CSS 3.3** - Utility-first styling

### Build Tools
- **Vite** - Fast development server and build tool
- **esbuild** - JavaScript/CSS minification
- **Rollup** - Code splitting and optimization

### Data Collection
- **Python 3** - Scraper implementation
- **AniList GraphQL API** - Primary anime metadata source
- **Jikan API** - MyAnimeList screenshots and additional data

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+ (for data scraping)

### Installation

```bash
# Clone the repository
git clone https://github.com/patrickcmserrano/AnilistExplorer.git
cd AnilistExplorer

# Install dependencies
npm install

# Install Python dependencies (optional, for scraping)
cd scraper
pip install -r requirements.txt
cd ..
```

### Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:4321` to view the application.

### Building for Production

```bash
# Build static site
npm run build

# Preview production build
npm run preview
```

## Data Management

### Updating Anime Data

The application uses a static JSON file (`src/data/anime.json`) containing anime metadata. To update the data:

```bash
# Run scraper to fetch latest data
npm run scrape

# Run scraper and rebuild site
npm run scrape:prod
```

### Scraper Configuration

```bash
# Set number of anime to fetch (default: 250)
export TOTAL_ANIMES=500
npm run scrape

# Disable screenshot fetching for faster scraping
cd scraper
python3 anilist_scraper.py --no-screenshots
```

## Project Structure

```
AnilistExplorer/
├── src/
│   ├── components/        # UI components (Astro & React)
│   │   ├── carousel/     # Modular carousel system
│   │   ├── AnimeCard.astro
│   │   ├── SearchBar.tsx
│   │   └── InfiniteAnimeGrid.tsx
│   ├── data/             # Static anime metadata
│   ├── layouts/          # Page layouts
│   ├── pages/            # Route definitions
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
├── scraper/              # Python data collection pipeline
├── public/               # Static assets
└── astro.config.mjs      # Astro configuration
```

## Key Features Explained

### Interactive Carousel

Navigate through anime with an immersive full-screen carousel featuring:

- **Keyboard shortcuts**: Arrow keys/WASD for navigation, F for fullscreen, I for info overlay
- **Touch gestures**: Swipe horizontally (images) and vertically (anime)
- **Multiple image sources**: Cover, banner, characters, and episode screenshots
- **Progressive disclosure**: Toggle information overlay on demand

### Advanced Search & Filtering

- **Real-time search**: Searches across English, Romaji, and Native titles
- **Genre filtering**: Multi-select genre filters
- **Flexible sorting**: Sort by popularity, score, title, or episode count
- **URL state sync**: Shareable filter states via query parameters

### Performance Optimizations

- **Static generation**: All pages pre-rendered at build time
- **Code splitting**: Vendor bundles and route-based chunks
- **Lazy loading**: Images and components load on demand
- **Virtual rendering**: Infinite scroll with Intersection Observer API

## Deployment

The application is configured for automated deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

Push to `main` or `AnimeExplorer` branch triggers automatic deployment.

### Manual Deployment

1. Go to repository Settings > Pages
2. Select "GitHub Actions" as source
3. Push code or run workflow manually from Actions tab

For detailed deployment instructions, see [DEPLOY.md](DEPLOY.md).

## Documentation

- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Comprehensive technical documentation
- **[DEPLOY.md](DEPLOY.md)** - Deployment guide and configuration
- **[IMPROVEMENTS.md](IMPROVEMENTS.md)** - Future enhancements and testing strategy
- **[Component READMEs](src/components/carousel/README.md)** - Individual component documentation

## API Data Sources

### AniList API
Primary source for anime metadata including titles, descriptions, genres, studios, streaming links, and character information.

- **Endpoint**: `https://graphql.anilist.co`
- **Type**: GraphQL
- **Documentation**: [https://anilist.gitbook.io/anilist-apiv2-docs/](https://anilist.gitbook.io/anilist-apiv2-docs/)

### Jikan API
MyAnimeList wrapper for additional screenshots and imagery.

- **Endpoint**: `https://api.jikan.moe/v4`
- **Type**: REST
- **Documentation**: [https://docs.api.jikan.moe/](https://docs.api.jikan.moe/)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Metrics

Target Lighthouse scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- **AniList** - For providing comprehensive anime metadata through their GraphQL API
- **Jikan/MyAnimeList** - For additional anime imagery and data
- **Astro** - For the excellent static site generation framework
- **React** - For the powerful component library
- **Tailwind CSS** - For the utility-first styling approach

## Contact

Project Link: [https://github.com/patrickcmserrano/AnilistExplorer](https://github.com/patrickcmserrano/AnilistExplorer)

## Legal Disclaimer

This application aggregates publicly available anime metadata for informational purposes only. All anime data is sourced from legal APIs (AniList, MyAnimeList). No pirated content is hosted, linked, or distributed. Users are encouraged to watch anime through official legal streaming platforms.

---

Built with passion for anime and modern web technologies.
