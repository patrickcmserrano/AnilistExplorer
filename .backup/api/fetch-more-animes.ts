import type { APIRoute } from 'astro';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export const prerender = false;

// Cache configuration
const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCacheKey(startPage: number, numPages: number): string {
  return `anilist-pages-${startPage}-${startPage + numPages - 1}.json`;
}

function getCachePath(startPage: number, numPages: number): string {
  return path.join(CACHE_DIR, getCacheKey(startPage, numPages));
}

function isCacheValid(cachePath: string): boolean {
  try {
    if (!fs.existsSync(cachePath)) return false;
    
    const stats = fs.statSync(cachePath);
    const cacheAge = Date.now() - stats.mtime.getTime();
    
    return cacheAge < CACHE_DURATION;
  } catch {
    return false;
  }
}

function readCache(startPage: number, numPages: number): any {
  try {
    const cachePath = getCachePath(startPage, numPages);
    
    if (isCacheValid(cachePath)) {
      const data = fs.readFileSync(cachePath, 'utf-8');
      const cached = JSON.parse(data);
      console.log(`[CACHE HIT] Pages ${startPage}-${startPage + numPages - 1}`);
      return { ...cached, fromCache: true };
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }
  
  return null;
}

function writeCache(startPage: number, numPages: number, data: any): void {
  try {
    ensureCacheDir();
    const cachePath = getCachePath(startPage, numPages);
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[CACHE WRITE] Pages ${startPage}-${startPage + numPages - 1}`);
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const totalAnimes = parseInt(url.searchParams.get('total') || '500', 10);
  const fetchScreenshots = url.searchParams.get('screenshots') !== 'false';

  // Validate params
  if (isNaN(totalAnimes) || totalAnimes < 100 || totalAnimes > 1000) {
    return new Response(JSON.stringify({ 
      error: 'Invalid parameters. total must be between 100-1000' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Path to new AniList scraper
    const scraperDir = path.join(process.cwd(), 'scraper');
    const scraperScript = path.join(scraperDir, 'anilist_scraper.py');
    
    // Check for venv Python (preferred) or fall back to system Python
    const venvPython = path.join(scraperDir, '.venv', 'bin', 'python3');
    const pythonExecutable = fs.existsSync(venvPython) ? venvPython : 'python3';
    
    // Verify scraper script exists
    if (!fs.existsSync(scraperScript)) {
      return new Response(JSON.stringify({ 
        error: `Scraper not found at: ${scraperScript}` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Execute Python script with arguments
    const args = [scraperScript];
    if (!fetchScreenshots) {
      args.push('--no-screenshots');
    }
    
    const pythonProcess = spawn(pythonExecutable, args, {
      cwd: scraperDir,
      env: { 
        ...process.env, 
        PYTHONUNBUFFERED: '1',
        TOTAL_ANIMES: totalAnimes.toString()
      }
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const result = await new Promise<{ success?: boolean; error?: string }>((resolve) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Scraper failed with code:', code);
          console.error('stderr:', stderr);
          
          if (stderr.includes('429') || stderr.includes('Too Many Requests')) {
            resolve({ error: 'Rate limit atingido. Aguarde alguns minutos e tente novamente.' });
          } else {
            resolve({ error: `Erro no scraper: ${stderr.split('\n').slice(0, 2).join(' ')}` });
          }
          return;
        }

        resolve({ success: true });
      });

      // Timeout after 20 minutes (AniList + Jikan can take a while)
      setTimeout(() => {
        pythonProcess.kill();
        resolve({ error: 'Scraper timeout (20min exceeded)' });
      }, 1200000);
    });

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Scraping concluído! Recarregue a página para ver os novos animes.',
      totalAnimes
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
