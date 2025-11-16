# 3D Print Gallery - Usage Guide

## Overview
This is a simple, beautiful image gallery website for displaying your 3D printing projects. Images are organized by project folders and can be hosted on GitHub or used as static assets. No login required!

## Features
- 📁 **Project-based organization** - Group images by 3D print project folders
- 🖼️ Responsive grid layout for projects
- 🔍 Full-screen image modal/lightbox
- ⌨️ Keyboard navigation (Arrow keys, Escape)
- 📱 Mobile-friendly design
- 🎨 Beautiful gradient background
- 🖱️ Click any image to view full-size
- 🔗 **GitHub integration** - Load images directly from your GitHub repository

## Setting Up GitHub Images

### 1. Configure GitHub Repository

Edit `app/composables/useImages.ts` and update the `githubConfig`:

```typescript
const githubConfig: GitHubConfig = {
  owner: 'your-username',      // Your GitHub username
  repo: 'your-repo',           // Repository name
  branch: 'main',              // Branch name (defaults to 'main')
  basePath: 'images'           // Optional: if images are in a subdirectory
}
```

### 2. Organize Your Images

Structure your GitHub repository like this:

```
your-repo/
  images/                    # Optional basePath
    benchy/                  # Project folder
      benchy-front.jpg
      benchy-side.jpg
      benchy-top.jpg
    vase/                    # Another project folder
      vase-1.jpg
      vase-2.jpg
    custom-model/
      model-1.jpg
      model-2.jpg
```

### 3. Add Projects to Gallery

Edit `app/composables/useImages.ts` and add your projects:

```typescript
const projects = ref<Project[]>([
  {
    folder: 'benchy',                    // Folder name in GitHub
    title: '3D Benchy',
    description: 'Classic calibration print in white PLA',
    images: [
      {
        filename: 'benchy-front.jpg',    // Just the filename
        title: 'Front View',
        description: 'Front view of the benchy'
      },
      {
        filename: 'benchy-side.jpg',
        title: 'Side View',
        description: 'Side view showing details'
      }
    ]
  },
  {
    folder: 'vase',
    title: 'Spiral Vase',
    description: 'Printed with transparent PETG',
    images: [
      {
        filename: 'vase-1.jpg',
        title: 'Vase Overview'
      }
    ]
  }
])
```

## Image URL Format

Images are automatically built as GitHub raw URLs:
```
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{basePath}/{folder}/{filename}
```

Example:
- Owner: `johndoe`
- Repo: `3d-prints`
- Branch: `main`
- BasePath: `images`
- Folder: `benchy`
- Filename: `benchy-front.jpg`

Result: `https://raw.githubusercontent.com/johndoe/3d-prints/main/images/benchy/benchy-front.jpg`

## Mixed Image Sources

You can mix GitHub images with external URLs or local assets:

```typescript
{
  folder: 'custom-model',
  title: 'Custom Model',
  images: [
    {
      filename: 'model-1.jpg',                    // GitHub image
      title: 'Model View 1'
    },
    {
      src: 'https://example.com/external.jpg',    // External URL
      title: 'External Reference'
    },
    {
      src: 'images/local-image.jpg',              // Local static asset
      title: 'Local Image'
    }
  ]
}
```

## Running the Project

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Change Gallery Title
Edit `app/pages/index.vue` and modify the header section.

### Change Colors
Edit the gradient in `app/pages/index.vue`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjust Project Card Layout
Modify the grid in `app/components/ProjectCard.vue`:
```css
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
```

## File Structure

```
app/
  ├── pages/
  │   └── index.vue          # Main gallery page
  ├── components/
  │   ├── ProjectCard.vue    # Project folder display
  │   ├── ImageCard.vue      # Individual image card (legacy)
  │   └── ImageModal.vue     # Full-screen image viewer
  └── composables/
      └── useImages.ts       # Image data & GitHub config

public/
  └── images/                # For local static assets (optional)
```

## Keyboard Shortcuts

- **Escape** - Close image modal
- **Arrow Left** - Previous image
- **Arrow Right** - Next image

## Tips

1. **Image Formats**: GitHub supports JPG, PNG, WebP, and other common formats
2. **File Naming**: Use descriptive filenames for easier management
3. **Image Sizes**: Optimize images for web (recommended: 1200-2000px width)
4. **Organization**: Keep related images in the same project folder
5. **Descriptions**: Add titles and descriptions to make your gallery more informative

Enjoy showcasing your 3D prints! 🎨