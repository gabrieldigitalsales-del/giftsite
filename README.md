# GIFT EXCELLENCE SITE

Projeto desacoplado do Base44 e preparado para deploy na Vercel com Supabase.

## Stack
- React 18
- Vite
- Tailwind CSS
- Supabase (Auth, Postgres e Storage)

## Variáveis de ambiente
Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

## Instalação
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Supabase
1. Crie um projeto novo no Supabase.
2. Rode o SQL em `supabase/schema.sql`.
3. Crie um usuário admin em Authentication > Users.
4. Use esse e-mail e senha para acessar `/admin/login`.
5. Crie o bucket público `gift-excellence-media` se ele ainda não existir.

## Deploy na Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Configure as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_SUPABASE_STORAGE_BUCKET`.
