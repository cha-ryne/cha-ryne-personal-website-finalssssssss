<template>
  <section class="skills" id="skills">
    <h2><i class="fas fa-laptop-code"></i> IT Experience</h2>
    <div class="skills-container">
      <div class="skill">
        <i class="fab fa-java"></i>
        <p>Basic Java</p>
      </div>
      <div class="skill">
        <i class="fab fa-python"></i>
        <p>Basic Python</p>
      </div>
      <div class="skill">
        <i class="fas fa-gamepad"></i>
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

.skills h2 i {
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

.skill i {
  font-size: 3rem;
  color: #ff69b4;
  margin-bottom: 1rem;
}

.skill p {
  color: white;
  font-weight: 500;
}
</style>