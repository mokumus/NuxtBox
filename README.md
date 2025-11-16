# 3D Print Gallery

A beautiful, frontend-only image gallery website for displaying 3D printing projects. Images are automatically loaded from a GitHub repository and organized by project folders.

## Features

- 🖼️ **Automatic Discovery** - Automatically finds all projects and images from your GitHub repository
- 📁 **Project-based Organization** - Groups images by folders in your GitHub repo
- 🔍 **Full-screen Lightbox** - Click any image to view in full-screen modal
- ⌨️ **Keyboard Navigation** - Arrow keys and Escape for easy browsing
- 📱 **Responsive Design** - Works beautifully on desktop and mobile
- 🎨 **Modern UI** - Beautiful gradient background and smooth animations
- 🚀 **Static Site** - Deploy anywhere, no backend required

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your gallery.

### Configuration

1. **Update GitHub Repository** in `app/composables/useImages.ts`:
   ```typescript
   const githubConfig: GitHubConfig = {
     owner: 'your-username',
     repo: 'your-repo',
     branch: 'main',
     basePath: '' // Optional: if images are in a subdirectory
   }
   ```

2. **Organize Your Repository**:
   ```
   your-repo/
     ├── Project1/
     │   ├── image1.jpg
     │   ├── image2.jpg
     │   └── ...
     ├── Project2/
     │   ├── pic1.jpg
     │   └── ...
   ```

## Deployment to GitHub Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick steps:**
1. Update `baseURL` in `nuxt.config.ts` to match your repository name
2. Push code to GitHub
3. Enable GitHub Pages in repository settings (use GitHub Actions)
4. Your site will be automatically deployed!

## Project Structure

```
app/
  ├── pages/
  │   └── index.vue          # Main gallery page
  ├── components/
  │   ├── ProjectCard.vue    # Project folder display
  │   └── ImageModal.vue     # Full-screen image viewer
  └── composables/
      └── useImages.ts       # Image data & GitHub API integration

public/
  └── .nojekyll              # GitHub Pages configuration
```

## How It Works

1. On page load, the app fetches your GitHub repository structure via GitHub API
2. Discovers all folders (projects) and image files
3. Automatically creates project cards with image thumbnails
4. Images are loaded directly from GitHub's raw content URLs

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.bmp`
- `.svg`

## Requirements

- Node.js 18+ 
- Public GitHub repository (for images)
- Modern web browser

## License

MIT

## Credits

Built with [Nuxt 4](https://nuxt.com/) and [Vue 3](https://vuejs.org/)