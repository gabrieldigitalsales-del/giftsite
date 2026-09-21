# GIFT EXCELLENCE SITE

Site institucional e catálogo da GIFT Excellence, publicado na Vercel e integrado ao Supabase existente.

## Stack
- React 18
- Vite
- Tailwind CSS
- Supabase (Auth, Postgres e Storage)
- Vercel Functions

## Supabase
Este projeto usa o Supabase já existente da operação. **Não crie outro projeto Supabase para o site.**

Tabelas do site:
- `gift_machines`
- `gift_hero_slides`
- `gift_gallery_images`
- `gift_services`
- `gift_site_settings`
- `gift_quote_requests`
- `gift_tech_support_requests`
- `gift_contact_messages`
- `gift_site_admins`

Bucket:
- `gift-excellence-media`

A migration `supabase/migrations/002_secure_giftsite.sql` endurece RLS, administração, Storage e proteção de envios públicos.

## Variáveis na Vercel
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_STORAGE_BUCKET=gift-excellence-media`
- `RESEND_API_KEY` se o endpoint de e-mail for utilizado
- `RESEND_FROM` opcional
- `CONTACT_EMAIL` opcional
- `ANTI_FAKE_INDEX` opcional
- `ANTI_FAKE_API_URL` opcional, sempre HTTPS
- `MAX_QUERY_TIMES` opcional
- `SITE_URL=https://giftexcellence.com.br` recomendado

## Admin
O login usa Supabase Auth, mas autenticação sozinha não concede administração. O usuário também precisa existir em `gift_site_admins`.

## Desenvolvimento
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Produção
Domínio principal: `https://giftexcellence.com.br/`.

Nunca commite chaves privadas, service role ou senhas no repositório.
