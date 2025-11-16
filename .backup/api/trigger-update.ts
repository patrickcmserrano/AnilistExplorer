/**
 * API Endpoint: Trigger Scraper Update
 * POST /api/trigger-update?token=YOUR_TOKEN
 * 
 * Dispara o Render Deploy Hook do Cron Job para atualizar dados.
 * Requer UPDATE_TOKEN nas env vars.
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  
  // Verificar token de segurança
  const validToken = import.meta.env.UPDATE_TOKEN;
  
  if (!validToken || token !== validToken) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized',
      message: 'Invalid or missing UPDATE_TOKEN'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Se tiver Deploy Hook configurado, trigger o Cron Job
    const deployHookUrl = import.meta.env.RENDER_DEPLOY_HOOK_URL;
    
    if (deployHookUrl) {
      const response = await fetch(deployHookUrl, { 
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Deploy hook failed: ${response.statusText}`);
      }

      return new Response(JSON.stringify({ 
        status: 'triggered',
        message: 'Scraper update job started via Deploy Hook',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback: apenas confirma que endpoint está ativo
    return new Response(JSON.stringify({ 
      status: 'acknowledged',
      message: 'Update trigger received. Configure RENDER_DEPLOY_HOOK_URL for automatic updates.',
      timestamp: new Date().toISOString(),
      note: 'Cron job runs daily at 2 AM UTC'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error triggering update:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Health check para o endpoint
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    endpoint: '/api/trigger-update',
    method: 'POST',
    auth: 'Required: ?token=YOUR_UPDATE_TOKEN',
    status: 'active',
    cronSchedule: '0 2 * * * (2 AM UTC)',
    documentation: 'See DEPLOY.md for usage'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
