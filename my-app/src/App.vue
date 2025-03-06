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
import HeaderComponent from '@/components/HeaderComponent.vue';
import HeroSection from '@/components/HeroSection.vue';
import EducationSection from '@/components/EducationSection.vue';
import SkillsSection from '@/components/SkillsSection.vue';
import GallerySection from '@/components/GallerySection.vue';
import HobbiesSection from '@/components/HobbiesSection.vue';
import GoalsSection from '@/components/GoalsSection.vue';
import ProjectsSection from '@/components/ProjectsSection.vue';
import ResourcesSection from '@/components/ResourcesSection.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const store = useStore();

onMounted(() => {
  // Initialize user ID and fetch ratings
  store.dispatch('initUserId');
  store.dispatch('fetchRatings');
});
</script>

<style>
@import '../assets/css/style.css';
</style>