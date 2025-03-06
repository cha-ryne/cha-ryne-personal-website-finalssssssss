<template>
  <section class="projects" id="projects">
    <h2><span class="icon">⭐</span> My Projects</h2>
    <p>Check out my latest work and share your feedback!</p>
    
    <div class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-image" :style="`background-image: url(${getImagePath(project.image)})`">
          <div class="project-overlay">
            <a :href="project.link" target="_blank" class="project-link">
              <span class="icon link-icon">🔗</span> View Project
            </a>
          </div>
        </div>
        <div class="project-info">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="project-rating" :data-project="project.id">
            <div class="rating-wrapper">
              <div class="stars">
                <span v-for="n in 5" :key="`project${project.id}-star-${n}`" 
                   :class="['star', n <= getAverageRating(project.id) ? 'filled' : '']"
                   @click="openRatingModal(project.id, n)">★</span>
              </div>
              <span class="rating-count">
                ({{ projectRatings[project.id] ? projectRatings[project.id].length : 0 }} ratings)
              </span>
            </div>
            <div class="project-comments-container">
              <h4 class="comments-heading">Feedback</h4>
              <div class="project-comments">
                <div v-if="!hasComments(project.id)" class="no-comments">
                  No feedback yet. Be the first to comment!
                </div>
                <div v-else>
                  <div v-for="rating in getTopComments(project.id)" :key="rating.id" class="comment">
                    <div class="comment-stars">
                      <span v-for="n in 5" :key="`rating-${rating.id}-star-${n}`"
                         :class="['star', n <= rating.stars ? 'filled' : '']">★</span>
                    </div>
                    <p class="comment-text">{{ rating.comment }}</p>
                    <p class="comment-date">{{ formatDate(rating.created_at) }}</p>
                  </div>
                  <button v-if="commentsWithText(project.id).length > 3"
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
    
    <rating-modal v-if="showRatingModal" />
    <comments-modal v-if="showCommentsModal" />
  </section>
</template>

<script setup>
// Script content remains the same
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import RatingModal from '../components/modals/RatingModal.vue';
import CommentsModal from '../components/modals/CommentsModal.vue';

// Helper function - simpler version of the original
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getImagePath(path) {
  if (path.startsWith('http')) {
    return path;
  }
  // Since images are in public/images, keep the path as is
  return path;
}

const store = useStore();

// Projects data
const projects = ref([
  {
    id: 1,
    title: "Personal Website",
    description: "A responsive personal website.",
    image: "/images/proj1.png", 
    link: "/"
  },
  {
    id: 2,
    title: "Ramquest",
    description: "A mobile wireframe of Ramquest app.",
    image: "/images/proj2.png", 
    link: "https://www.figma.com/proto/tQESkzv4TdzWyUJZHTJjIK/RAMQUEST-MOBILE-VERSION"
  },
  {
    id: 3,
    title: "Meneshu",
    description: "A responsive restaurant website.",
    image: "/images/proj3.png", 
    link: "https://rheaanne.github.io/Meneshu/home/"
  }
]);

// Computed properties from store
const projectRatings = computed(() => store.state.projectRatings);
const showRatingModal = computed(() => store.state.showRatingModal);
const showCommentsModal = computed(() => store.state.showCommentsModal);
const isLoading = computed(() => store.state.isLoading);
const errorMessage = computed(() => store.state.errorMessage);

// Methods mapped from store
function openRatingModal(projectId, stars) {
  store.dispatch('openRatingModal', { projectId, stars });
}

function showAllComments(projectId) {
  store.dispatch('showAllComments', projectId);
}

// Getters mapped from store
function getAverageRating(projectId) {
  return store.getters.getAverageRating(projectId);
}

function commentsWithText(projectId) {
  return store.getters.commentsWithText(projectId);
}

function getTopComments(projectId) {
  return store.getters.getTopComments(projectId);
}

function hasComments(projectId) {
  const comments = commentsWithText(projectId);
  return comments && comments.length > 0;
}

// Initialize ratings on mount
onMounted(() => {
  if (!Object.keys(projectRatings.value).length) {
    store.dispatch('fetchRatings');
  }
});
</script>

<style scoped>
.projects {
  padding: 4rem 2rem;
  background-color: #1a1a1a;
  text-align: center;
}

.projects h2 {
  color: #ff69b4;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.projects h2 .icon {
  color: #ff69b4;
  margin-right: 0.5rem;
}

.projects p {
  color: #b3b3b3;
  margin-bottom: 3rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  background: linear-gradient(145deg, #1a1a1a, #242424);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.project-overlay:hover {
  opacity: 1;
}

.project-link {
  color: white;
  text-decoration: none;
  background: #ff69b4;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  transform: translateY(20px);
  transition: transform 0.3s;
}

.project-overlay:hover .project-link {
  transform: translateY(0);
}

.project-link:hover {
  background: #8a2be2;
}

.link-icon {
  margin-right: 5px;
}

.project-info {
  padding: 1.5rem;
}

.project-info h3 {
  color: white;
  margin-bottom: 0.5rem;
}

.project-info p {
  color: #b3b3b3;
  margin-bottom: 1rem;
}

.project-rating {
  margin-top: 1.5rem;
}

/* New wrapper for rating components */
.rating-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

/* Center the stars */
.stars {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.star {
  color: #999;
  margin: 0 0.125rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.star.filled {
  color: gold;
}

.star:hover {
  color: gold;
}

.rating-count {
  font-size: 0.8rem;
  color: #777;
  text-align: center;
  display: block;
}

.project-comments-container {
  margin-top: 1.5rem;
}

.comments-heading {
  font-size: 1rem;
  color: #ddd;
  margin-bottom: 0.5rem;
}

.no-comments {
  font-style: italic;
  font-size: 0.9rem;
  color: #777;
}

.comment {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.comment-stars .star {
  font-size: 0.8rem;
  color: #999;
  margin-right: 0.25rem;
}

.comment-stars .star.filled {
  color: gold;
}

.comment-text {
  font-size: 0.9rem;
  color: #ddd;
  margin: 0.5rem 0;
}

.comment-date {
  font-size: 0.7rem;
  color: #777;
}

.view-more-comments {
  background: transparent;
  color: #ff69b4;
  border: none;
  font-size: 0.9rem;
  padding: 0;
  cursor: pointer;
}

.view-more-comments:hover {
  text-decoration: underline;
}
</style>