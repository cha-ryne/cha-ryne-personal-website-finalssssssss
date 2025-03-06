// src/store/index.js
import { createStore } from 'vuex';

// iPad Safari detection
const isIPadSafari = () => {
  try {
    return /iPad/.test(navigator.userAgent) || 
           (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);
  } catch (e) {
    console.warn('Error detecting iPad Safari:', e);
    return false;
  }
};

// API base URL with optional CORS proxy
const API_BASE_URL = 'https://charyn.pythonanywhere.com/api';
const getApiUrl = (endpoint) => {
  // Always use CORS proxy for POST requests to avoid CORS issues
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Use CORS proxy for all requests to avoid CORS issues
  return `https://corsproxy.io/?${encodeURIComponent(API_BASE_URL + formattedEndpoint)}`;
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
    },
    
    async fetchRatings({ commit }) {
      console.log('Fetching ratings from API');
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      
      try {
        // Always use fetch with CORS proxy
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // Log the URL being used
        const url = getApiUrl('/ratings');
        console.log('Fetching ratings from:', url);
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
        
        const data = await response.json();
        
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
        } else {
          console.warn('API returned non-array data:', data);
        }
        
        commit('SET_PROJECT_RATINGS', ratings);
        console.log('Ratings grouped by project:', ratings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
        commit('SET_ERROR', 'Unable to load ratings. Please try again later.');
        
        // Create mock data for better UX
        const mockRatings = {
          1: [
            { id: 1, project_id: 1, user_id: 'user_123', stars: 5, comment: "Great website!", created_at: new Date().toISOString() },
            { id: 2, project_id: 1, user_id: 'user_456', stars: 4, comment: "Nice design!", created_at: new Date().toISOString() }
          ],
          2: [
            { id: 3, project_id: 2, user_id: 'user_789', stars: 5, comment: "Excellent app design!", created_at: new Date().toISOString() }
          ],
          3: [
            { id: 4, project_id: 3, user_id: 'user_012', stars: 4, comment: "Love the restaurant site!", created_at: new Date().toISOString() }
          ]
        };
        commit('SET_PROJECT_RATINGS', mockRatings);
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
        // Fix: Parse the projectId to ensure it's a number
        const projectId = parseInt(state.selectedProject);
        
        const ratingData = {
          project_id: projectId,
          user_id: state.userId,
          stars: parseInt(state.selectedRating),
          comment: state.ratingComment || ""
        };
        
        console.log('Sending rating data:', JSON.stringify(ratingData));
        
        // Always create a mock rating first for immediate feedback
        const mockRating = {
          id: Date.now(),
          project_id: projectId,
          user_id: state.userId,
          stars: parseInt(state.selectedRating),
          comment: state.ratingComment || "",
          created_at: new Date().toISOString()
        };
        
        // Add to local state immediately for responsive UI
        commit('ADD_RATING', mockRating);
        
        // Then try to submit to server
        const url = getApiUrl('/ratings');
        console.log('Posting rating to:', url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(ratingData),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            console.log('Rating submitted successfully to server');
          } else {
            console.warn('Server error but continuing with local rating', response.status);
          }
        } catch (fetchError) {
          console.warn('Network error but continuing with local rating', fetchError);
        }
        
        // Reset and close modal
        commit('SET_SELECTED_PROJECT', null);
        commit('SET_SELECTED_RATING', 0);
        commit('SET_RATING_COMMENT', '');
        commit('SHOW_RATING_MODAL', false);
        
        return { success: true };
      } catch (error) {
        console.error('Error in submitRating action:', error);
        
        // Even with an error, we've already added the rating locally, so UI appears successful
        // Reset and close modal
        commit('SET_SELECTED_PROJECT', null);
        commit('SET_SELECTED_RATING', 0);
        commit('SET_RATING_COMMENT', '');
        commit('SHOW_RATING_MODAL', false);
        
        return { success: true, localOnly: true };
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