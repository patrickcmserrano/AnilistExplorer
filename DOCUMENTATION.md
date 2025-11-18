# AnilistExplorer - Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [Data Pipeline](#data-pipeline)
7. [Build and Deployment](#build-and-deployment)
8. [Development Guidelines](#development-guidelines)
9. [API Reference](#api-reference)
10. [Performance Optimization](#performance-optimization)

---

## Overview

AnilistExplorer is a static site generator-based web application that provides a comprehensive interface for browsing and exploring anime metadata. The application aggregates data from AniList and MyAnimeList APIs, presenting it through an optimized, responsive user interface built with modern web technologies.

### Key Features

- Static site generation for optimal performance and SEO
- Advanced search and filtering capabilities
- Interactive carousel with keyboard and touch navigation
- Infinite scroll with virtual rendering
- Responsive design with Tailwind CSS
- Comprehensive anime metadata including characters, screenshots, and streaming links
- Full accessibility support with ARIA labels and keyboard navigation

### Target Deployment

The application is designed for deployment on GitHub Pages as a fully static website with pre-rendered HTML pages for all anime entries.

---

## Architecture

### Architectural Pattern

The application follows a **JAMstack architecture** (JavaScript, APIs, Markup):

- **Static Site Generation (SSG)**: All pages are pre-rendered at build time using Astro
- **Component-Based Architecture**: UI is built using modular components (Astro and React)
- **Data Pipeline**: Python-based scraper fetches and transforms data during build process
- **Client-Side Hydration**: React components provide interactivity through selective hydration

### Design Principles

1. **Performance First**: Static generation ensures minimal Time to Interactive (TTI)
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Separation of Concerns**: Clear boundaries between data, presentation, and business logic
4. **Modularity**: Components are self-contained and reusable
5. **Type Safety**: TypeScript throughout the codebase for reliability

---

## Technology Stack

### Frontend Framework

- **Astro 4.0**: Static site generator with partial hydration
- **React 18.2**: Component library for interactive UI elements
- **TypeScript 5.9**: Type-safe development experience

### Styling

- **Tailwind CSS 3.3**: Utility-first CSS framework
- **Custom CSS**: Global styles and animations in `src/styles/global.css`

### Build Tools

- **Vite**: Fast build tool and development server
- **esbuild**: JavaScript/CSS minification
- **Rollup**: Code splitting and chunk optimization

### Data Collection

- **Python 3**: Scraper implementation language
- **Requests**: HTTP client for API communication
- **GraphQL**: Query language for AniList API
- **REST API**: Jikan API (MyAnimeList wrapper)

### Development Tools

- **Node.js**: JavaScript runtime environment
- **npm**: Package manager
- **Git**: Version control

---

## Project Structure

```
AnilistExplorer/
├── public/                          # Static assets
│   ├── robots.txt                   # Search engine directives
│   └── .nojekyll                    # GitHub Pages configuration
│
├── scraper/                         # Data collection pipeline
│   ├── anilist_scraper.py          # Main scraper implementation
│   └── requirements.txt             # Python dependencies
│
├── src/                             # Application source code
│   ├── components/                  # UI components
│   │   ├── carousel/               # Carousel module (refactored)
│   │   │   ├── CoverCarousel.tsx              # Main carousel orchestrator
│   │   │   ├── CarouselImageDisplay.tsx       # Image rendering component
│   │   │   ├── CarouselInfoOverlay.tsx        # Information overlay
│   │   │   ├── CarouselNavigationButtons.tsx  # Navigation controls
│   │   │   ├── CarouselActionButtons.tsx      # Action buttons
│   │   │   ├── CarouselProgressBar.tsx        # Progress indicator
│   │   │   ├── useKeyboardNavigation.ts       # Keyboard event handler
│   │   │   ├── useTouchNavigation.ts          # Touch gesture handler
│   │   │   ├── useFullscreen.ts               # Fullscreen API hook
│   │   │   ├── types.ts                       # TypeScript definitions
│   │   │   ├── utils.ts                       # Utility functions
│   │   │   ├── index.ts                       # Module exports
│   │   │   └── README.md                      # Component documentation
│   │   ├── AnimeCard.astro                    # Anime card component
│   │   ├── AnimeDescription.astro             # Description display
│   │   ├── AnimeGrid.astro                    # Grid layout
│   │   ├── AnimeHeader.astro                  # Page header
│   │   ├── AnimeSidebar.astro                 # Sidebar with stats
│   │   ├── AnimeStats.astro                   # Statistics display
│   │   ├── Gallery.astro                      # Image gallery
│   │   ├── InfiniteAnimeGrid.tsx              # Infinite scroll grid
│   │   ├── SearchBar.tsx                      # Search and filter UI
│   │   ├── Toast.tsx                          # Notification component
│   │   └── Trailer.astro                      # YouTube embed
│   │
│   ├── data/                        # Application data
│   │   └── anime.json              # Anime metadata database
│   │
│   ├── layouts/                     # Page layouts
│   │   └── Layout.astro            # Base layout template
│   │
│   ├── pages/                       # Route definitions
│   │   ├── index.astro             # Homepage
│   │   └── anime/
│   │       └── [id].astro          # Dynamic anime detail pages
│   │
│   ├── styles/                      # Global styles
│   │   └── global.css              # CSS custom properties and utilities
│   │
│   ├── utils/                       # Utility modules
│   │   ├── debug.ts                # Development logging utilities
│   │   └── streamingServices.ts    # Streaming platform detection
│   │
│   └── env.d.ts                     # TypeScript environment declarations
│
├── astro.config.mjs                 # Astro configuration
├── package.json                     # Node.js dependencies and scripts
├── tailwind.config.cjs              # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript compiler configuration
├── DOCUMENTATION.md                 # This file
├── DEPLOY.md                        # Deployment instructions
├── IMPROVEMENTS.md                  # Future enhancement proposals
└── README.md                        # Project introduction
```

---

## Core Components

### 1. Carousel System

The carousel is a modular, refactored component system that provides an immersive browsing experience.

#### Architecture

**Component Hierarchy:**
```
CoverCarousel (orchestrator)
├── CarouselImageDisplay (presentation)
├── CarouselInfoOverlay (information)
├── CarouselNavigationButtons (controls)
├── CarouselActionButtons (actions)
└── CarouselProgressBar (feedback)
```

**Hook System:**
```
useKeyboardNavigation → Event listeners for keyboard shortcuts
useTouchNavigation → Gesture recognition for touch devices
useFullscreen → Fullscreen API integration
```

#### Key Features

- **Multi-source images**: Supports cover, banner, character, and screenshot images
- **Keyboard navigation**: Arrow keys, WASD, Enter, F (fullscreen), I (info), Esc
- **Touch gestures**: Horizontal swipe (images), vertical swipe (anime)
- **Progressive disclosure**: Information overlay toggleable with keyboard/button
- **Accessibility**: ARIA labels, keyboard focus management, semantic HTML

#### State Management

```typescript
interface CarouselState {
  currentAnimeIndex: number;      // Current anime in list
  currentImageIndex: number;      // Current image for this anime
  isHovering: boolean;            // Mouse hover state
  showInfo: boolean;              // Info overlay visibility
}
```

### 2. Search and Filter System

#### Component: `SearchBar.tsx`

**Capabilities:**
- Real-time search across title fields (English, Romaji, Native)
- Multi-select genre filtering
- Sort options (Popularity, Score, Title, Episodes)
- Client-side filtering with useMemo optimization
- URL state synchronization via query parameters

**State Management:**
```typescript
interface SearchState {
  searchQuery: string;           // User input
  selectedGenres: string[];      // Active genre filters
  sortBy: SortOption;           // Current sort method
}
```

**Performance:**
- Debounced search input
- Memoized filter results
- Virtualized rendering for large result sets

### 3. Infinite Scroll Grid

#### Component: `InfiniteAnimeGrid.tsx`

**Features:**
- Virtualized rendering with Intersection Observer API
- Dynamic loading of anime cards in batches
- Configurable batch size (default: 20 items)
- Scroll position restoration
- Loading state indicators

**Implementation:**
```typescript
const ITEMS_PER_PAGE = 20;
const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      }
    },
    { threshold: 0.1 }
  );
  // Observer logic
}, []);
```

### 4. Static Page Generation

#### Homepage: `src/pages/index.astro`

**Responsibilities:**
- Load and parse anime.json data
- Initialize SearchBar with full dataset
- Render initial InfiniteAnimeGrid
- Display carousel with top anime by popularity

**Data Flow:**
```javascript
// Load data at build time
import animeData from '../data/anime.json';

// Parse both legacy and new formats
const animeArray = animeData?.anime || Object.values(animeData);

// Sort for carousel
const sortedByPopularity = [...animeArray]
  .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
```

#### Detail Pages: `src/pages/anime/[id].astro`

**Generation:**
```javascript
export function getStaticPaths() {
  const animeArray = /* parse anime.json */;
  
  return animeArray.map((anime) => ({
    params: { id: String(anime.id) },
    props: { anime }
  }));
}
```

**Features:**
- Pre-rendered at build time for all anime
- Optimized images with lazy loading
- YouTube trailer embeds
- Streaming service links with icon detection
- Character information
- Statistics and metadata

---

## Data Pipeline

### Scraper Architecture

The data collection pipeline is implemented in Python and follows a multi-stage process:

#### Stage 1: AniList GraphQL Query

**Endpoint:** `https://graphql.anilist.co`

**Query Structure:**
```graphql
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: POPULARITY_DESC) {
      id
      title { english, romaji, native }
      description
      coverImage { large, extraLarge }
      bannerImage
      genres
      status
      format
      episodes
      season
      seasonYear
      startDate { year, month, day }
      averageScore
      popularity
      favourites
      trailer { id, site }
      studios(isMain: true) { nodes { name } }
      externalLinks { site, url, type }
      characters(perPage: 15, sort: [ROLE, FAVOURITES_DESC]) {
        edges {
          node {
            id
            name { full }
            image { large }
          }
          role
        }
      }
      nextAiringEpisode { airingAt, episode }
      idMal
    }
  }
}
```

#### Stage 2: Jikan API Screenshots

**Endpoint:** `https://api.jikan.moe/v4/anime/{mal_id}/pictures`

**Rate Limiting:**
- 60 requests per minute
- 2-second delay between requests
- Exponential backoff on 429 responses
- Maximum 3 retry attempts

**Error Handling:**
```python
for attempt in range(max_retries):
    try:
        time.sleep(2.0)  # Rate limiting
        response = self.session.get(url, timeout=15)
        
        if response.status_code == 429:
            wait_time = (attempt + 1) * 5
            time.sleep(wait_time)
            continue
            
        response.raise_for_status()
        return process_screenshots(response.json())
        
    except requests.exceptions.RequestException:
        if attempt < max_retries - 1:
            continue
        return []
```

#### Stage 3: Data Transformation

**Input:** Raw API responses  
**Output:** Normalized JSON structure

**Transformation Logic:**
```python
def transform_anime(self, anime_raw: Dict) -> Dict:
    return {
        'id': anime_raw['id'],
        'title': {
            'english': anime_raw['title']['english'],
            'romaji': anime_raw['title']['romaji'],
            'native': anime_raw['title']['native']
        },
        'coverImage': anime_raw['coverImage']['extraLarge'],
        'bannerImage': anime_raw['bannerImage'],
        'characterImages': extract_characters(anime_raw),
        'episodeScreenshots': fetch_screenshots(anime_raw['idMal']),
        'genres': anime_raw['genres'],
        'status': anime_raw['status'],
        'averageScore': anime_raw['averageScore'],
        'popularity': anime_raw['popularity'],
        'trailer': extract_trailer(anime_raw),
        'studios': extract_studios(anime_raw),
        'streamingLinks': extract_streaming(anime_raw)
    }
```

#### Stage 4: Output Generation

**File:** `src/data/anime.json`

**Format:**
```json
{
  "metadata": {
    "source": "AniList API",
    "url": "https://anilist.co",
    "updatedAt": "2025-11-18T10:30:00.000Z",
    "totalAnimes": 250,
    "features": [
      "Cover images (extraLarge quality)",
      "Banner images",
      "Character images (up to 15 per anime)",
      "Episode screenshots (Jikan API / MyAnimeList)",
      "Streaming links",
      "Studios and staff",
      "Genres and scores"
    ]
  },
  "anime": [
    {
      "id": 1,
      "title": { ... },
      ...
    }
  ]
}
```

### Running the Scraper

**Development Mode:**
```bash
npm run scrape
```

**Production Mode:**
```bash
npm run scrape:prod  # Scrapes and rebuilds site
```

**Configuration:**
```bash
# Environment variables
TOTAL_ANIMES=250  # Number of anime to fetch (default: 250)

# Command-line flags
python3 anilist_scraper.py --no-screenshots  # Disable screenshot fetching
```

---

## Build and Deployment

### Local Development

**Start development server:**
```bash
npm install
npm run dev
```

**Server:** `http://localhost:4321`

**Features:**
- Hot module replacement (HMR)
- Fast refresh for React components
- Astro component live updates

### Production Build

**Build static site:**
```bash
npm run build
```

**Output:** `dist/` directory containing:
- Pre-rendered HTML pages for all routes
- Optimized JavaScript bundles with code splitting
- CSS files with Tailwind purge
- Static assets

**Build Statistics:**
- Total pages: 501 (1 homepage + 500 anime detail pages)
- Build time: ~30-60 seconds
- Bundle size: ~500KB (gzipped)

### Preview Build

**Test production build locally:**
```bash
npm run preview
```

### GitHub Pages Deployment

The application is configured for automated deployment via GitHub Actions.

**Configuration:** `.github/workflows/deploy.yml`

**Trigger Events:**
- Push to `main` branch
- Push to `AnimeExplorer` branch
- Manual workflow dispatch

**Build Process:**
1. Checkout repository
2. Setup Node.js environment
3. Install dependencies
4. Run production build
5. Deploy to GitHub Pages

**Astro Configuration:**
```javascript
export default defineConfig({
  output: 'static',
  site: 'https://patrickcmserrano.github.io',
  base: process.env.NODE_ENV === 'production' 
    ? '/AnilistExplorer' 
    : '/',
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  }
});
```

**Deployment URL:**
```
https://patrickcmserrano.github.io/AnilistExplorer/
```

---

## Development Guidelines

### Code Style

**TypeScript:**
- Use strict mode
- Define explicit types for function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use enum for fixed sets of constants

**React Components:**
- Functional components with hooks
- Use client:load directive for interactive Astro components
- Implement proper cleanup in useEffect hooks
- Memoize expensive computations with useMemo

**Astro Components:**
- Use TypeScript in frontmatter
- Implement proper prop validation
- Prefer Astro components over React for static content
- Use prerender for static pages

### File Organization

**Component Structure:**
```
ComponentName/
├── index.ts              # Public exports
├── ComponentName.tsx     # Main component
├── types.ts             # TypeScript definitions
├── utils.ts             # Helper functions
├── hooks/               # Custom hooks
└── README.md            # Component documentation
```

**Naming Conventions:**
- Components: PascalCase (e.g., `AnimeCard.tsx`)
- Utilities: camelCase (e.g., `streamingServices.ts`)
- Constants: UPPER_SNAKE_CASE
- Hooks: camelCase with 'use' prefix (e.g., `useKeyboardNavigation.ts`)

### Performance Best Practices

1. **Lazy Loading:**
   - Use `client:load` for below-fold components
   - Implement Intersection Observer for infinite scroll
   - Lazy load images with loading="lazy"

2. **Code Splitting:**
   - Configure manual chunks for vendor libraries
   - Split React components from Astro pages
   - Optimize bundle size with tree shaking

3. **Caching:**
   - Leverage browser cache for static assets
   - Implement service worker for offline support (future)
   - Use CDN for image delivery (future)

### Accessibility Standards

**WCAG 2.1 AA Compliance:**
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Sufficient color contrast ratios
- Focus indicators on interactive elements
- Alt text for all images

**Keyboard Shortcuts:**
```
Arrow Keys / WASD: Navigation
Enter: Open anime detail
F: Toggle fullscreen
I: Toggle information overlay
Esc: Close fullscreen/overlay
Tab: Focus navigation
```

---

## API Reference

### Utility Functions

#### `streamingServices.ts`

**getStreamingServiceName(url: string): string**

Extracts streaming service name from URL.

```typescript
getStreamingServiceName('https://www.crunchyroll.com/series/...')
// Returns: 'Crunchyroll'
```

**getStreamingIcon(url: string): string**

Returns emoji icon for streaming service.

```typescript
getStreamingIcon('https://www.netflix.com/title/...')
// Returns: '📺'
```

#### `debug.ts`

**debugLog(component: string, message: string, data?: any): void**

Development logging utility with formatted output.

```typescript
debugLog('SearchBar', 'Filter applied', { genres: ['Action'] });
// Console: [10:30:45] SearchBar: Filter applied { genres: ['Action'] }
```

### Carousel Utilities

#### `carousel/utils.ts`

**getTitle(anime: Anime): string**

Extracts display title with fallback logic.

```typescript
getTitle(anime)
// Priority: English → Romaji → Native → 'Unknown'
```

**getAvailableImages(anime: Anime): ImageItem[]**

Aggregates all available images from multiple sources.

```typescript
getAvailableImages(anime)
// Returns: Array of { url, type, label, character?, role? }
```

### React Hooks

#### `useKeyboardNavigation`

Handles keyboard event listeners for carousel navigation.

**Parameters:**
```typescript
interface UseKeyboardNavigationProps {
  carouselRef: RefObject<HTMLDivElement>;
  currentAnimeIndex: number;
  currentImageIndex: number;
  totalAnimes: number;
  imageCount: number;
  nextImage: () => void;
  prevImage: () => void;
  nextAnime: () => void;
  prevAnime: () => void;
  openAnime: () => void;
  toggleInfo: () => void;
  toggleFullscreen: () => void;
}
```

#### `useTouchNavigation`

Detects and handles touch gestures.

**Returns:**
```typescript
{
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleTouchEnd: (e: TouchEvent) => void;
}
```

#### `useFullscreen`

Manages fullscreen state with Fullscreen API.

**Returns:**
```typescript
{
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}
```

---

## Performance Optimization

### Current Optimizations

1. **Static Site Generation:**
   - Zero server-side rendering latency
   - Pre-rendered HTML for instant page loads
   - Optimized for CDN distribution

2. **Code Splitting:**
   - React vendor bundle separated
   - Per-route code splitting
   - Dynamic imports for heavy components

3. **Asset Optimization:**
   - esbuild minification
   - CSS purging via Tailwind
   - Automatic chunk deduplication

4. **Runtime Performance:**
   - Memoized search results
   - Virtualized infinite scroll
   - Debounced user inputs
   - Intersection Observer for lazy loading

### Performance Metrics

**Target Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**Lighthouse Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

### Future Optimizations

1. **Image Optimization:**
   - Implement responsive images with srcset
   - Use next-gen formats (WebP, AVIF)
   - Integrate image CDN (Cloudinary, imgix)

2. **Caching Strategy:**
   - Implement service worker
   - Cache API responses
   - Offline mode support

3. **Bundle Optimization:**
   - Analyze and reduce bundle size
   - Implement route-based prefetching
   - Use module preloading

---

## Conclusion

This documentation provides a comprehensive technical overview of the AnilistExplorer application. For additional information, refer to:

- **DEPLOY.md**: Deployment instructions and GitHub Pages configuration
- **IMPROVEMENTS.md**: Future enhancement proposals and testing strategy
- **README.md**: Project introduction and quick start guide
- **Component READMEs**: Detailed component documentation in respective directories

For questions or contributions, please refer to the project repository.
