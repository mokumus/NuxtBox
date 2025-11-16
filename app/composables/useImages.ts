export interface Image {
  src?: string // Optional - can use filename + projectFolder for GitHub instead
  title?: string
  description?: string
  filename?: string // For GitHub images, just the filename
}

export interface Project {
  folder: string // Folder name in GitHub repo
  title: string
  description?: string
  images: Image[]
}

export interface GitHubConfig {
  owner: string
  repo: string
  branch?: string // Defaults to 'main'
  basePath?: string // Optional base path like 'images' or 'prints'
}

// GitHub configuration - update this with your repo details
const githubConfig: GitHubConfig = {
  owner: 'mokumus',
  repo: '3D-Projects',
  branch: 'main',
  basePath: '' // Leave empty if folders are in root, or set to 'images' if in subdirectory
}

/**
 * Builds a GitHub raw URL for an image
 * Format: https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}/{filename}
 */
export const buildGitHubUrl = (folder: string, filename: string): string => {
  const { owner, repo, branch = 'main', basePath = '' } = githubConfig
  const pathParts = [basePath, folder, filename].filter(Boolean)
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${pathParts.join('/')}`
  return url
}

/**
 * Builds image source URL - handles GitHub URLs, full URLs, and local paths
 */
export const buildImageSrc = (image: Image, projectFolder?: string): string => {
  // If src is provided and it's already a full URL, use it directly
  if (image.src) {
    if (image.src.startsWith('http://') || image.src.startsWith('https://')) {
      return image.src
    }
    // If src is a local path
    return image.src.startsWith('/') ? image.src : `/${image.src}`
  }
  
  // If filename is provided and we have a project folder (or empty string for root), build GitHub URL
  if (image.filename && projectFolder !== undefined) {
    return buildGitHubUrl(projectFolder, image.filename)
  }
  
  // If filename is provided without project folder, use it as-is (might be relative)
  if (image.filename) {
    return image.filename
  }
  
  // Fallback - return empty string or placeholder
  return ''
}

interface GitHubContentItem {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url?: string
  url: string
}

// Image file extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']

function isImageFile(filename: string): boolean {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return false
  const ext = filename.toLowerCase().substring(lastDot)
  return IMAGE_EXTENSIONS.includes(ext)
}

async function fetchGitHubContents(path: string = ''): Promise<GitHubContentItem[]> {
  const { owner, repo, branch = 'main' } = githubConfig
  
  const url = path
    ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    : `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching GitHub contents:', error)
    throw error
  }
}

async function discoverProjects(): Promise<Project[]> {
  const projects: Project[] = []
  
  try {
    // Fetch root contents
    const rootContents = await fetchGitHubContents('')
    console.log('Root contents:', rootContents)
    
    // Check for images directly in root
    const rootImages = rootContents
      .filter(item => item.type === 'file' && isImageFile(item.name))
    
    // If there are images in root, create a project for them
    if (rootImages.length > 0) {
      const images = rootImages.map(item => ({
        filename: item.name,
        title: item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        description: undefined
      }))
      
      projects.push({
        folder: '',
        title: 'Root Images',
        description: 'Images in repository root',
        images
      })
    }
    
    // Find all directories (potential project folders)
    const directories = rootContents.filter(item => item.type === 'dir')
    console.log('Found directories:', directories.map(d => d.name))
    
    // Process each directory
    for (const dir of directories) {
      try {
        const folderContents = await fetchGitHubContents(dir.path)
        console.log(`Contents of ${dir.name}:`, folderContents.map(f => f.name))
        
        // Filter for image files
        const images = folderContents
          .filter(item => {
            const isImg = item.type === 'file' && isImageFile(item.name)
            if (isImg) {
              console.log(`Found image: ${item.name} in ${dir.name}`)
            }
            return isImg
          })
          .map(item => ({
            filename: item.name,
            title: item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            description: undefined
          }))
        
        console.log(`Images in ${dir.name}:`, images.length)
        
        // Only add project if it has images
        if (images.length > 0) {
          projects.push({
            folder: dir.name,
            title: dir.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: undefined,
            images
          })
        }
      } catch (err) {
        console.warn(`Error fetching contents for folder ${dir.name}:`, err)
        // Continue with other folders
      }
    }
    
    console.log('Total projects discovered:', projects.length)
  } catch (error) {
    console.error('Error discovering projects:', error)
    throw error
  }
  
  return projects
}

export const useImages = () => {
  // Projects array - automatically loaded from GitHub repo
  const projects = ref<Project[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Fetch projects from GitHub repository (frontend-only)
  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    
    try {
      const discoveredProjects = await discoverProjects()
      projects.value = discoveredProjects
    } catch (err: any) {
      console.error('Error fetching projects:', err)
      error.value = err.message || 'Failed to fetch projects from GitHub'
      projects.value = []
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch on mount
  onMounted(() => {
    fetchProjects()
  })

  // Flatten all images for modal navigation
  const allImages = computed(() => {
    const flatImages: Array<Image & { projectFolder?: string; projectTitle?: string }> = []
    projects.value.forEach(project => {
      project.images.forEach(image => {
        flatImages.push({
          ...image,
          projectFolder: project.folder,
          projectTitle: project.title
        })
      })
    })
    return flatImages
  })

  return {
    projects,
    allImages,
    githubConfig,
    loading,
    error,
    fetchProjects
  }
}