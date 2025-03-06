<template>
  <footer>
    <div class="footer-content">
      <p>&copy; 2025 Charijoy Cempron</p>
      <div class="footer-links">
        <a href="#education" @click.prevent="scrollToSection('education')">Education</a>
        <a href="#projects" @click.prevent="scrollToSection('projects')">Projects</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 70, // Adjust for header height
      behavior: 'smooth'
    });
  }
}
</script>

<style scoped>
footer {
  background-color: #111111;
  padding: 2rem 0;
  border-top: 1px solid #333;
  width: 100%;
  display: flex;
  justify-content: center;
}

.footer-content {
  color: #ff69b4;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: #ff69b4;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #ff69b4;
  text-decoration: underline;
}

footer p {
  transition: all 0.3s ease;
}

footer:hover p {
  color: #ff69b4;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style>