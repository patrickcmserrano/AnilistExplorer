
# Documentation

## Project Structure

The project is structured as follows:

```
/
|-- public/
|   |-- robots.txt
|-- scraper/
|   |-- anilist_scraper.py
|   |-- requirements.txt
|-- src/
|   |-- components/
|   |   |-- AnimeCard.astro
|   |   |-- AnimeDescription.astro
|   |   |-- AnimeGrid.astro
|   |   |-- AnimeHeader.astro
|   |   |-- AnimeSidebar.astro
|   |   |-- AnimeStats.astro
|   |   |-- CoverCarousel.tsx
|   |   |-- Gallery.astro
|   |   |-- InfiniteAnimeGrid.tsx
|   |   |-- SearchBar.tsx
|   |   |-- Toast.tsx
|   |   |-- Trailer.astro
|   |-- data/
|   |   |-- anime.json
|   |-- layouts/
|   |   |-- Layout.astro
|   |-- pages/
|   |   |-- index.astro
|   |   |-- anime/
|   |       |-- [id].astro
|   |-- styles/
|   |   |-- global.css
|   |-- utils/
|       |-- debug.ts
|       |-- streamingServices.ts
|-- astro.config.mjs
|-- package.json
|-- tailwind.config.cjs
|-- tsconfig.json
```

## Components

The components are located in the `src/components` directory. They are written in Astro and React.

### Astro Components

- `AnimeCard.astro`: Displays a card with anime information.
- `AnimeDescription.astro`: Displays the description of an anime.
- `AnimeGrid.astro`: Displays a grid of anime cards.
- `AnimeHeader.astro`: Displays the header of the anime page.
- `AnimeSidebar.astro`: Displays the sidebar of the anime page.
- `AnimeStats.astro`: Displays the statistics of an anime.
- `Gallery.astro`: Displays a gallery of images.
- `Trailer.astro`: Displays the trailer of an anime.

### React Components

- `CoverCarousel.tsx`: Displays a carousel of anime covers.
- `InfiniteAnimeGrid.tsx`: Displays an infinite grid of anime cards.
- `SearchBar.tsx`: Displays a search bar.
- `Toast.tsx`: Displays a toast notification.

## Data

The data is located in the `src/data` directory. It is a JSON file with anime information.

- `anime.json`: Contains all the anime information.

## Layouts

The layouts are located in the `src/layouts` directory. They are written in Astro.

- `Layout.astro`: The main layout of the application.

## Pages

The pages are located in the `src/pages` directory. They are written in Astro.

- `index.astro`: The home page of the application.
- `anime/[id].astro`: The anime page of the application.

## Styles

The styles are located in the `src/styles` directory. They are written in CSS.

- `global.css`: The global styles of the application.

## Utils

The utils are located in the `src/utils` directory. They are written in TypeScript.

- `debug.ts`: Contains debug functions.
- `streamingServices.ts`: Contains streaming services information.

## Scraper

The scraper is located in the `scraper` directory. It is written in Python.

- `anilist_scraper.py`: Scrapes anime information from the Anilist API.
- `requirements.txt`: Contains the dependencies of the scraper.
