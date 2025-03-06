<template>
  <section class="gallery" id="gallery">
    <h2><i class="fas fa-images"></i> Gallery</h2>
    <div class="gallery-container">
      <!-- Image grid -->
      <div class="gallery-grid">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="gallery-item"
          @click="openGallery(index)"
        >
          <img :src="image" :alt="'Gallery image ' + (index + 1)" />
        </div>
      </div>
      
      <!-- Gallery lightbox overlay -->
      <div v-if="showGallery" class="gallery-overlay">
        <img :src="images[currentIndex]" class="gallery-large-img" />
        <div class="gallery-close" @click="closeGallery">×</div>
        <div class="gallery-prev" @click="prevImage">❮</div>
        <div class="gallery-next" @click="nextImage">❯</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GallerySection',
  data() {
    return {
      images: [
        "/images/gong.jpg",
        '/images/Sakamoto.jpg',
        '/images/bp.jpg',
        '/images/Manga.jpg',
        '/images/pirates.jpg',
        'https://preview.redd.it/new-wallpaper-for-my-pc-they-have-no-right-being-this-cool-v0-3l2k9lpytrcc1.jpeg?auto=webp&s=84fbc9925af40466495e023248afa37305b232fd',
        '/images/Chman.jpg',
        "/images/fish.jpg"
      ],
      currentIndex: 0,
      showGallery: false
    };
  },
  methods: {
    openGallery(index) {
      this.currentIndex = index;
      this.showGallery = true;
      document.body.style.overflow = 'hidden';
    },
    closeGallery() {
      this.showGallery = false;
      document.body.style.overflow = '';
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    handleKeydown(event) {
      if (!this.showGallery) return;
      
      if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'Escape') {
        this.closeGallery();
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped>
.gallery {
  background-color: #191919;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  margin: 2rem auto;
  width: 90%;
  max-width: 1200px;
  padding: 2rem;
  color: white;
}

.gallery h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(to right, #ff69b4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gallery-container {
  position: relative;
  width: 100%;
}

/* Grid layout - FIXED */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Explicit 4 columns */
  gap: 1rem;
  width: 100%;
}

/* Thumbnails */
.gallery-item {
  overflow: hidden;
  cursor: pointer;
  border-radius: 10px;
  height: 200px;
  width: 100%;
  aspect-ratio: 1 / 1; /* Force square aspect ratio */
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 10px;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

/* Fullscreen overlay */
.gallery-overlay {
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
.gallery-large-img {
  max-height: 80vh;
  max-width: 90vw;
  object-fit: contain;
  border-radius: 10px;
}

/* Controls */
.gallery-close {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 30px;
  cursor: pointer;
  z-index: 10000;
}

.gallery-prev,
.gallery-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 20px;
  z-index: 10000;
}

.gallery-prev { left: 20px; }
.gallery-next { right: 20px; }

/* Responsive layouts */
@media (max-width: 1200px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr); /* 3 columns on medium screens */
  }
}

@media (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr); /* 2 columns on smaller screens */
  }
}

@media (max-width: 600px) {
  .gallery {
    padding: 1.5rem;
    width: 95%;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr); /* 1 column on very small screens */
    gap: 0.75rem;
  }
  
  .gallery-item {
    height: 250px;
  }
  
  .gallery-close,
  .gallery-prev,
  .gallery-next {
    font-size: 24px;
  }
}
</style>