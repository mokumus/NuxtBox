<template>
  <div class="modal-overlay" @click.self="close">
    <button class="modal-close" @click="close" aria-label="Close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    
    <button class="modal-nav modal-nav-left" @click="previous" aria-label="Previous">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    
    <button class="modal-nav modal-nav-right" @click="next" aria-label="Next">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>

    <div class="modal-content">
      <div class="modal-image-wrapper">
        <img
          :src="currentImageSrc"
          :alt="currentImage.title || '3D Print'"
          class="modal-image"
          @error="handleImageError"
        />
      </div>
      
      <div class="modal-info">
        <h2 class="modal-title">{{ currentImage.title || 'Untitled' }}</h2>
        <p v-if="currentImage.projectTitle" class="modal-project">
          Project: {{ currentImage.projectTitle }}
        </p>
        <p v-if="currentImage.description" class="modal-description">
          {{ currentImage.description }}
        </p>
        <div class="modal-counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { buildImageSrc } from '~/composables/useImages'

interface Image {
  src?: string
  filename?: string
  title?: string
  description?: string
  category?: string
  projectFolder?: string
  projectTitle?: string
}

const props = defineProps<{
  images: Image[]
  initialIndex: number
}>()

const emit = defineEmits<{
  close: []
  next: []
  previous: []
}>()

const currentIndex = ref(props.initialIndex)

watch(() => props.initialIndex, (newIndex) => {
  currentIndex.value = newIndex
})

const currentImage = computed(() => props.images[currentIndex.value])

const currentImageSrc = computed(() => {
  if (!currentImage.value) return ''
  // If src is already set (from parent), use it
  if (currentImage.value.src) {
    if (currentImage.value.src.startsWith('http://') || currentImage.value.src.startsWith('https://')) {
      return currentImage.value.src
    }
    return currentImage.value.src.startsWith('/') ? currentImage.value.src : `/${currentImage.value.src}`
  }
  // Otherwise build it using GitHub URL builder
  if (currentImage.value.filename && currentImage.value.projectFolder) {
    return buildImageSrc(currentImage.value, currentImage.value.projectFolder)
  }
  // Fallback
  return ''
})

const close = () => {
  emit('close')
}

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
  emit('next')
}

const previous = () => {
  currentIndex.value = currentIndex.value === 0
    ? props.images.length - 1
    : currentIndex.value - 1
  emit('previous')
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image-wrapper {
  max-width: 100%;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-info {
  text-align: center;
  color: white;
  max-width: 800px;
}

.modal-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.modal-project {
  font-size: 1rem;
  opacity: 0.8;
  font-style: italic;
  margin-bottom: 0.5rem;
  color: #d1d5db;
}

.modal-description {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-counter {
  font-size: 0.9rem;
  opacity: 0.7;
}

.modal-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  backdrop-filter: blur(10px);
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  backdrop-filter: blur(10px);
}

.modal-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-nav-left {
  left: 2rem;
}

.modal-nav-right {
  right: 2rem;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-close {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
  }
  
  .modal-nav {
    width: 44px;
    height: 44px;
  }
  
  .modal-nav-left {
    left: 1rem;
  }
  
  .modal-nav-right {
    right: 1rem;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .modal-description {
    font-size: 1rem;
  }
}
</style>
