<template>
  <div class="image-card" @click="$emit('click')">
    <div class="image-wrapper">
      <img
        :src="imageSrc"
        :alt="image.title || '3D Print'"
        class="card-image"
        loading="lazy"
        @error="handleImageError"
      />
      <div class="image-overlay">
        <div class="overlay-content">
          <h3 class="image-title">{{ image.title || 'Untitled' }}</h3>
          <p v-if="image.description" class="image-description">{{ image.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Image {
  src: string
  title?: string
  description?: string
  category?: string
}

const props = defineProps<{
  image: Image
}>()

defineEmits<{
  click: []
}>()

const imageSrc = computed(() => {
  // If it's a URL, use it directly
  if (props.image.src.startsWith('http://') || props.image.src.startsWith('https://')) {
    return props.image.src
  }
  // Otherwise, treat it as a static asset
  return props.image.src.startsWith('/') ? props.image.src : `/${props.image.src}`
})

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
.image-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 4 / 3;
}

.image-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-card:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  color: white;
}

.image-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.image-description {
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.4;
}
</style>
