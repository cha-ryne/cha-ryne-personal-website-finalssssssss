<template>
  <section class="education" id="education">
    <h2><span class="icon">🎓</span> Education</h2>
    
    <div class="education-cards">
      <div class="edu-card">
        <h3>Secondary</h3>
        <p class="school">St. Ives School</p>
        <p class="location">Severina Subd. Bagumbayan, Taguig City</p>
        <p class="year">SY 2017-2023</p>
        <p class="achievement">With Honors</p>
      </div>
      
      <div class="edu-card">
        <h3>Tertiary</h3>
        <p class="school">Asia Pacific College</p>
        <p class="location">Humabon St. Magallanes, Makati City</p>
        <p class="year">SY 2023-Present</p>
        <p class="course">Bachelor of Science in Information Technology with Specialization in Mobile Internet</p>
      </div>
    </div>
  </section>
</template>

<script setup>
// No additional functionality needed
</script>

<style scoped>
.education {
  background-color: #0e0e0e;
  padding: 4rem 2rem;
}

.education h2 {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  font-size: 2rem;
}

.education h2 .icon {
  color: #ff69b4;
  margin-right: 0.5rem;
}

.education-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.edu-card {
  background-color: #1a1a1a;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border-left: 3px solid #ff69b4;
  transition: transform 0.3s, box-shadow 0.3s;
}

.edu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
}

.edu-card h3 {
  color: white;
  margin-bottom: 0.5rem;
}

.school {
  font-weight: 600;
  color: white;
}

.location {
  color: white;
  font-size: 0.9rem;
  margin-bottom: 0.7rem;
}

.year {
  margin-bottom: 0.5rem;
  color: white;
}

.achievement, .course {
  color: #ff69b4;
  font-weight: 500;
}
</style>