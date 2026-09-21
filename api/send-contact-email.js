const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const attempts = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}
function rateAllowed(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) return false;
  recent.push(now);
  attempts.set(ip, recent);
  return true;
}
function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
function clean(value, max) { return String(value || '').trim().slice(0, max); }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: 'Serviço de e-mail indisponível.' });

  const ip = getClientIp(req);
  if (!rateAllowed(ip)) return res.status(429).json({ error: 'Muitas mensagens. Tente novamente em alguns minutos.' });

  try {
    const name = clean(req.body?.name, 150);
    const email = clean(req.body?.email, 320);
    const phone = clean(req.body?.phone, 60);
    const subject = clean(req.body?.subject, 220);
    const message = clean(req.body?.message, 5000);

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Dados de contato inválidos.' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Gift Excellence <onboarding@resend.dev>',
        to: [process.env.CONTACT_EMAIL || 'giftexcellence.03@gmail.com'],
        subject: subject ? `[Contato] ${subject}` : '[Contato] Nova mensagem do site',
        reply_to: email,
        html: `
          <h2>Nova mensagem do site</h2>
          <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
          <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
          <p><strong>Telefone:</strong> ${escapeHtml(phone || '-')}</p>
          <p><strong>Assunto:</strong> ${escapeHtml(subject || '-')}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(502).json({ error: 'Não foi possível enviar o e-mail agora.' });
    return res.status(200).json({ ok: true, id: data?.id || null });
  } catch {
    return res.status(500).json({ error: 'Erro interno ao enviar a mensagem.' });
  }
}
