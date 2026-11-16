/**
 * worker.js — Cloudflare Worker Anycast para Tabela FIPE & Avaliação Veicular Pro API
 *
 * @license MIT
 * @see https://github.com/clepta2/fipe-pro
 */

import {
  FipePro,
  VEICULOS_FIPE_CATALOGO,
  ALIQUOTAS_IPVA_27_UFS,
  consultarPorCodigoFipe,
  consultarFipePorPlaca,
  decodificarChassiVin,
  renderFipeCardSvg
} from './fipe-pro.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  'Access-Control-Max-Age': '86400',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Ponte-Version': '3.0.0'
};

const PLANOS_CONFIG = {
  free: { nome: 'Free / Sandbox', rpm: 30, cotaDiaria: 500, prefixo: 'fipe_free_' },
  starter: { nome: 'Starter 86.400 (1 req/s)', rpm: 60, cotaDiaria: 86400, prefixo: 'fipe_start_' },
  pro: { nome: 'Pro (5 req/s)', rpm: 300, cotaDiaria: 250000, prefixo: 'fipe_pro_' },
  business: { nome: 'Business (20 req/s)', rpm: 1200, cotaDiaria: 1000000, prefixo: 'fipe_biz_' },
  master: { nome: 'Master Admin (Bypass)', rpm: 3000, cotaDiaria: Infinity, prefixo: 'fipe_master_' }
};

const minuteBuckets = new Map();
const dailyBuckets = new Map();
const WINDOW_MINUTE_MS = 60 * 1000;
const WINDOW_DAILY_MS = 86400 * 1000;
const BOOT_TIME = Date.now();

function resolverPlanoEChave(request) {
  const authHeader = request.headers.get('Authorization') || '';
  const xApiKey = request.headers.get('x-api-key') || '';
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('key') || url.searchParams.get('api_key') || '';

  let token = '';
  if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7).trim();
  else if (xApiKey) token = xApiKey.trim();
  else if (queryKey) token = queryKey.trim();

  if (!token) {
    const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || 'anonymous_ip';
    return { plano: 'free', keyId: `ip_${clientIp}`, config: PLANOS_CONFIG.free, isAnonymous: true };
  }

  if (token.startsWith('fipe_master_') || token.startsWith('pnt_master_')) {
    return { plano: 'master', keyId: token, config: PLANOS_CONFIG.master, isAnonymous: false };
  }
  if (token.startsWith('fipe_biz_') || token.startsWith('pnt_biz_')) {
    return { plano: 'business', keyId: token, config: PLANOS_CONFIG.business, isAnonymous: false };
  }
  if (token.startsWith('fipe_pro_') || token.startsWith('pnt_pro_')) {
    return { plano: 'pro', keyId: token, config: PLANOS_CONFIG.pro, isAnonymous: false };
  }
  if (token.startsWith('fipe_start_') || token.startsWith('pnt_start_')) {
    return { plano: 'starter', keyId: token, config: PLANOS_CONFIG.starter, isAnonymous: false };
  }
  return { plano: 'free', keyId: token, config: PLANOS_CONFIG.free, isAnonymous: false };
}

function aplicarRateLimit(keyId, config) {
  const now = Date.now();

  let dailyBucket = dailyBuckets.get(keyId);
  if (!dailyBucket || now > dailyBucket.resetAt) {
    dailyBucket = { count: 0, resetAt: now + WINDOW_DAILY_MS };
    dailyBuckets.set(keyId, dailyBucket);
  }

  let minBucket = minuteBuckets.get(keyId);
  if (!minBucket || now > minBucket.resetAt) {
    minBucket = { count: 0, resetAt: now + WINDOW_MINUTE_MS };
    minuteBuckets.set(keyId, minBucket);
  }

  const isMaster = config.cotaDiaria === Infinity;
  const resetMinSeconds = Math.max(1, Math.ceil((minBucket.resetAt - now) / 1000));
  const resetDailySeconds = Math.max(1, Math.ceil((dailyBucket.resetAt - now) / 1000));

  if (!isMaster && dailyBucket.count >= config.cotaDiaria) {
    return {
      ok: false,
      error: 'DAILY_LIMIT_EXCEEDED',
      message: `Cota diária de requisições excedida para o plano ${config.nome}.`,
      resetEmSegundos: resetDailySeconds
    };
  }

  if (!isMaster && minBucket.count >= config.rpm) {
    return {
      ok: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: `Limite de taxa por minuto excedido (${config.rpm} RPM).`,
      resetEmSegundos: resetMinSeconds
    };
  }

  dailyBucket.count++;
  minBucket.count++;

  return {
    ok: true,
    rpmRestante: Math.max(0, config.rpm - minBucket.count),
    cotaRestante: isMaster ? 'Ilimitada' : Math.max(0, config.cotaDiaria - dailyBucket.count),
    resetMinEmSegundos: resetMinSeconds
  };
}

export default {
  async fetch(request) {
    const t0 = performance.now();
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const { plano, keyId, config, isAnonymous } = resolverPlanoEChave(request);
    const rateCheck = aplicarRateLimit(keyId, config);

    if (!rateCheck.ok) {
      return new Response(JSON.stringify(rateCheck, null, 2), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateCheck.resetEmSegundos || 60),
          ...CORS_HEADERS
        }
      });
    }

    const rateHeaders = {
      'x-fipe-plan': plano,
      'x-fipe-ratelimit-limit': String(config.rpm),
      'x-fipe-ratelimit-remaining': String(rateCheck.rpmRestante),
      'x-fipe-edge-latency': `${Math.max(1, Math.round(performance.now() - t0))}ms`
    };

    // 1. HEALTHCHECK
    if (path === '/' || path === '/health' || path === '/status' || path === '/api/fipe/health') {
      return new Response(JSON.stringify({
        ok: true,
        servico: 'Tabela FIPE & Precificação Veicular Anycast Pro',
        versao: '2.0.0',
        borda: 'Cloudflare Workers Anycast (<2ms)',
        uptimeSegundos: Math.floor((Date.now() - BOOT_TIME) / 1000),
        planoAtivo: config.nome,
        totalVeiculosCadastrados: Object.keys(VEICULOS_FIPE_CATALOGO).length,
        totalUfsIpva: Object.keys(ALIQUOTAS_IPVA_27_UFS).length,
        recursos: [
          'Consulta por Código FIPE Oficial (Carros, Motos e Caminhões)',
          'Cruzamento Direto por Placa Mercosul ou Antiga',
          'Decodificador e Validador de Chassi VIN (ISO 3779 / SAE J853)',
          'Calculadora Oficial de IPVA para as 27 UFs com Desconto de Cota Única',
          'Custo Total de Propriedade (TCO) & Depreciação Anual',
          'Renderizador Vetorial SVG de Cotação FIPE'
        ]
      }, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...rateHeaders }
      });
    }

    // 2. CATÁLOGO COMPLETO
    if (path === '/api/fipe/catalogo') {
      const tipo = url.searchParams.get('tipo')?.toLowerCase();
      let lista = Object.values(VEICULOS_FIPE_CATALOGO);
      if (tipo) lista = lista.filter(v => v.tipo === tipo);

      return new Response(JSON.stringify({
        ok: true,
        total: lista.length,
        veiculos: lista
      }, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...rateHeaders }
      });
    }

    // 3. CONSULTA POR PLACA
    const matchPlaca = path.match(/^\/api\/fipe\/placa\/([a-zA-Z0-9\-]+)$/i);
    if (matchPlaca || (path === '/api/fipe/placa' && url.searchParams.get('placa'))) {
      const placa = matchPlaca ? matchPlaca[1] : url.searchParams.get('placa');
      const uf = url.searchParams.get('uf') || 'SP';
      const res = consultarFipePorPlaca(placa, uf);
      return new Response(JSON.stringify(res, null, 2), {
        status: res.ok ? 200 : 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...rateHeaders }
      });
    }

    // 4. DECODIFICADOR DE CHASSI VIN (ISO 3779)
    const matchChassi = path.match(/^\/api\/fipe\/chassi\/([a-zA-Z0-9]+)$/i) || path.match(/^\/api\/fipe\/vin\/([a-zA-Z0-9]+)$/i);
    if (matchChassi || (path === '/api/fipe/chassi' && url.searchParams.get('vin'))) {
      const vin = matchChassi ? matchChassi[1] : url.searchParams.get('vin');
      const res = decodificarChassiVin(vin);
      return new Response(JSON.stringify(res, null, 2), {
        status: res.ok ? 200 : 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...rateHeaders }
      });
    }

    // 5. TABELA DE IPVA DAS 27 UFS
    if (path === '/api/fipe/ipva' || path.startsWith('/api/fipe/ipva/')) {
      const ufParam = path.split('/')[4]?.toUpperCase() || url.searchParams.get('uf')?.toUpperCase();
      if (ufParam && ALIQUOTAS_IPVA_27_UFS[ufParam]) {
        return new Response(JSON.stringify({
          ok: true,
          uf: ufParam,
          ...ALIQUOTAS_IPVA_27_UFS[ufParam]
        }, null, 2), {
          headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...rateHeaders }
        });
      }

      return new Response(JSON.stringify({
        ok: true,
        totalUfs: Object.keys(ALIQUOTAS_IPVA_27_UFS).length,
        aliquotasPorUf: ALIQUOTAS_IPVA_27_UFS
      }, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...rateHeaders }
      });
    }

    // 6. RENDERIZADOR SVG DO CARD DE COTAÇÃO FIPE
    const matchSvg = path.match(/^\/api\/fipe\/card\/([0-9\-]+)\.svg$/i) || path.match(/^\/api\/fipe\/([0-9\-]+)\.svg$/i);
    if (matchSvg || path === '/api/fipe/card.svg') {
      const cod = matchSvg ? matchSvg[1] : (url.searchParams.get('codigo') || '005340-6');
      const uf = url.searchParams.get('uf') || 'SP';
      const fipeData = consultarPorCodigoFipe(cod, 2025, uf);
      const svg = renderFipeCardSvg(fipeData);

      return new Response(svg, {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          ...CORS_HEADERS,
          ...rateHeaders
        }
      });
    }

    // 7. CONSULTA POR CÓDIGO FIPE
    const matchCod = path.match(/^\/api\/fipe\/codigo\/([0-9\-]+)$/i) || path.match(/^\/api\/fipe\/([0-9\-]+)$/i);
    if (matchCod || url.searchParams.get('codigo')) {
      const cod = matchCod ? matchCod[1] : url.searchParams.get('codigo');
      const uf = url.searchParams.get('uf') || 'SP';
      const ano = url.searchParams.get('ano') || 2025;
      const res = consultarPorCodigoFipe(cod, ano, uf);

      return new Response(JSON.stringify(res, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...rateHeaders }
      });
    }

    // Default: Nivus padrão
    return new Response(JSON.stringify(consultarPorCodigoFipe('005340-6', 2025, 'SP'), null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...rateHeaders }
    });
  }
};