// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    projectRatings: {},
    userId: localStorage.getItem('ratingUserId') || 
      ('user_' + Math.random().toString(36).substring(2, 9)),
    selectedProject: null,
    selectedRating: 0,
    ratingComment: '',
    showRatingModal: false,
    showCommentsModal: false,
    isLoading: false,
    errorMessage: ''
  },
  
  mutations: {
    SET_PROJECT_RATINGS(state, ratings) {
      state.projectRatings = ratings;
    },
    SET_SELECTED_PROJECT(state, projectId) {
      state.selectedProject = projectId;
    },
    SET_SELECTED_RATING(state, stars) {
      state.selectedRating = stars;
    },
    SET_RATING_COMMENT(state, comment) {
      state.ratingComment = comment;
    },
    SHOW_RATING_MODAL(state, show) {
      state.showRatingModal = show;
    },
    SHOW_COMMENTS_MODAL(state, show) {
      state.showCommentsModal = show;
    },
    SET_LOADING(state, loading) {
      state.isLoading = loading;
    },
    SET_ERROR(state, error) {
      state.errorMessage = error;
    },
    ADD_RATING(state, rating) {
      if (!state.projectRatings[rating.project_id]) {
        state.projectRatings[rating.project_id] = [];
      }
      state.projectRatings[rating.project_id].push(rating);
    }
  },
  
  actions: {
    initUserId({ state }) {
      localStorage.setItem('ratingUserId', state.userId);
    },
    
    // Simplified to use mock data instead of API calls
    async fetchRatings({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      
      try {
        // Using setTimeout to simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        commit('SET_PROJECT_RATINGS', mockRatings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
        commit('SET_ERROR', 'Unable to load ratings. Please try again later.');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Simplified to use mock data
    async submitRating({ state, commit }) {
      if (!state.selectedRating) {
        return { success: false, message: 'Please select a rating by clicking on the stars' };
      }
      
      commit('SET_LOADING', true);
      
      try {
        // Using setTimeout to simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newRating = {
          id: Math.floor(Math.random() * 10000), // Generate random ID
          project_id: state.selectedProject,
          user_id: state.userId,
          stars: state.selectedRating,
          comment: state.ratingComment,
          created_at: new Date().toISOString()
        };
        
        // Add to state directly instead of calling API
        commit('ADD_RATING', newRating);
        
        // Reset and close modal
        commit('SET_SELECTED_PROJECT', null);
        commit('SET_SELECTED_RATING', 0);
        commit('SET_RATING_COMMENT', '');
        commit('SHOW_RATING_MODAL', false);
        
        return { success: true };
      } catch (error) {
        console.error('Error submitting rating:', error);
        return { 
          success: false, 
          message: 'Failed to submit rating. Please try again later.'
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    openRatingModal({ commit }, { projectId, stars = 0 }) {
      commit('SET_SELECTED_PROJECT', parseInt(projectId));
      commit('SET_SELECTED_RATING', parseInt(stars || 0));
      commit('SET_RATING_COMMENT', '');
      commit('SHOW_RATING_MODAL', true);
    },
    
    closeRatingModal({ commit }) {
      commit('SHOW_RATING_MODAL', false);
      commit('SET_SELECTED_PROJECT', null);
      commit('SET_SELECTED_RATING', 0);
      commit('SET_RATING_COMMENT', '');
    },
    
    showAllComments({ commit }, projectId) {
      commit('SET_SELECTED_PROJECT', parseInt(projectId));
      commit('SHOW_COMMENTS_MODAL', true);
    },
    
    closeCommentsModal({ commit }) {
      commit('SHOW_COMMENTS_MODAL', false);
      commit('SET_SELECTED_PROJECT', null);
    }
  },
  
  getters: {
    getAverageRating: (state) => (projectId) => {
      projectId = parseInt(projectId);
      if (!state.projectRatings[projectId] || state.projectRatings[projectId].length === 0) {
        return 0;
      }
      
      const totalStars = state.projectRatings[projectId].reduce((sum, rating) => sum + rating.stars, 0);
      return Math.round(totalStars / state.projectRatings[projectId].length);
    },
    
    commentsWithText: (state) => (projectId) => {
      projectId = parseInt(projectId);
      if (!state.projectRatings[projectId]) return [];
      
      return state.projectRatings[projectId].filter(
        rating => rating.comment && rating.comment.trim() !== ''
      );
    },
    
    getTopComments: (state, getters) => (projectId) => {
      const comments = getters.commentsWithText(projectId);
      
      // Sort by date (newest first)
      comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // Return top 3
      return comments.slice(0, 3);
    },
    
    getAllComments: (state, getters) => () => {
      if (!state.selectedProject || !state.projectRatings[state.selectedProject]) {
        return [];
      }
      
      return getters.commentsWithText(state.selectedProject)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }
});