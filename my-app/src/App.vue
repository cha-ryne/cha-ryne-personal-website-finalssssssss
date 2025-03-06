<template>
  <div class="app">
    <header-component />
    
    <main class="content-container">
      <hero-section />
      <education-section />
      <skills-section />
      <gallery-section />
      <div class="two-column">
        <hobbies-section />
        <goals-section />
      </div>
      <projects-section />
      <resources-section />
    </main>
    
    <footer-component />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import HeaderComponent from './components/HeaderComponent.vue';
import HeroSection from './components/HeroSection.vue';
import EducationSection from './components/EducationSection.vue';
import SkillsSection from './components/SkillsSection.vue';
import GallerySection from './components/GallerySection.vue';
import HobbiesSection from './components/HobbiesSection.vue';
import GoalsSection from './components/GoalsSection.vue';
import ProjectsSection from './components/ProjectsSection.vue';
import ResourcesSection from './components/ResourcesSection.vue';
import FooterComponent from './components/FooterComponent.vue';

const store = useStore();

onMounted(() => {
  // Initialize user ID and fetch ratings
  store.dispatch('initUserId');
  store.dispatch('fetchRatings');
});
</script>

<style>
@import './assets/css/style.css';

/* Add these styles to fix layout issues */
body {
  margin: 0;
  padding: 0;
  background-color: #0a0a0a;
  color: #fff;
  font-family: 'Poppins', sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.two-column {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .two-column {
    flex-direction: column;
  }
}
</style>