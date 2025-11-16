<template>
  <div class="project-card">
    <div class="project-header">
      <h2 class="project-title">{{ project.title }}</h2>
      <p v-if="project.description" class="project-description">{{ project.description }}</p>
      <div class="project-meta">
        <span class="image-count">{{ project.images.length }} {{ project.images.length === 1 ? 'image' : 'images' }}</span>
      </div>
    </div>
    
    <div class="project-images-grid">
      <div
        v-for="(image, index) in project.images"
        :key="index"
        class="project-image-thumb"
        @click="openProject(index)"
      >
        <img
          :src="buildImageSrc(image, project.folder)"
          :alt="image.title || project.title"
          class="thumb-image"
          loading="lazy"
          @error="handleImageError"
        />
        <div class="thumb-overlay">
          <span class="thumb-title">{{ image.title || `Image ${index + 1}` }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildImageSrc } from '~/composables/useImages'
import type { Project } from '~/composables/useImages'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  openProject: [projectIndex: number, imageIndex: number]
}>()

const openProject = (imageIndex: number) => {
  // Find the project index in the parent's projects array
  // For now, we'll emit the image index and let parent handle project context
  emit('openProject', imageIndex)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
.project-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1);
}

.project-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.project-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.project-description {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.image-count {
  font-size: 0.875rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.project-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.project-image-thumb {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: #f3f4f6;
  transition: transform 0.2s ease;
}

.project-image-thumb:hover {
  transform: scale(1.05);
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.project-image-thumb:hover .thumb-overlay {
  opacity: 1;
}

.thumb-title {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .project-card {
    padding: 1.5rem;
  }
  
  .project-title {
    font-size: 1.5rem;
  }
  
  .project-images-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
}
</style>
