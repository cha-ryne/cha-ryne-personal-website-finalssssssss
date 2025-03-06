<template>
  <section class="hero">
    <div class="hero-content">
      <img src="../images/sit.jpg" alt="Profile Photo" class="profile-image">
      <div class="hero-text">
        <h2>Charijoy Cempron</h2>
        <p class="subtitle">IT Student & Web Enthusiast</p>
        <p>Cha/ri, Kakay, Acerola</p>
        <p>Metro Manila, Philippines</p>
        <div class="social-links">
          <a href="https://www.linkedin.com/in/charijoy-cempron-0b6950281/" target="_blank">
            <span class="icon">📎</span> LinkedIn
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No additional functionality needed for this component
</script>

<style scoped>
.hero-text {
  color: white;
}

.hero-text h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #ff69b4, #8a2be2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero {
  background-color: var(--dark-gray);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
}

.hero-content {
  display: flex;
  align-items: center;
  padding: 3rem 2rem;
  gap: 2rem;
  flex-direction: column;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-pink);
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
  transition: var(--transition);
}

.profile-image:hover {
  transform: scale(1.05);
  border-color: var(--light-pink);
}

.hero-text {
  text-align: center;
}

.subtitle {
  color: var(--primary-pink);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.social-links {
  margin-top: 1rem;
}

.social-links a {
  display: inline-flex;
  align-items: center;
  background-color: var(--light-gray);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: var(--transition);
}

.social-links a .icon {
  margin-right: 0.5rem;
}

.social-links a:hover {
  background-color: var(--primary-pink);
  color: var(--black);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-image {
    margin-right: 0;
    margin-bottom: 2rem;
  }
}
</style>