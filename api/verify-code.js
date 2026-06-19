import crypto from 'node:crypto';

const DEFAULT_INDEX = 'OvKor22118uH4kN';
const DEFAULT_API_URLS = ['https://m.asy315.vip/query/open', 'http://m.asy315.vip/query/open'];
const DEFAULT_MAX_QUERY_TIMES = 5;

function randomString(length = 8) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function md5(value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || '127.0.0.1';
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function callProvider({ apiUrl, code, index, noncestr, timestamp, sign, ip, longitude, latitude }) {
  const url = new URL(apiUrl);
  url.searchParams.set('data', code);
  url.searchParams.set('sign', sign);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const apiResponse = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        index,
        noncestr,
        timestamp: String(timestamp),
        ip: String(ip || ''),
        longitude: String(longitude || '0'),
        latitude: String(latitude || '0')
      }
    });

    const rawText = await apiResponse.text();
    let payload = null;
    try {
      payload = JSON.parse(rawText);
    } catch {
      return {
        ok: false,
        httpCode: apiResponse.status,
        error: 'Resposta inválida da central de verificação.',
        rawText: rawText?.slice?.(0, 300) || ''
      };
    }

    return {
      ok: apiResponse.ok,
      httpCode: apiResponse.status,
      payload,
      error: apiResponse.ok ? null : 'A central de verificação retornou erro.'
    };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método não permitido.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const code = String(body.code || '').replace(/\D/g, '');
    const latitude = String(body.latitude || '0');
    const longitude = String(body.longitude || '0');

    if (!code || code.length < 10) {
      return res.status(400).json({ ok: false, status: 'invalid', error: 'Código inválido ou incompleto.' });
    }

    const index = process.env.ANTI_FAKE_INDEX || DEFAULT_INDEX;
    const apiUrls = process.env.ANTI_FAKE_API_URL
      ? [process.env.ANTI_FAKE_API_URL]
      : DEFAULT_API_URLS;
    const maxQueryTimes = Number(process.env.MAX_QUERY_TIMES || DEFAULT_MAX_QUERY_TIMES);
    const noncestr = randomString(8);
    const timestamp = Date.now();
    const sign = md5(`data${code}noncestr${noncestr}index${index}timestamp${timestamp}`);
    const ip = getClientIp(req);

    let providerResult = null;
    let lastError = null;

    for (const apiUrl of apiUrls) {
      try {
        providerResult = await callProvider({
          apiUrl,
          code,
          index,
          noncestr,
          timestamp,
          sign,
          ip,
          longitude,
          latitude
        });
        if (providerResult?.ok) break;
        lastError = providerResult?.error || 'Erro na central.';
      } catch (error) {
        lastError = String(error?.message || error);
      }
    }

    if (!providerResult?.ok) {
      return res.status(502).json({
        ok: false,
        status: 'error',
        error: 'Falha de conexão com a central de autenticação.',
        details: process.env.NODE_ENV === 'development' ? lastError : undefined
      });
    }

    const payload = providerResult.payload;
    const data = payload?.data || {};
    const queryTimes = Number(data.queryTimes || 0);
    const remaining = Math.max(0, maxQueryTimes - queryTimes);
    const status = queryTimes > maxQueryTimes ? 'expired' : 'authentic';

    return res.status(200).json({
      ok: true,
      status,
      code,
      companyName: data.companyName || '',
      firstTime: data.firstTime || null,
      queryTimes,
      remaining,
      serial: status === 'expired' ? '' : (data.serial || ''),
      maxQueryTimes,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 'error',
      error: 'Não foi possível concluir a consulta agora.',
      details: process.env.NODE_ENV === 'development' ? String(error?.message || error) : undefined
    });
  }
}
