<template>
  <div class="gallery-container">
    <header class="gallery-header">
      <h1 class="gallery-title">My 3D Print Gallery</h1>
      <p class="gallery-subtitle">A collection of my 3D printing projects</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading projects from GitHub...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <p class="error-hint">Check the browser console (F12) for more details.</p>
      <button @click="fetchProjects" class="retry-button">Retry</button>
    </div>

    <div v-else-if="projects.length === 0" class="empty-state">
      <p>No projects found in the repository.</p>
      <p class="empty-hint">Make sure your GitHub repo has folders with image files.</p>
      <p class="empty-hint">Check the browser console (F12) to see what was discovered.</p>
    </div>

    <div v-else class="projects-container">
      <ProjectCard
        v-for="(project, projectIndex) in projects"
        :key="projectIndex"
        :project="project"
        @open-project="(imageIndex) => openModal(projectIndex, imageIndex)"
      />
    </div>

    <ImageModal
      v-if="selectedImageIndex !== null"
      :images="flatImagesWithContext"
      :initial-index="selectedImageIndex"
      @close="closeModal"
      @next="nextImage"
      @previous="previousImage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useImages, buildImageSrc } from '~/composables/useImages'

const { projects, allImages, loading, error, fetchProjects } = useImages()
const selectedImageIndex = ref<number | null>(null)

// Convert projects to flat array with project context for modal
const flatImagesWithContext = computed(() => {
  return allImages.value.map((img, idx) => {
    const imageSrc = buildImageSrc(img, img.projectFolder)
    return {
      ...img,
      src: imageSrc
    }
  })
})

const openModal = (projectIndex: number, imageIndex: number) => {
  // Find the global index of this image
  let globalIndex = 0
  for (let i = 0; i < projectIndex; i++) {
    if (projects.value[i]) {
      globalIndex += projects.value[i].images.length
    }
  }
  globalIndex += imageIndex
  
  selectedImageIndex.value = globalIndex
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedImageIndex.value = null
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (selectedImageIndex.value !== null) {
    selectedImageIndex.value = (selectedImageIndex.value + 1) % flatImagesWithContext.value.length
  }
}

const previousImage = () => {
  if (selectedImageIndex.value !== null) {
    selectedImageIndex.value = selectedImageIndex.value === 0
      ? flatImagesWithContext.value.length - 1
      : selectedImageIndex.value - 1
  }
}

// Keyboard navigation
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (selectedImageIndex.value === null) return
    
    if (e.key === 'Escape') {
      closeModal()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    } else if (e.key === 'ArrowLeft') {
      previousImage()
    }
  }
  
  window.addEventListener('keydown', handleKeyPress)
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })
})
</script>

<style scoped>
.gallery-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.gallery-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.gallery-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
}

.projects-container {
  max-width: 1400px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1.25rem;
  opacity: 0.9;
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.error-message {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #fca5a5;
}

.error-hint {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.retry-button {
  background: white;
  color: #667eea;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
  font-size: 1.25rem;
}

.empty-hint {
  font-size: 1rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .gallery-container {
    padding: 1rem;
  }
  
  .gallery-title {
    font-size: 2rem;
  }
  
}
</style>
