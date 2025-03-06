<template>
  <div class="app">
    <header-component />
    
    <main>
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
import HeaderComponent from './assets/components/HeaderComponent.vue';
import HeroSection from './assets/components/HeroSection.vue';
import EducationSection from './assets/components/EducationSection.vue';
import SkillsSection from './assets/components/SkillsSection.vue';
import GallerySection from './assets/components/GallerySection.vue';
import HobbiesSection from './assets/components/HobbiesSection.vue';
import GoalsSection from './assets/components/GoalsSection.vue';
import ProjectsSection from './assets/components/ProjectsSection.vue';
import ResourcesSection from './assets/components/ResourcesSection.vue';
import FooterComponent from './assets/components/FooterComponent.vue';

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
.app {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0;
  overflow-x: hidden;
}

main {
  margin: 0;
  padding: 0;
  width: 100%;
}

.two-column {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
  background-color: #121212;
  font-family: 'Poppins', sans-serif;
}
</style>