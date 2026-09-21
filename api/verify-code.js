import crypto from 'node:crypto';

const DEFAULT_INDEX = 'OvKor22118uH4kN';
const DEFAULT_API_URL = 'https://m.asy315.vip/query/open';
const DEFAULT_MAX_QUERY_TIMES = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 20;
const attempts = new Map();

function randomString(length = 8) {
  return crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64url').slice(0, length);
}
function md5(value) { return crypto.createHash('md5').update(value).digest('hex'); }
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}
function allowedOrigin(origin) {
  if (!origin) return true;
  const allowed = new Set([
    'https://giftexcellence.com.br',
    'https://www.giftexcellence.com.br',
    'https://giftsite-six.vercel.app',
    process.env.SITE_URL,
  ].filter(Boolean));
  if (allowed.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && /^giftsite-[a-z0-9-]+\.vercel\.app$/i.test(url.hostname);
  } catch { return false; }
}
function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && allowedOrigin(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
function rateAllowed(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) return false;
  recent.push(now);
  attempts.set(ip, recent);
  return true;
}
async function callProvider({ apiUrl, code, index, noncestr, timestamp, sign, ip, longitude, latitude }) {
  const url = new URL(apiUrl);
  url.searchParams.set('data', code);
  url.searchParams.set('sign', sign);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
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
        latitude: String(latitude || '0'),
      },
    });
    const rawText = await apiResponse.text();
    let payload;
    try { payload = JSON.parse(rawText); }
    catch { return { ok: false, error: 'Resposta inválida da central de verificação.' }; }
    return { ok: apiResponse.ok, payload, error: apiResponse.ok ? null : 'A central de verificação retornou erro.' };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.headers.origin && !allowedOrigin(req.headers.origin)) {
    return res.status(403).json({ ok: false, error: 'Origem não autorizada.' });
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Método não permitido.' });

  const ip = getClientIp(req);
  if (!rateAllowed(ip)) return res.status(429).json({ ok: false, status: 'error', error: 'Muitas consultas. Tente novamente em alguns minutos.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const code = String(body.code || '').replace(/\D/g, '');
    const latitude = String(body.latitude || '0').slice(0, 32);
    const longitude = String(body.longitude || '0').slice(0, 32);
    if (!code || code.length < 10 || code.length > 40) {
      return res.status(400).json({ ok: false, status: 'invalid', error: 'Código inválido ou incompleto.' });
    }

    const index = process.env.ANTI_FAKE_INDEX || DEFAULT_INDEX;
    const apiUrl = process.env.ANTI_FAKE_API_URL || DEFAULT_API_URL;
    if (!String(apiUrl).startsWith('https://')) {
      return res.status(500).json({ ok: false, status: 'error', error: 'Central de verificação configurada de forma insegura.' });
    }
    const maxQueryTimes = Number(process.env.MAX_QUERY_TIMES || DEFAULT_MAX_QUERY_TIMES);
    const noncestr = randomString(8);
    const timestamp = Date.now();
    const sign = md5(`data${code}noncestr${noncestr}index${index}timestamp${timestamp}`);

    const providerResult = await callProvider({ apiUrl, code, index, noncestr, timestamp, sign, ip, longitude, latitude });
    if (!providerResult?.ok) {
      return res.status(502).json({ ok: false, status: 'error', error: 'Falha de conexão com a central de autenticação.' });
    }

    const data = providerResult.payload?.data || {};
    const queryTimes = Math.max(0, Number(data.queryTimes || 0));
    const remaining = Math.max(0, maxQueryTimes - queryTimes);
    const status = queryTimes > maxQueryTimes ? 'expired' : 'authentic';

    return res.status(200).json({
      ok: true,
      status,
      code,
      companyName: String(data.companyName || '').slice(0, 200),
      firstTime: data.firstTime || null,
      queryTimes,
      remaining,
      serial: status === 'expired' ? '' : String(data.serial || '').slice(0, 200),
      maxQueryTimes,
      checkedAt: new Date().toISOString(),
    });
  } catch {
    return res.status(500).json({ ok: false, status: 'error', error: 'Não foi possível concluir a consulta agora.' });
  }
}
