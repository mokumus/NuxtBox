# GitHub Pages Deployment Guide

This guide will help you deploy your 3D Print Gallery to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Your code pushed to a GitHub repository

## Setup Steps

### 1. Repository Configuration

The repository is already configured for **NuxtBox**:
- Repository: [mokumus/NuxtBox](https://github.com/mokumus/NuxtBox)
- Base URL: `/NuxtBox/` (already set in `nuxt.config.ts`)

If you need to change the repository name, edit `nuxt.config.ts`:

```typescript
app: {
  baseURL: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
  // Replace 'YOUR-REPO-NAME' with your actual GitHub repository name
}
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 3. Push Your Code

Push your code to the `main` branch:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 4. Automatic Deployment

Once you push to the `main` branch, GitHub Actions will automatically:
- Build your Nuxt site
- Deploy it to GitHub Pages

You can monitor the deployment progress in the **Actions** tab of your repository.

### 5. Access Your Site

After deployment completes (usually 2-3 minutes), your site will be available at:
```
https://mokumus.github.io/NuxtBox/
```

You can also access it via the repository's Pages link shown on GitHub.

## Deployment Scripts

### Quick Deploy

```bash
# Build and prepare for deployment
npm run deploy
```

This will:
1. Generate the static site
2. Show instructions to push to GitHub

### Preview Before Deploying

```bash
# Build and preview locally (with production baseURL)
npm run deploy:preview
```

This builds the site with production settings and starts a local preview server so you can test before pushing.

### Manual Build

```bash
# Build the site
npm run generate

# The output will be in .output/public/
# You can manually upload this to GitHub Pages if needed
```

## Troubleshooting

### Site shows 404 or blank page

1. Check that `baseURL` in `nuxt.config.ts` matches your repository name exactly
2. Ensure GitHub Pages is set to use **GitHub Actions** as the source
3. Check the Actions tab for any build errors

### Images not loading

1. Verify your GitHub repository `mokumus/3D-Projects` is public
2. Check browser console for CORS or 404 errors
3. Ensure image file extensions are supported (.jpg, .jpeg, .png, etc.)

### Build fails

1. Check the Actions tab for error messages
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility (workflow uses Node 20)

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file in the `public/` directory with your domain
2. Update your DNS settings as per GitHub Pages documentation
3. Update `baseURL` in `nuxt.config.ts` to `/` for custom domains

## Notes

- The site is built as a static site (no server required)
- All images are loaded directly from your GitHub repository
- The site will automatically rebuild when you push changes to `main`
