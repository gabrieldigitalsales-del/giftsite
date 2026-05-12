import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Gift Excellence <onboarding@resend.dev>',
      to: ['giftexcellence.03@gmail.com'],
      subject: subject ? `[Contato] ${subject}` : '[Contato] Nova mensagem do site',
      replyTo: email,
      html: `
        <h2>Nova mensagem do site</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || '-'}</p>
        <p><strong>Assunto:</strong> ${subject || '-'}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${String(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      return res.status(400).json({ error: error.message || 'Erro ao enviar e-mail.' });
    }

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno.' });
  }
}
