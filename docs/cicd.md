# Oche Operations CI/CD

GitHub is the source of truth for the application. Pull requests run the validation workflow. Merging to `main` validates the code, Cloudflare Pages deploys the frontend through its Git integration, and the Worker workflow deploys `api/`.

The Worker workflow requires these GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Production Worker secrets are configured separately with Wrangler:

```bash
npx wrangler secret put ATTENDANCE_ROOT_PASSWORD
npx wrangler secret put RESEND_API_KEY
```

Local `.dev.vars` files and Wrangler state are intentionally excluded from Git.
