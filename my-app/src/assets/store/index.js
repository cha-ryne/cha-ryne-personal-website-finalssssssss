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
  const shouldUseCorsProxy = isIPadSafari();
  const baseUrl = shouldUseCorsProxy ? 
    `https://corsproxy.io/?${encodeURIComponent(API_BASE_URL)}` : 
    API_BASE_URL;
  
  return `${baseUrl}${endpoint}`;
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
        let data;
        
        if (isIPadSafari()) {
          // Use XMLHttpRequest with CORS proxy for iPad Safari
          console.log('Using XMLHttpRequest for iPad Safari compatibility');
          
          data = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const timeout = setTimeout(() => {
              xhr.abort();
              reject(new Error('Request timed out'));
            }, 10000);
            
            xhr.open('GET', getApiUrl('/ratings'), true);
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
          // Use fetch for modern browsers with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          try {
            const response = await fetch(getApiUrl('/ratings'), {
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              throw new Error(`Server returned ${response.status}`);
            }
            
            data = await response.json();
          } catch (fetchError) {
            if (fetchError.name === 'AbortError') {
              throw new Error('Request timed out');
            }
            throw fetchError;
          }
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
        
        commit('SET_PROJECT_RATINGS', ratings);
        console.log('Ratings grouped by project:', ratings);
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
        const ratingData = {
          project_id: state.selectedProject,
          user_id: state.userId,
          stars: state.selectedRating,
          comment: state.ratingComment
        };
        
        let responseData;
        
        if (isIPadSafari()) {
          // Use XMLHttpRequest with CORS proxy for iPad Safari
          console.log('Using XMLHttpRequest for submitRating (iPad compatibility)');
          
          responseData = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const timeout = setTimeout(() => {
              xhr.abort();
              reject(new Error('Request timed out'));
            }, 10000);
            
            xhr.open('POST', getApiUrl('/ratings'), true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            
            xhr.onload = () => {
              clearTimeout(timeout);
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const data = JSON.parse(xhr.responseText);
                  resolve(data);
                } catch (e) {
                  reject(new Error('Invalid JSON response'));
                }
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
          // Use fetch for modern browsers with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          try {
            const response = await fetch(getApiUrl('/ratings'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(ratingData),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Server error: ${response.status} ${errorText}`);
            }
            
            responseData = await response.json();
          } catch (fetchError) {
            if (fetchError.name === 'AbortError') {
              throw new Error('Request timed out');
            }
            throw fetchError;
          }
        }
        
        console.log('Rating submitted successfully:', responseData);
        
        // Add the new rating to state
        if (responseData) {
          commit('ADD_RATING', responseData);
        } else {
          // If no response data, refresh all ratings
          await dispatch('fetchRatings');
        }
        
        // Reset and close modal
        commit('SET_SELECTED_PROJECT', null);
        commit('SET_SELECTED_RATING', 0);
        commit('SET_RATING_COMMENT', '');
        commit('SHOW_RATING_MODAL', false);
        
        return { success: true };
      } catch (error) {
        console.error('Error submitting rating:', error);
        let errorMessage = error.message;
        
        if (error.message === 'Failed to fetch' || 
            error.message.includes('load failed') ||
            error.message.includes('Network request failed')) {
          errorMessage = 'Network request failed. Please try again later.';
        }
        
        return { 
          success: false, 
          message: errorMessage 
        };
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