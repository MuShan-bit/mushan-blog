# Deployment

## GitHub + Vercel

This project is intended to use:

- GitHub for source control
- Vercel for deployment

### 1. Push the repository to GitHub

If the repository has not been connected yet:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Import the repository into Vercel

In Vercel:

1. Open `Add New -> Project`
2. Choose the GitHub repository
3. Keep the detected Next.js settings

No custom build command is required for the default deployment.

### 3. Configure environment variables

Set these variables in Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain-or-project.vercel.app
SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_or_secret_key
```

If you later bind a custom domain, update `NEXT_PUBLIC_SITE_URL` to that final domain.

### 4. Deployment behavior

With Vercel's Git integration:

- pushes to the production branch create production deployments
- pull requests and branch pushes automatically get Preview Deployment URLs

That means you do not need GitHub Pages for preview access.
