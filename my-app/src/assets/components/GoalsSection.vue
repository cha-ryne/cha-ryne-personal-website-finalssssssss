<template>
  <section class="goals" id="goals">
    <h2><span class="icon">❤️</span> Life Goals</h2>
    <ul class="goals-list">
      <li>Have successful businesses</li>
      <li>Be a model at least once</li>
      <li>Master a musical instrument</li>
      <li>Retire early</li>
      <li>Find my purpose</li>
      <li>Master a sport</li>
      <li>Fitness and health journey</li>
    </ul>
  </section>
</template>

<script setup>
// No additional functionality needed
</script>

<style scoped>
.goals {
  background-color: #191919;
  padding: 3rem 2rem;
  flex: 1;
  min-width: 300px;
}

.goals h2 {
  color: white;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  text-align: center;
}

.goals h2 .icon {
  color: #ff69b4;
  margin-right: 0.5rem;
}

.goals-list {
  list-style-type: none;
  padding-left: 1rem;
}

.goals-list li {
  color: #ddd;
  padding: 0.8rem 0;
  position: relative;
}

.goals-list li::before {
  content: '♥';
  color: #ff69b4;
  position: absolute;
  left: -1.5rem;
}
</style>