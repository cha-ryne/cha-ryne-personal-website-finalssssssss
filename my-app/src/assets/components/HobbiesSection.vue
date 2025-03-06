<template>
  <section class="hobbies" id="hobbies">
    <h2><span class="icon">❤️</span> Hobbies & Interests</h2>
    <ul class="interest-list">
      <li>Blackpink (Jennie Kim)</li>
      <li>Mangas/Manhwas/Manhuas</li>
      <li>Animes (Zom 100, Chainsaw Man)</li>
      <li>Pirates of the Caribbean</li>
    </ul>
  </section>
</template>

<script setup>
// No additional functionality needed
</script>

<style scoped>
.hobbies {
  background-color: #191919;
  padding: 3rem 2rem;
  flex: 1;
  min-width: 300px;
}

.hobbies h2 {
  color: white;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  text-align: center;
}

.hobbies h2 .icon {
  color: #ff69b4;
  margin-right: 0.5rem;
}

.interest-list {
  list-style-type: none;
  padding-left: 1rem;
}

.interest-list li {
  color: #ddd;
  padding: 0.8rem 0;
  position: relative;
}

.interest-list li::before {
  content: '♥';
  color: #ff69b4;
  position: absolute;
  left: -1.5rem;
}
</style>