# Aleph PR

Static landing page for Aleph PR (Tel Aviv), hosted on **Cloudflare Workers Static Assets**.

## Layout

- `public/` — the whole site (`index.html`, `app.js`, `styles.css`, `favicon.svg`), served as-is.
- `wrangler.jsonc` — Workers config. Assets only; there is no Worker script because the site has no server routes.

## Commands

```bash
npm install
npm run dev             # local preview with wrangler dev
npm run check           # wrangler deploy --dry-run
npm run deploy:preview  # upload a preview version (does not go live)
npm run deploy          # production deploy — ask before running
```

## Environment variables

None. The brief form builds its slip in the browser and sends nothing to a server, so the Worker needs no secrets and no backend.
