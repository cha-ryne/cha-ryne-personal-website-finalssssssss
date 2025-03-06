<template>
  <header :class="{ scrolled: isScrolled }">
    <div class="logo">
      <h1></h1>
    </div>
    <nav>
      <ul>
        <li><a href="#" @click.prevent="scrollToTop()">Home</a></li>
        <li><a href="#skills" @click.prevent="scrollToSection('skills')">Skills</a></li>
        <li><a href="#hobbies" @click.prevent="scrollToSection('hobbies')">Interests</a></li>
        <li><a href="#resources" @click.prevent="scrollToSection('resources')">Resources</a></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isScrolled = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 70, // Adjust for header height
      behavior: 'smooth'
    });
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(17, 17, 17, 0.9);
  z-index: 100;
  transition: all 0.3s ease;
}

header.scrolled {
  background-color: rgba(0, 0, 0, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-left: 1.5rem;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

nav ul li a:hover,
nav ul li a.active {
  color: #ff69b4;
}

@media (max-width: 768px) {
  header {
    padding: 1rem;
  }
  
  nav ul li {
    margin-left: 1rem;
  }
}
</style>