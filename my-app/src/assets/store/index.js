// src/store/index.js
import { createStore } from 'vuex';

// API base URL without the "/api" part (will be added in getApiUrl)
const API_BASE_URL = 'https://charyn.pythonanywhere.com';

// Fix URL construction to properly format the API endpoint
const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Construct the proper URL with /api in the correct place
  const apiUrl = `${API_BASE_URL}/api${formattedEndpoint}`;
  // Use CORS proxy
  return `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
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
      console.log('Fetching ratings from API');
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      
      try {
        // Try several possible API endpoints
        const possibleEndpoints = [
          '/ratings',
          'ratings',
          '',
          '/api/ratings'
        ];
        
        let data = null;
        let successUrl = null;
        
        // Try each endpoint until one works
        for (const endpoint of possibleEndpoints) {
          try {
            const url = getApiUrl(endpoint);
            console.log('Trying endpoint:', url);
            
            const response = await fetch(url, {
              headers: {
                'Accept': 'application/json'
              },
              // Set a short timeout for failed endpoints
              signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
              data = await response.json();
              successUrl = url;
              console.log('Successful API endpoint found:', url);
              break;
            }
          } catch (endpointError) {
            console.warn(`Endpoint ${endpoint} failed:`, endpointError);
            // Continue to next endpoint
          }
        }
        
        if (!data) {
          throw new Error('All API endpoints failed');
        }
        
        console.log('API returned data from', successUrl, ':', data);
        
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
      } catch (error) {
        console.error('Error fetching ratings:', error);
        commit('SET_ERROR', 'Unable to load ratings. Please try again later.');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async submitRating({ state, commit, dispatch }) {
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
        
        // Create a "temporary" rating for better UX
        const tempRating = {
          ...ratingData,
          id: `temp_${Date.now()}`,
          created_at: new Date().toISOString()
        };
        
        // Add temporary rating immediately for responsive UI
        commit('ADD_RATING', tempRating);
        
        // Try several possible API endpoints
        const possibleEndpoints = [
          '/ratings',
          'ratings',
          '',
          '/api/ratings'
        ];
        
        let success = false;
        
        // Try each endpoint until one works
        for (const endpoint of possibleEndpoints) {
          try {
            const url = getApiUrl(endpoint);
            console.log('Trying to POST to endpoint:', url);
            
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(ratingData),
              // Set a short timeout for failed endpoints
              signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
              console.log('Rating submission succeeded at endpoint:', url);
              success = true;
              break;
            } else {
              const text = await response.text();
              console.warn(`Endpoint ${endpoint} returned ${response.status}:`, text);
            }
          } catch (endpointError) {
            console.warn(`POST to endpoint ${endpoint} failed:`, endpointError);
            // Continue to next endpoint
          }
        }
        
        if (!success) {
          console.warn('All API endpoints failed, but continuing with local rating');
        }
        
        // Close the modal regardless of server success (we already added the temp rating)
        commit('SET_SELECTED_PROJECT', null);
        commit('SET_SELECTED_RATING', 0);
        commit('SET_RATING_COMMENT', '');
        commit('SHOW_RATING_MODAL', false);
        
        return { success: true };
      } catch (error) {
        console.error('Error submitting rating:', error);
        
        // Let's be resilient - we've already added a temporary rating
        // so close the modal and let the user continue
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