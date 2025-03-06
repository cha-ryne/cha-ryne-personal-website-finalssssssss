<!-- src/components/modals/CommentsModal.vue -->
<template>
  <div class="modal" :style="{ display: 'flex' }">
    <div class="modal-content comments-modal">
      <span class="close-modal" @click="closeModal">&times;</span>
      <h3>All Feedback</h3>
      <div class="all-comments">
        <div v-if="!hasComments" class="no-comments">
          No comments yet. Be the first to rate this project with a comment!
        </div>
        <div v-else>
          <div v-for="rating in allComments" :key="rating.id" class="comment">
            <div class="comment-stars">
              <span v-for="n in 5" :key="`all-comment-${rating.id}-star-${n}`"
                 :class="['star', n <= rating.stars ? 'filled' : '']">★</span>
            </div>
            <p class="comment-text">{{ rating.comment }}</p>
            <p class="comment-date">{{ formatDate(rating.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

// Local formatter function instead of importing
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const store = useStore();

// Computed properties
const allComments = computed(() => store.getters.getAllComments());
const hasComments = computed(() => allComments.value.length > 0);

// Methods
function closeModal() {
  store.dispatch('closeCommentsModal');
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

.comments-modal {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
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

.all-comments {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.all-comments::-webkit-scrollbar {
  width: 6px;
}

.all-comments::-webkit-scrollbar-track {
  background: #333;
  border-radius: 10px;
}

.all-comments::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}

.no-comments {
  font-style: italic;
  font-size: 1rem;
  color: #777;
  text-align: center;
  padding: 2rem 0;
}

.comment {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.comment-stars .star {
  font-size: 0.9rem;
  color: #999;
  margin-right: 0.25rem;
}

.comment-stars .star.filled {
  color: gold;
}

.comment-text {
  font-size: 1rem;
  color: #ddd;
  margin: 0.8rem 0;
  line-height: 1.5;
}

.comment-date {
  font-size: 0.8rem;
  color: #777;
  text-align: right;
}
</style>