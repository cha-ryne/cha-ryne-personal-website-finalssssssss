<template>
  <section class="skills" id="skills">
    <h2><span class="icon">💻</span> IT Experience</h2>
    <div class="skills-container">
      <div class="skill">
        <span class="icon">☕</span>
        <p>Basic Java</p>
      </div>
      <div class="skill">
        <span class="icon">🐍</span>
        <p>Basic Python</p>
      </div>
      <div class="skill">
        <span class="icon">🎮</span>
        <p>Codee Combat</p>
      </div>
    </div>
  </section>
</template>

<script setup>
// No additional functionality needed
</script>

<style scoped>
.skills {
  background-color: #0e0e0e;
  padding: 4rem 2rem;
  text-align: center;
}

.skills h2 {
  color: white;
  margin-bottom: 3rem;
  font-size: 2rem;
}

.skills h2 .icon {
  color: #ff69b4;
  margin-right: 0.5rem;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
}

.skill {
  text-align: center;
}

.skill .icon {
  font-size: 3rem;
  color: #ff69b4;
  margin-bottom: 1rem;
  display: block;
}

.skill p {
  color: white;
  font-weight: 500;
}
</style>