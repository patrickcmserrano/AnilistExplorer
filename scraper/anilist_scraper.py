#!/usr/bin/env python3
"""
AniList Scraper - Anime Explorer
Busca animes populares do AniList com múltiplas imagens
"""

import requests
import json
import time
from datetime import datetime
from typing import List, Dict, Optional

class AniListScraper:
    """Scraper para buscar dados de animes do AniList GraphQL API + Jikan API (screenshots)"""
    
    def __init__(self, fetch_screenshots: bool = True):
        self.api_url = "https://graphql.anilist.co"
        self.jikan_url = "https://api.jikan.moe/v4"
        self.fetch_screenshots = fetch_screenshots
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })
    
    def fetch_popular_animes(self, page: int = 1, per_page: int = 50) -> List[Dict]:
        """Busca animes populares do AniList"""
        query = '''
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: POPULARITY_DESC) {
              id
              title {
                english
                romaji
                native
              }
              description
              coverImage {
                large
                extraLarge
              }
              bannerImage
              genres
              status
              format
              episodes
              season
              seasonYear
              startDate {
                year
                month
                day
              }
              averageScore
              popularity
              favourites
              trailer {
                id
                site
              }
              studios(isMain: true) {
                nodes {
                  name
                }
              }
              externalLinks {
                site
                url
                type
              }
              characters(perPage: 15, sort: [ROLE, FAVOURITES_DESC]) {
                edges {
                  node {
                    id
                    name {
                      full
                    }
                    image {
                      large
                    }
                  }
                  role
                }
              }
              nextAiringEpisode {
                airingAt
                episode
              }
              idMal
            }
          }
        }
        '''
        
        variables = {'page': page, 'perPage': per_page}
        
        try:
            response = self.session.post(
                self.api_url,
                json={'query': query, 'variables': variables},
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            
            if 'errors' in data:
                print(f"❌ GraphQL Error: {data['errors']}")
                return []
            
            return data.get('data', {}).get('Page', {}).get('media', [])
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Request Error: {e}")
            return []
    
    def fetch_jikan_screenshots(self, mal_id: Optional[int], max_retries: int = 3) -> List[Dict]:
        """Busca screenshots do anime via Jikan API (MyAnimeList)"""
        if not mal_id:
            return []
        
        for attempt in range(max_retries):
            try:
                # Rate limiting: Jikan permite 60 req/min (aguardar 2 seg entre requests)
                time.sleep(2.0)
                
                response = self.session.get(
                    f"{self.jikan_url}/anime/{mal_id}/pictures",
                    timeout=15
                )
                
                if response.status_code == 404:
                    return []
                
                if response.status_code == 429:
                    # Rate limited - aguardar mais tempo
                    if attempt < max_retries - 1:
                        wait_time = (attempt + 1) * 5
                        print(f"  ⏳ Rate limited, aguardando {wait_time}s...")
                        time.sleep(wait_time)
                        continue
                    else:
                        return []
                
                response.raise_for_status()
                data = response.json()
                
                screenshots = []
                if data.get('data'):
                    for idx, pic in enumerate(data['data'][:10]):  # Limitar a 10 screenshots
                        screenshots.append({
                            'url': pic.get('jpg', {}).get('large_image_url') or pic.get('jpg', {}).get('image_url'),
                            'type': 'screenshot',
                            'source': 'MyAnimeList'
                        })
                
                return screenshots
                
            except requests.exceptions.RequestException as e:
                if attempt < max_retries - 1:
                    time.sleep(2)
                    continue
                print(f"  ⚠️  Jikan API error for MAL ID {mal_id}: {e}")
                return []
        
        return []
    
    def transform_anime(self, anime_raw: Dict) -> Dict:
        """Transforma dados brutos do AniList para o formato usado no app"""
        
        # Extract trailer
        trailer = None
        if anime_raw.get('trailer') and anime_raw['trailer'].get('site') == 'youtube':
            trailer = anime_raw['trailer'].get('id')
        
        # Extract studios
        studios = []
        if anime_raw.get('studios', {}).get('nodes'):
            studios = [s['name'] for s in anime_raw['studios']['nodes']]
        
        # Extract streaming links
        streaming_links = []
        if anime_raw.get('externalLinks'):
            streaming_links = [
                {'type': link['type'], 'url': link['url']}
                for link in anime_raw['externalLinks']
                if link.get('type') in ['STREAMING', 'INFO']
            ]
        
        # Extract character images (até 15 personagens!)
        character_images = []
        if anime_raw.get('characters', {}).get('edges'):
            for edge in anime_raw['characters']['edges']:
                node = edge.get('node', {})
                char_img = node.get('image', {}).get('large')
                char_name = node.get('name', {}).get('full', 'Unknown')
                char_role = edge.get('role', 'BACKGROUND')
                
                if char_img:
                    character_images.append({
                        'url': char_img,
                        'character': char_name,
                        'role': char_role
                    })
        
        # Fetch screenshots from Jikan API
        mal_id = anime_raw.get('idMal')
        if self.fetch_screenshots and mal_id:
            episode_screenshots = self.fetch_jikan_screenshots(mal_id)
        else:
            episode_screenshots = []
        
        # Build anime object
        anime = {
            'id': anime_raw['id'],
            'title': anime_raw.get('title', {}),
            'description': anime_raw.get('description'),
            'coverImage': anime_raw.get('coverImage', {}).get('extraLarge') or anime_raw.get('coverImage', {}).get('large'),
            'bannerImage': anime_raw.get('bannerImage'),
            'characterImages': character_images,
            'episodeScreenshots': episode_screenshots,
            'genres': anime_raw.get('genres', []),
            'status': anime_raw.get('status'),
            'format': anime_raw.get('format'),
            'episodes': anime_raw.get('episodes'),
            'season': anime_raw.get('season'),
            'seasonYear': anime_raw.get('seasonYear'),
            'startDate': anime_raw.get('startDate'),
            'averageScore': anime_raw.get('averageScore'),
            'popularity': anime_raw.get('popularity'),
            'favourites': anime_raw.get('favourites'),
            'trailer': trailer,
            'studios': studios,
            'streamingLinks': streaming_links,
            'nextAiring': None
        }
        
        # Next airing episode
        if anime_raw.get('nextAiringEpisode'):
            anime['nextAiring'] = {
                'episode': anime_raw['nextAiringEpisode'].get('episode'),
                'airingAt': anime_raw['nextAiringEpisode'].get('airingAt')
            }
        
        return anime
    
    def scrape_all(self, total_animes: int = 250, per_page: int = 50, fetch_screenshots: bool = True) -> List[Dict]:
        """Busca múltiplas páginas de animes"""
        all_animes = []
        pages_needed = (total_animes // per_page) + 1
        
        print(f"🔍 Buscando {total_animes} animes mais populares do AniList...")
        print(f"📄 Páginas necessárias: {pages_needed}")
        if fetch_screenshots:
            print(f"📸 Buscando screenshots via Jikan API (pode demorar ~{total_animes * 2}s)")
        else:
            print(f"⚠️  Screenshots desabilitadas (usar --no-screenshots para habilitar)")
        print()
        
        for page in range(1, pages_needed + 1):
            print(f"📄 Página {page}/{pages_needed}...", end=" ")
            
            animes_raw = self.fetch_popular_animes(page=page, per_page=per_page)
            
            if not animes_raw:
                print("❌ Erro ao buscar")
                break
            
            for anime_raw in animes_raw:
                anime = self.transform_anime(anime_raw)
                all_animes.append(anime)
            
            print(f"✅ {len(animes_raw)} animes")
            
            if page < pages_needed:
                time.sleep(0.7)  # Rate limiting
            
            if len(all_animes) >= total_animes:
                break
        
        return all_animes[:total_animes]
    
    def save_to_file(self, animes: List[Dict], output_path: str = "../src/data/anime.json"):
        """Salva animes no arquivo JSON usado pelo app"""
        data = {
            'metadata': {
                'source': 'AniList API',
                'url': 'https://anilist.co',
                'updatedAt': datetime.now().isoformat(),
                'description': 'Legal anime metadata from AniList - No piracy content',
                'disclaimer': 'This data contains only public metadata. Always use official legal platforms to watch anime.',
                'totalAnimes': len(animes),
                'features': [
                    'Cover images (extraLarge quality)',
                    'Banner images',
                    'Character images (up to 15 per anime)',
                    'Episode screenshots (Jikan API / MyAnimeList)',
                    'Streaming links',
                    'Studios and staff',
                    'Genres and scores'
                ]
            },
            'anime': animes
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Arquivo salvo: {output_path}")
        print(f"📊 Total de animes: {len(animes)}")
        
        # Statistics
        with_banner = sum(1 for a in animes if a.get('bannerImage'))
        with_chars = sum(1 for a in animes if a.get('characterImages'))
        with_screenshots = sum(1 for a in animes if a.get('episodeScreenshots'))
        total_char_imgs = sum(len(a.get('characterImages', [])) for a in animes)
        total_screenshots = sum(len(a.get('episodeScreenshots', [])) for a in animes)
        
        print(f"🖼️  Com banner: {with_banner}/{len(animes)}")
        print(f"👥 Com personagens: {with_chars}/{len(animes)}")
        print(f"📸 Com screenshots (Jikan): {with_screenshots}/{len(animes)}")
        print(f"📊 Total de imagens de personagens: {total_char_imgs}")
        print(f"📊 Total de screenshots: {total_screenshots}")
        
        if with_chars > 0:
            avg_chars = total_char_imgs / with_chars
            print(f"📊 Média de personagens por anime: {avg_chars:.1f}")
        
        if with_screenshots > 0:
            avg_screenshots = total_screenshots / with_screenshots
            print(f"📊 Média de screenshots por anime: {avg_screenshots:.1f}")


def main():
    """Função principal"""
    import sys
    import os
    
    # Parse arguments
    fetch_screenshots = '--no-screenshots' not in sys.argv
    
    # Get total animes from environment or default to 250
    total_animes = int(os.environ.get('TOTAL_ANIMES', '250'))
    
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🎬 AniList Scraper - Anime Explorer")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    
    scraper = AniListScraper(fetch_screenshots=fetch_screenshots)
    animes = scraper.scrape_all(total_animes=total_animes, per_page=50, fetch_screenshots=fetch_screenshots)
    
    if animes:
        scraper.save_to_file(animes)
        print("\n✅ Scraping concluído com sucesso!")
    else:
        print("\n❌ Falha no scraping")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
