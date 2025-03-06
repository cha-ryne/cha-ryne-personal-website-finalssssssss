<template>
  <section class="resources" id="resources">
    <h2><i class="fas fa-link"></i> Useful Links</h2>
    <div class="resources-grid">
      <a href="https://blog.pixelfreestudio.com/using-css-grid-and-flexbox-together-best-practices/" class="resource-link">
        <i class="fas fa-th"></i>
        <span>Flexbox and CSS grid</span>
      </a>
      <a href="https://www.w3schools.com/tags/tag_button.asp" class="resource-link">
        <i class="fas fa-square"></i>
        <span>Buttons</span>
      </a>
      <a href="https://vuejsexamples.com/responsive-gallery-component-for-vuejs/" class="resource-link">
        <i class="fab fa-vuejs"></i>
        <span>Vue Gallery</span>
      </a>
      <a href="https://surveyjs.io/form-library/examples/rating-scale/documentation" class="resource-link">
        <i class="fas fa-poll"></i>
        <span>Vue Rating</span>
      </a>
    </div>
  </section>
</template>

<script setup>
// No additional functionality needed
</script>

<style scoped>
.resources {
  background-color: #121212;
  padding: 4rem 2rem;
  text-align: center;
}

.resources h2 {
  color: white;
  margin-bottom: 3rem;
  font-size: 2rem;
}

.resources h2 i {
  color: #ff69b4;
  margin-right: 0.5rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.resource-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background-color: #1e1e1e;
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.resource-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  background-color: #ff69b4;
}

.resource-link i {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #ff69b4;
}

.resource-link:hover i {
  color: white;
}

.resource-link span {
  color: white;
  font-weight: 500;
}
</style>