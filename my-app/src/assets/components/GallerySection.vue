<template>
  <section class="gallery" id="gallery">
    <h2><span class="icon">🖼️</span> Gallery</h2>
    <div class="gallery-container">
      <div class="my-isolated-gallery-container">
        <!-- Image grid with unique class names -->
        <div class="my-gallery-grid">
          <div 
            v-for="(image, index) in images" 
            :key="index"
            class="my-gallery-item"
            @click="openGallery(index)"
          >
            <img :src="image" :alt="'Gallery image ' + (index + 1)" />
          </div>
        </div>
        
        <!-- Custom gallery overlay with unique class -->
        <div v-if="showGallery" class="my-gallery-overlay">
          <img :src="images[currentIndex]" class="my-gallery-large-img" />
          <div class="my-gallery-close" @click="closeGallery">×</div>
          <div class="my-gallery-prev" @click="prevImage">❮</div>
          <div class="my-gallery-next" @click="nextImage">❯</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Gallery image array - simplified paths to avoid URL constructor issues
const images = ref([
  '../images/gong.jpg',
  '../images/Sakamoto.jpg',
  '../images/bp.jpg',
  '../images/Manga.jpg',
  '../images/pirates.jpg',
  'https://preview.redd.it/new-wallpaper-for-my-pc-they-have-no-right-being-this-cool-v0-3l2k9lpytrcc1.jpeg?auto=webp&s=84fbc9925af40466495e023248afa37305b232fd',
  '../images/Chman.jpg',
  '../images/fish.jpg'
]);

// State variables
const currentIndex = ref(0);
const showGallery = ref(false);

// Open the gallery at a specific image index
function openGallery(index) {
  currentIndex.value = index;
  showGallery.value = true;
  document.body.style.overflow = 'hidden'; // Prevent scrolling when gallery is open
}

// Close the gallery
function closeGallery() {
  showGallery.value = false;
  document.body.style.overflow = ''; // Re-enable scrolling
}

// Navigate to previous image
function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
}

// Navigate to next image
function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}

// Handle keyboard navigation
function handleKeydown(event) {
  if (!showGallery.value) return;
  
  if (event.key === 'ArrowLeft') {
    prevImage();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'Escape') {
    closeGallery();
  }
}

// Add keyboard event listener when component mounts
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

// Remove keyboard event listener when component unmounts
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.gallery {
  padding: 4rem 2rem;
  background-color: #121212;
  text-align: center;
}

.gallery h2 {
  color: white;
  margin-bottom: 3rem;
  font-size: 2rem;
}

.gallery h2 .icon {
  color: #ff69b4;
  margin-right: 0.5rem;
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Use a unique namespace for all gallery elements */
.my-isolated-gallery-container {
  width: 100%;
}

.my-isolated-gallery-container * {
  box-sizing: border-box;
}

/* Grid layout - explicitly scoped */
.my-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
}

/* Thumbnails */
.my-gallery-item {
  overflow: hidden;
  cursor: pointer;
  border-radius: 10px;
  height: 200px; /* Fixed height */
}

.my-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 10px;
}

.my-gallery-item:hover img {
  transform: scale(1.05);
}

/* Fullscreen overlay */
.my-gallery-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Large image */
.my-gallery-large-img {
  max-height: 80vh;
  max-width: 90vw;
  object-fit: contain;
  border-radius: 10px;
}

/* Controls */
.my-gallery-close {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 30px;
  cursor: pointer;
}

.my-gallery-prev,
.my-gallery-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 20px;
}

.my-gallery-prev { left: 20px; }
.my-gallery-next { right: 20px; }

.my-gallery-close:hover,
.my-gallery-prev:hover,
.my-gallery-next:hover {
  color: #ff69b4;
}
</style>