// src/store/index.js
import { createStore } from 'vuex';

// API URL with CORS Proxy
const API_URL = 'https://charyn.pythonanywhere.com/api';
const CORS_PROXY = 'https://corsproxy.io/?';

// Function to create proxied URL
const getProxiedUrl = (url) => {
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
};

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
      const projectId = parseInt(rating.project_id);
      if (!state.projectRatings[projectId]) {
        state.projectRatings[projectId] = [];
      }
      state.projectRatings[projectId].push(rating);
    }
  },
  
  actions: {
    initUserId({ state }) {
      localStorage.setItem('ratingUserId', state.userId);
      console.log(`User ID initialized: ${state.userId}`);
    },
    
    async fetchRatings({ commit }) {
      console.log('Fetching ratings via CORS proxy');
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      
      try {
        // Use CORS proxy to bypass CORS restrictions
        const apiUrl = `${API_URL}/ratings`;
        const proxiedUrl = getProxiedUrl(apiUrl);
        console.log('Fetching from proxied URL:', proxiedUrl);
        
        const response = await fetch(proxiedUrl);
        console.log('Ratings response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API returned data:', data);
        
        // Group ratings by project ID
        const ratings = {};
        if (Array.isArray(data)) {
          data.forEach(rating => {
            const projectId = parseInt(rating.project_id);
            if (!ratings[projectId]) {
              ratings[projectId] = [];
            }
            ratings[projectId].push(rating);
          });
          console.log('Grouped ratings:', ratings);
        } else {
          console.warn('API returned non-array data:', data);
        }
        
        commit('SET_PROJECT_RATINGS', ratings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
        commit('SET_ERROR', 'Unable to load ratings. Please try again later.');
        commit('SET_PROJECT_RATINGS', {});
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async submitRating({ state, commit }) {
      if (!state.selectedRating) {
        return { success: false, message: 'Please select a rating by clicking on the stars' };
      }
      
      console.log(`Submitting rating ${state.selectedRating} for project ${state.selectedProject}`);
      commit('SET_LOADING', true);
      
      try {
        const projectId = parseInt(state.selectedProject);
        
        // Create the rating data
        const ratingData = {
          project_id: projectId,
          user_id: state.userId,
          stars: parseInt(state.selectedRating),
          comment: state.ratingComment || ""
        };
        
        console.log('Rating data to send:', ratingData);
        
        // Use CORS proxy for submission
        const apiUrl = `${API_URL}/ratings`;
        const proxiedUrl = getProxiedUrl(apiUrl);
        console.log('Submitting to proxied URL:', proxiedUrl);
        
        const response = await fetch(proxiedUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(ratingData)
        });
        
        console.log('Rating submission response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        // Try to get the new rating from the response
        const newRating = await response.json();
        console.log('New rating from API:', newRating);
        
        // Add the rating from the API response
        if (Array.isArray(newRating) && newRating.length > 0) {
          commit('ADD_RATING', newRating[0]);
        } else if (newRating) {
          commit('ADD_RATING', newRating);
        }
        
        // Reset and close modal
        commit('SET_SELECTED_PROJECT', null);
        commit('SET_SELECTED_RATING', 0);
        commit('SET_RATING_COMMENT', '');
        commit('SHOW_RATING_MODAL', false);
        
        return { success: true };
      } catch (error) {
        console.error('Error submitting rating:', error);
        return { success: false, message: 'Failed to submit rating. Please try again.' };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    openRatingModal({ commit }, { projectId, stars = 0 }) {
      console.log(`Opening rating modal for project ${projectId} with ${stars} stars`);
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
      
      const totalStars = state.projectRatings[projectId].reduce((sum, rating) => sum + parseInt(rating.stars), 0);
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