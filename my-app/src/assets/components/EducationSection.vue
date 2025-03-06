<template>
  <section class="education" id="education">
    <h2><i class="fas fa-graduation-cap"></i> Education</h2>
    
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

.education h2 {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  font-size: 2rem;
}

.education h2 i {
  color: #ff69b4;
  margin-right: 0.5rem;
}

  .education-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .edu-card {
    background-color: var(--dark-gray);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--box-shadow);
    border-left: 3px solid var(--primary-pink);
    transition: var(--transition);
  }
  
  .edu-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
  }
  
  .school {
    font-weight: 600;
    color: var(--white);
  }
  
  .location {
    color: var(--white);
    font-size: 0.9rem;
    margin-bottom: 0.7rem;
  }
  
  .year {
    margin-bottom: 0.5rem;
    color: var(--white);
  }
  
  .achievement, .course {
    color: var(--primary-pink);
    font-weight: 500;
  }
  

/* Add the rest of your education section CSS */
</style>