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
.hero {
  background-color: #191919;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  margin: 80px auto 2rem auto;
  width: 100%;
  max-width: 1000px;
}

.hero-content {
  display: flex;
  align-items: center;
  padding: 3rem 2rem;
  gap: 2rem;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ff69b4;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
  transition: transform 0.3s;
}

.profile-image:hover {
  transform: scale(1.05);
}

.hero-text {
  color: white;
  text-align: left;
}

.hero-text h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #ff69b4, #8a2be2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #ff69b4;
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
  background-color: #2a2a2a;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: background-color 0.3s, transform 0.3s;
  color: white;
  text-decoration: none;
}

.social-links a .icon {
  margin-right: 0.5rem;
}

.social-links a:hover {
  background-color: #ff69b4;
  color: white;
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-text {
    text-align: center;
  }
  
  .profile-image {
    margin-bottom: 1.5rem;
  }
  
  .hero {
    margin: 70px 20px 2rem 20px;
  }
}
</style>