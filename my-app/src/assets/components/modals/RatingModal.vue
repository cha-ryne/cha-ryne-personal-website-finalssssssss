<!-- src/components/modals/RatingModal.vue -->
<template>
    <div class="modal" :style="{ display: 'flex' }">
      <div class="modal-content">
        <span class="close-modal" @click="closeModal">&times;</span>
        <h3>Rate This Project</h3>
        <div class="stars large">
          <i v-for="n in 5" :key="`modal-star-${n}`"
             :class="[n <= selectedRating ? 'fas' : 'far', 'fa-star']"
             @click="updateRating(n)"></i>
        </div>
        <textarea 
          v-model="comment" 
          placeholder="Share your thoughts about this project (optional)"
        ></textarea>
        <button class="rating-btn" @click="submitRating" :disabled="isLoading">
          {{ isLoading ? 'Submitting...' : 'Submit Rating' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore();
  
  // Computed properties from store
  const selectedRating = computed(() => store.state.selectedRating);
  const isLoading = computed(() => store.state.isLoading);
  
  // Local state
  const comment = ref('');
  
  // Watch for changes to store.state.ratingComment
  store.watch(
    state => state.ratingComment,
    newValue => { comment.value = newValue }
  );
  
  // Methods
  function updateRating(stars) {
    store.commit('SET_SELECTED_RATING', stars);
  }
  
  function closeModal() {
    store.dispatch('closeRatingModal');
  }
  
  async function submitRating() {
    // Update comment in store
    store.commit('SET_RATING_COMMENT', comment.value);
    
    // Submit rating
    const result = await store.dispatch('submitRating');
    
    if (result.success) {
      alert('Thank you for your feedback!');
      closeModal();
    } else {
      alert(result.message || 'Failed to submit rating. Please try again.');
    }
  }
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #1a1a1a;
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    padding: 2rem;
    position: relative;
    border: 1px solid #333;
  }
  
  .close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
  }
  
  .close-modal:hover {
    color: #ff69b4;
  }
  
  h3 {
    color: white;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .stars.large {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .stars.large i {
    font-size: 2rem;
    color: #555;
    margin: 0 0.5rem;
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
  }
  
  .stars.large i.fas {
    color: gold;
  }
  
  .stars.large i:hover {
    color: gold;
    transform: scale(1.2);
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
  
  .rating-btn {
    background-color: #ff69b4;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 30px;
    cursor: pointer;
    float: right;
    transition: background-color 0.3s;
  }
  
  .rating-btn:hover {
    background-color: #8a2be2;
  }
  
  .rating-btn:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
  </style>