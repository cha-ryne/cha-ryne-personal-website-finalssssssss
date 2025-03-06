<template>
  <div class="container">
    <!-- Header -->
    <header :class="{ scrolled: isScrolled }">
      <div class="logo">
        <h1></h1>
      </div>
      <nav>
        <ul>
          <li><a href="#" @click.prevent="scrollToTop">Home</a></li>
          <li><a href="#skills" @click.prevent="scrollToSection('skills')">Skills</a></li>
          <li><a href="#hobbies" @click.prevent="scrollToSection('hobbies')">Interests</a></li>
          <li><a href="#resources" @click.prevent="scrollToSection('resources')">Resources</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <img :src="profileImage" alt="Profile Photo" class="profile-image">
          <div class="hero-text">
            <h2>Charijoy Cempron</h2>
            <p class="subtitle">IT Student & Web Enthusiast</p>
            <p>Cha/ri, Kakay, Acerola</p>
            <p>Metro Manila, Philippines</p>
            <div class="social-links">
              <a href="https://www.linkedin.com/in/charijoy-cempron-0b6950281/" target="_blank">
                <i class="fab fa-linkedin"></i> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Education Section -->
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
      
      <!-- Skills Section -->
      <section class="skills" id="skills">
        <h2><i class="fas fa-laptop-code"></i> IT Experience</h2>
        <div class="skills-container">
          <div class="skill" v-for="skill in skills" :key="skill.name">
            <i :class="skill.icon"></i>
            <p>{{ skill.name }}</p>
          </div>
        </div>
      </section>
      
      <!-- Gallery Section -->
      <section class="gallery" id="gallery">
        <h2><i class="fas fa-images"></i> Gallery</h2>
        <div class="gallery-container">
          <div class="my-isolated-gallery-container">
            <!-- Image grid with unique class names -->
            <div class="my-gallery-grid">
              <div 
                v-for="(image, index) in galleryImages" 
                :key="index"
                class="my-gallery-item"
                @click="openGallery(index)"
              >
                <img :src="image" :alt="'Gallery image ' + (index + 1)" />
              </div>
            </div>
            
            <!-- Custom gallery overlay with unique class -->
            <div v-if="showGallery" class="my-gallery-overlay">
              <img :src="galleryImages[currentIndex]" class="my-gallery-large-img" />
              <div class="my-gallery-close" @click="closeGallery">×</div>
              <div class="my-gallery-prev" @click="prevImage">❮</div>
              <div class="my-gallery-next" @click="nextImage">❯</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Interests and Goals -->
      <div class="two-column">
        <!-- Hobbies Section -->
        <section class="hobbies" id="hobbies">
          <h2><i class="fas fa-heart"></i> Hobbies & Interests</h2>
          <ul class="interest-list">
            <li v-for="(hobby, index) in hobbies" :key="index">{{ hobby }}</li>
          </ul>
        </section>
        
        <!-- Goals Section -->
        <section class="goals" id="goals">
          <h2><i class="fas fa-heart"></i> Life Goals</h2>
          <ul class="goals-list">
            <li v-for="(goal, index) in goals" :key="index">{{ goal }}</li>
          </ul>
        </section>
      </div>
      
      <!-- Projects Section -->
      <section class="projects" id="projects">
        <h2><i class="fas fa-star"></i> My Projects</h2>
        <p>Check out my latest work and share your feedback!</p>
        
        <div class="projects-grid">
          <div class="project-card" v-for="project in projects" :key="project.id">
            <div class="project-image" :style="{ backgroundImage: `url('${project.image}')` }">
              <div class="project-overlay">
                <a :href="project.link" target="_blank" class="project-link">
                  <i class="fas fa-external-link-alt"></i> View Project
                </a>
              </div>
            </div>
            <div class="project-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-rating" :data-project="project.id">
                <div class="stars">
                  <i v-for="n in 5" :key="`project${project.id}-star-${n}`" 
                     :class="[n <= getAverageRating(project.id) ? 'fas' : 'far', 'fa-star']"
                     @click="openRatingModal(project.id, n)"></i>
                </div>
                <span class="rating-count">
                  ({{ projectRatings[project.id] ? projectRatings[project.id].length : 0 }} ratings)
                </span>
                <div class="project-comments-container">
                  <h4 class="comments-heading">Feedback</h4>
                  <div class="project-comments">
                    <div v-if="!projectRatings[project.id] || !getTopComments(project.id).length" class="no-comments">
                      No feedback yet. Be the first to comment!
                    </div>
                    <div v-else>
                      <div v-for="rating in getTopComments(project.id)" :key="rating.id" class="comment">
                        <div class="comment-stars">
                          <i v-for="n in 5" :key="`rating-${rating.id}-star-${n}`"
                             :class="[n <= rating.stars ? 'fas' : 'far', 'fa-star']"></i>
                        </div>
                        <p class="comment-text">{{ rating.comment }}</p>
                        <p class="comment-date">{{ formatDate(rating.created_at) }}</p>
                      </div>
                      <button v-if="projectRatings[project.id] && commentsWithText(project.id).length > 3"
                              class="view-more-comments" @click="showAllComments(project.id)">
                        View {{ commentsWithText(project.id).length - 3 }} more comments
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- Rating Modal -->
        <div v-if="showRatingModal" class="modal" :style="{display: showRatingModal ? 'flex' : 'none'}">
          <div class="modal-content">
            <span class="close-modal" @click="closeRatingModal">&times;</span>
            <h3>Rate This Project</h3>
            <div class="stars large">
              <i v-for="n in 5" :key="`modal-star-${n}`"
                :class="[n <= selectedRating ? 'fas' : 'far', 'fa-star']"
                @click="selectedRating = n"></i>
            </div>
            <textarea v-model="ratingComment" placeholder="Share your thoughts about this project (optional)"></textarea>
            <button class="rating-btn" @click="submitRating">Submit Rating</button>
          </div>
        </div>
            
        <!-- All Comments Modal -->
        <div v-if="showCommentsModal" class="modal" :style="{display: showCommentsModal ? 'flex' : 'none'}">
          <div class="modal-content comments-modal">
            <span class="close-modal" @click="closeCommentsModal">&times;</span>
            <h3>All Feedback for Project</h3>
            <div class="all-comments">
              <div v-for="rating in getAllComments()" :key="rating.id" class="comment">
                <div class="comment-stars">
                  <i v-for="n in 5" :key="`all-comment-${rating.id}-star-${n}`"
                     :class="[n <= rating.stars ? 'fas' : 'far', 'fa-star']"></i>
                </div>
                <p class="comment-text">{{ rating.comment }}</p>
                <p class="comment-date">{{ formatDate(rating.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
   
      <!-- Resources Section -->
      <section class="resources" id="resources">
        <h2><i class="fas fa-link"></i> Useful Links</h2>
        <div class="resources-grid">
          <a v-for="resource in resources" :key="resource.name"
             :href="resource.link" class="resource-link" target="_blank">
            <i :class="resource.icon"></i>
            <span>{{ resource.name }}</span>
          </a>
        </div>
      </section>
    </main>
    
    <footer>
      <div class="footer-content">
        <p>&copy; 2025 Charijoy Cempron</p>
        <div class="footer-links">
          <a href="#education" @click.prevent="scrollToSection('education')">Education</a>
          <a href="#projects" @click.prevent="scrollToSection('projects')">Projects</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

// ------ HEADER SCROLL LOGIC ------
const isScrolled = ref(false);
function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 70,
      behavior: 'smooth'
    });
  }
}

// ------ PROFILE DATA ------
const profileImage = ref(new URL('@/assets/images/sit.jpg', import.meta.url).href);

// ------ SKILLS SECTION DATA ------
const skills = ref([
  { icon: 'fab fa-java', name: 'Basic Java' },
  { icon: 'fab fa-python', name: 'Basic Python' },
  { icon: 'fas fa-gamepad', name: 'Codee Combat' }
]);

// ------ GALLERY SECTION ------
const galleryImages = ref([
  new URL('@/assets/images/gong.jpg', import.meta.url).href,
  new URL('@/assets/images/Sakamoto.jpg', import.meta.url).href,
  new URL('@/assets/images/bp.jpg', import.meta.url).href,
  new URL('@/assets/images/Manga.jpg', import.meta.url).href,
  new URL('@/assets/images/pirates.jpg', import.meta.url).href,
  'https://preview.redd.it/new-wallpaper-for-my-pc-they-have-no-right-being-this-cool-v0-3l2k9lpytrcc1.jpeg?auto=webp&s=84fbc9925af40466495e023248afa37305b232fd',
  new URL('@/assets/images/Chman.jpg', import.meta.url).href,
  new URL('@/assets/images/fish.jpg', import.meta.url).href
]);

const currentIndex = ref(0);
const showGallery = ref(false);

function openGallery(index) {
  currentIndex.value = index;
  showGallery.value = true;
  document.body.style.overflow = 'hidden'; // Prevent scrolling when gallery is open
}

function closeGallery() {
  showGallery.value = false;
  document.body.style.overflow = ''; // Re-enable scrolling
}

function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % galleryImages.value.length;
}

function handleKeydown(event) {
  if (!showGallery.value) return;
  
  if (event.key === 'ArrowLeft') {
    prevImage();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'Escape') {
    closeGallery();
  }
}

// ------ HOBBIES & GOALS ------
const hobbies = ref([
  'Blackpink (Jennie Kim)',
  'Mangas/Manhwas/Manhuas',
  'Animes (Zom 100, Chainsaw Man)',
  'Pirates of the Caribbean'
]);

const goals = ref([
  'Have successful businesses',
  'Be a model at least once',
  'Master a musical instrument',
  'Retire early',
  'Find my purpose',
  'Master a sport',
  'Fitness and health journey'
]);

// ------ PROJECTS & RATINGS SYSTEM ------
// API endpoint
const API_BASE_URL = 'https://charyn.pythonanywhere.com/api';
  
// Helper function for iPad Safari
const isIPadSafari = /iPad/.test(navigator.userAgent) || 
  (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);

// State variables
const projectRatings = ref({});
const userId = ref(localStorage.getItem('ratingUserId') || 
  ('user_' + Math.random().toString(36).substring(2, 9)));
const selectedProject = ref(null);
const selectedRating = ref(0);
const ratingComment = ref('');
const showRatingModal = ref(false);
const showCommentsModal = ref(false);
const isLoading = ref(true);
const errorMessage = ref('');

// Projects data
const projects = ref([
  {
    id: 1,
    title: "Personal Website",
    description: "A responsive personal website.",
    image: new URL('@/assets/images/proj1.png', import.meta.url).href,
    link: "/"
  },
  {
    id: 2,
    title: "Ramquest",
    description: "A mobile wireframe of Ramquest app.",
    image: new URL('@/assets/images/proj2.png', import.meta.url).href,
    link: "https://www.figma.com/proto/tQESkzv4TdzWyUJZHTJjIK/RAMQUEST-MOBILE-VERSION"
  },
  {
    id: 3,
    title: "Meneshu",
    description: "A responsive restaurant website.",
    image: new URL('@/assets/images/proj3.png', import.meta.url).href,
    link: "https://rheaanne.github.io/Meneshu/home/"
  }
]);

// Fetch ratings from API
async function fetchRatings() {
  console.log('Fetching ratings from API');
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    let data;
    
    if (isIPadSafari) {
      // Use XMLHttpRequest with CORS proxy for iPad Safari
      console.log('Using XMLHttpRequest with CORS proxy for fetching ratings (iPad compatibility)');
      
      data = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const timeout = setTimeout(() => {
          xhr.abort();
          reject(new Error('Request timed out'));
        }, 10000);
        
        xhr.open('GET', `https://corsproxy.io/?${encodeURIComponent(API_BASE_URL + '/ratings')}`, true);
        xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.onload = () => {
          clearTimeout(timeout);
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const responseData = JSON.parse(xhr.responseText);
              resolve(responseData);
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`Server returned ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Network request failed'));
        };
        
        xhr.send();
      });
    } else {
      // Use modern fetch API with timeout for other browsers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      data = await response.json();
    }
    
    // Group ratings by project ID
    const ratings = {};
    data.forEach(rating => {
      const projectId = parseInt(rating.project_id);
      if (!ratings[projectId]) {
        ratings[projectId] = [];
      }
      ratings[projectId].push(rating);
    });
    
    projectRatings.value = ratings;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    errorMessage.value = `Unable to load ratings: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Date error';
  }
}

// Get average rating for a project
function getAverageRating(projectId) {
  projectId = parseInt(projectId);
  if (!projectRatings.value[projectId] || projectRatings.value[projectId].length === 0) {
    return 0;
  }
  
  const totalStars = projectRatings.value[projectId].reduce((sum, rating) => sum + rating.stars, 0);
  return Math.round(totalStars / projectRatings.value[projectId].length);
}

// Get comments with text for a project
function commentsWithText(projectId) {
  projectId = parseInt(projectId);
  if (!projectRatings.value[projectId]) return [];
  
  return projectRatings.value[projectId].filter(
    rating => rating.comment && rating.comment.trim() !== ''
  );
}

// Get top 3 comments for a project
function getTopComments(projectId) {
  const comments = commentsWithText(projectId);
  return comments.slice(0, 3);
}

// Get all comments for the selected project
function getAllComments() {
  if (!selectedProject.value || !projectRatings.value[selectedProject.value]) {
    return [];
  }
  return commentsWithText(selectedProject.value);
}

// Open rating modal
function openRatingModal(projectId, stars = 0) {
  selectedProject.value = parseInt(projectId);
  selectedRating.value = parseInt(stars);
  showRatingModal.value = true;
}

// Close rating modal
function closeRatingModal() {
  showRatingModal.value = false;
  selectedProject.value = null;
  selectedRating.value = 0;
  ratingComment.value = '';
}

// Show all comments for a project
function showAllComments(projectId) {
  selectedProject.value = parseInt(projectId);
  showCommentsModal.value = true;
}

// Close comments modal
function closeCommentsModal() {
  showCommentsModal.value = false;
  selectedProject.value = null;
}

// Submit a rating
async function submitRating() {
  if (!selectedRating.value) {
    alert('Please select a rating by clicking on the stars');
    return;
  }
  
  isLoading.value = true;
  
  try {
    const ratingData = {
      project_id: selectedProject.value,
      user_id: userId.value,
      stars: selectedRating.value,
      comment: ratingComment.value
    };
    
    if (isIPadSafari) {
      // Use XMLHttpRequest for iPad Safari
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const timeout = setTimeout(() => {
          xhr.abort();
          reject(new Error('Request timed out'));
        }, 10000);
        
        xhr.open('POST', `https://corsproxy.io/?${encodeURIComponent(API_BASE_URL + '/ratings')}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.onload = () => {
          clearTimeout(timeout);
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } else {
            reject(new Error(`Server error: ${xhr.status} ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Network request failed'));
        };
        
        xhr.send(JSON.stringify(ratingData));
      });
    } else {
      // Use modern fetch API for other browsers
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(ratingData)
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
    }
    
    // Refresh ratings
    await fetchRatings();
    
    // Reset and close modal
    closeRatingModal();
    
    // Show success message
    alert('Thank you for your feedback!');
    
  } catch (error) {
    console.error('Error submitting rating:', error);
    alert(`Failed to submit rating: ${error.message}. Please try again later.`);
  } finally {
    isLoading.value = false;
  }
}

// ------ RESOURCES SECTION ------
const resources = ref([
  { 
    icon: 'fas fa-th', 
    name: 'Flexbox and CSS grid', 
    link: 'https://blog.pixelfreestudio.com/using-css-grid-and-flexbox-together-best-practices/' 
  },
  { 
    icon: 'fas fa-square', 
    name: 'Buttons', 
    link: 'https://www.w3schools.com/tags/tag_button.asp' 
  },
  { 
    icon: 'fab fa-vuejs', 
    name: 'Vue Gallery', 
    link: 'https://vuejsexamples.com/responsive-gallery-component-for-vuejs/' 
  },
  { 
    icon: 'fas fa-poll', 
    name: 'Vue Rating', 
    link: 'https://surveyjs.io/form-library/examples/rating-scale/documentation' 
  }
]);

// ------ LIFECYCLE HOOKS ------
onMounted(() => {
  // Initialize user ID and store it
  localStorage.setItem('ratingUserId', userId.value);
  
  // Add scroll event for header
  window.addEventListener('scroll', handleScroll);
  
  // Add keyboard event for gallery
  window.addEventListener('keydown', handleKeydown);
  
  // Fetch project ratings
  fetchRatings();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Modern Black & Pink Portfolio Theme */

/* Base Styles & Variables */
:root {
    --primary-pink: #ff69b4; /* Hot Pink */
    --light-pink: #ffb6c1;
    --dark-pink: #c71585;
    --black: #121212;
    --dark-gray: #1a1a1a;
    --light-gray: #2a2a2a;
    --white: #ffffff;
    --off-white: #f8f8f8;
    --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    --transition: all 0.3s ease;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
    line-height: 1.6;
    color: var(--white);
    background-color: var(--black);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    padding-top: 80px;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.2;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--primary-pink);
    position: relative;
    display: inline-block;
  }
  
  h2 i {
    margin-right: 10px;
  }
  
  h3 {
    font-size: 1.5rem;
    color: var(--white);
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  /* Links */
  a {
    color: var(--primary-pink);
    text-decoration: none;
    transition: var(--transition);
  }
  
  a:visited {
    color: var(--primary-pink);
  }
  
  a:hover, a:focus {
    color: var(--light-pink);
  }
  
  /* Header & Navigation */
/* Add this to your style.css file */
/* Header & Navigation */
/* Header & Navigation - Fixed positioning */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  padding: 1rem 0;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 105, 180, 0.3);
  display: flex;
  justify-content: center;
}
  
  /* Container for the header content */
  header > div {
    max-width: 1200px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    justify-content: center; /* Changed from space-between to center */
    align-items: center;
    gap: 2rem; /* Added gap for spacing between logo and nav */
  }
  
  /* Change border color on scroll */
  header.scrolled {
    border-bottom: 2px solid var(--primary-pink);
    background-color: var(--black);
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  
  .logo h1 {
    color: var(--primary-pink);
    margin: 0;
    font-size: 2rem;
    letter-spacing: 1px;
  }
  
/* Navigation styles */
nav {
  display: flex;
  justify-content: center; /* Center navigation links */
}

nav ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  justify-content: center; /* Center the links */
}
  
  nav a {
    padding: 0.5rem 0;
    position: relative;
    color: var(--primary-pink);
    text-decoration: none;
    transition: var(--transition);
  }
  
  /* Fixed indicator line positioning */
  nav a::after {
    content: '';
    position: absolute;
    bottom: -3px; /* Position slightly below text */
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-pink);
    transition: width 0.3s ease;
  }
  
  nav a:hover::after, 
  nav a.active::after {
    width: 100%;
  }
  
  nav a:hover {
    color: var(--primary-pink);
  }
  /* Main Content */
  main {
    margin-bottom: 3rem;
  }
  
  section {
    margin-bottom: 4rem;
  }
  
  /* Hero Section */
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
  
  .social-links a i {
    margin-right: 0.5rem;
  }
  
  .social-links a:hover {
    background-color: var(--primary-pink);
    color: var(--black);
    transform: translateY(-3px);
  }
  
  /* Education Section */
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
  
  /* Skills Section */
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
  }
  
  .skill {
    background-color: var(--dark-gray);
    padding: 1.5rem;
    border-radius: 12px;
    min-width: 150px;
    text-align: center;
    transition: var(--transition);
  }
  
  .skill:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
  }
  
  .skill i {
    font-size: 3rem;
    color: var(--primary-pink);
    margin-bottom: 1rem;
  }
  
  /* Gallery Section */
  .gallery-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: var(--transition);
    border: 2px solid transparent;
  }
  
  .image:hover {
    transform: scale(1.03);
    border: 2px solid var(--primary-pink);
  }
  
  /* Two Column Layout */
  .two-column {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  /* Hobbies & Goals Sections */
  .hobbies, .goals {
    background-color: var(--dark-gray);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--box-shadow);
  }
  
  .interest-list, .goals-list {
    list-style-type: none;
  }
  
  .interest-list li, .goals-list li {
    padding-left: 1.5rem;
    position: relative;
    margin-bottom: 0.7rem;
  }
  
  .interest-list li::before, .goals-list li::before {
    content: "♥";
    color: var(--primary-pink);
    position: absolute;
    left: 0;
  }
  
  /* Projects Section */
  .projects-container {
    background-color: var(--dark-gray);
    padding: 1.5rem;
    border-radius: 12px;
  }

  /* Projects Section */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  background-color: var(--dark-gray);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.project-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.project-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-link {
  background-color: var(--primary-pink);
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 30px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.project-link i {
  font-size: 0.9rem;
}

.project-info {
  padding: 1.5rem;
}

.project-info h3 {
  margin-bottom: 0.8rem;
  color: var(--primary-pink);
}

.project-tech {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-tech span {
  background-color: rgba(255, 105, 180, 0.2);
  color: var(--light-pink);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Project Rating Section */
.project-rating {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.project-rating .stars {
  display: inline-flex;
  margin-right: 0.5rem;
}

/* Star Rating Container */
.stars {
  display: flex;
  gap: 0.3rem;
  cursor: pointer;
}

.stars i {
  cursor: pointer;
  transition: var(--transition);
  color: #ddd;
  transition: color 0.2s;
}

.stars.large {
  font-size: 2rem;
  justify-content: center;
  margin: 1rem 0;
}


.stars i:hover,
.stars i:hover ~ i {
  color: var(--primary-pink);
}

.stars i.fas {
  color: var(--primary-pink);
}

.rating-count {
  color: #888;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

/* Rating Modal */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  overflow: auto;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 500px;
  position: relative;
  animation: modalFadeIn 0.3s;
  border: 1px solid #333;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-50px); }
  to { opacity: 1; transform: translateY(0); }
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}

.close-modal:hover {
  color: var(--primary-pink);
}

.stars.large {
  font-size: 2rem;
  justify-content: center;
  margin: 1rem 0;
}

#rating-comment {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #444;
  color: var(--white);
  padding: 0.8rem;
  border-radius: 8px;
  margin: 1rem 0;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.rating-btn {
  background-color: var(--primary-pink);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: block;
  margin-left: auto;
  float: right;
}

.rating-btn:hover {
  background-color: var(--dark-pink);
  transform: translateY(-3px);
}

textarea {
  width: 100%;
  min-height: 120px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.8rem;
  color: #fff;
  font-family: inherit;
  resize: vertical;
  margin: 1rem 0;
}

/* Project Comments Styling */
.project-comments-container {
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 0.8rem;
  width: 100%;
}

.comments-heading {
  font-size: 0.9rem;
  color: var(--light-pink);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.project-comments {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

/* Individual Comment Styling */
.comment {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border-left: 3px solid var(--primary-pink);
}

.comment-stars {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

.comment-stars .fas {
  color: var(--primary-pink);
}

.comment-text {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  color: var(--white);
}

.comment-date {
  font-size: 0.8rem;
  color: #888;
  text-align: right;
}

.no-comments {
  color: #888;
  font-style: italic;
  font-size: 0.9rem;
}

.view-more-comments {
  background: none;
  border: none;
  color: var(--primary-pink);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  display: block;
  margin: 0.5rem 0;
}

.view-more-comments:hover {
  color: var(--light-pink);
}

/* Comment modal specific styling */
.comments-modal {
  max-width: 600px;
}

.all-comments {
  max-height: 400px;
  overflow-y: auto;
  margin: 1rem 0;
}

/* Scrollbar styling for comment area */
.project-comments::-webkit-scrollbar {
  width: 5px;
}

.project-comments::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.project-comments::-webkit-scrollbar-thumb {
  background: var(--primary-pink);
  border-radius: 10px;
}
  
  /* Resources Section */
  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .resource-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--dark-gray);
    padding: 1.5rem;
    border-radius: 12px;
    transition: var(--transition);
    text-align: center;
  }
  
  .resource-link:hover {
    transform: translateY(-5px);
    background-color: var(--light-gray);
  }
  
  .resource-link i {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  /* Footer */
footer {
  background-color: var(--dark-gray);
  padding: 2rem 0;
  border-top: 1px solid var(--light-gray);
  width: 100%;
  display: flex;
  justify-content: center;
}

.footer-content {
  color: var(--primary-pink);
  max-width: 1200px;
  width: 100%;
  padding: 0 20px; /* Match the padding of other containers */
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

/* Make footer links stand out more */
.footer-links a {
  color: var(--primary-pink);
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--primary-pink);
  text-decoration: underline;
}

/* Added subtle hover effect on copyright text */
footer p {
  transition: var(--transition);
}

footer:hover p {
  color: var(--primary-pink);
}
  /* Media Queries */
  @media (min-width: 768px) {
    .hero-content {
      flex-direction: row;
      text-align: left;
    }
    
    .hero-text {
      text-align: left;
    }
    
    .two-column {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  @media (max-width: 767px) {
    header > div {
      flex-direction: column;
      gap: 0.7rem;
      text-align: center;
    }
      
      header {
        padding: 0.7rem 0;
      }
      
      .container {
        padding-top: 110px; /* Increased for mobile to account for stacked header */
      }

      nav {
        width: 100%;
      }
      
      nav ul {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }
    
    .footer-content {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>