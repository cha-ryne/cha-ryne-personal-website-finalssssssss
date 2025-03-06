// src/store/index.js
import { createStore } from 'vuex';
import axios from 'axios';

// iPad Safari detection
const isIPadSafari = /iPad/.test(navigator.userAgent) || 
                   (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);

// API base URL with optional CORS proxy
const API_BASE_URL = 'https://charyn.pythonanywhere.com/api';
const API_URL = isIPadSafari ? 
  `https://corsproxy.io/?${encodeURIComponent(API_BASE_URL)}` : 
  API_BASE_URL;

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
        
        if (isIPadSafari) {
          // Use XMLHttpRequest with CORS proxy for iPad Safari
          console.log('Using XMLHttpRequest with CORS proxy for fetchRatings (iPad compatibility)');
          
          data = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const timeout = setTimeout(() => {
              xhr.abort();
              reject(new Error('Request timed out'));
            }, 10000);
            
            xhr.open('GET', `https://corsproxy.io/?${encodeURIComponent(API_BASE_URL)}/ratings`, true);
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
          
          console.log('Got API response via XMLHttpRequest:', data);
        } else {
          // Use fetch for modern browsers
          const response = await fetch(`${API_BASE_URL}/ratings`);
          
          // Check for HTTP errors
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
          
          data = await response.json();
          console.log('API response via fetch:', data);
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
        
        console.log('Rating data:', ratingData);
        
        if (isIPadSafari) {
          // Use XMLHttpRequest with CORS proxy for iPad Safari
          console.log('Using XMLHttpRequest with CORS proxy for submitRating (iPad compatibility)');
          
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const timeout = setTimeout(() => {
              xhr.abort();
              reject(new Error('Request timed out'));
            }, 10000);
            
            xhr.open('POST', `https://corsproxy.io/?${encodeURIComponent(API_BASE_URL)}/ratings`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            
            xhr.onload = () => {
              clearTimeout(timeout);
              if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                console.log('Rating submitted successfully:', data);
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
          // Use fetch for modern browsers
          const fetchOptions = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify(ratingData)
          };
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), 10000)
          );
          
          const response = await Promise.race([
            fetch(`${API_BASE_URL}/ratings`, fetchOptions),
            timeoutPromise
          ]);
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} ${errorText}`);
          }
          
          const data = await response.json();
          console.log('Rating submitted successfully:', data);
        }
        
        // Refresh ratings
        await dispatch('fetchRatings');
        
        // Reset and close modal
        commit('SET_SELECTED_PROJECT', null);
        commit('SET_SELECTED_RATING', 0);
        commit('SET_RATING_COMMENT', '');
        commit('SHOW_RATING_MODAL', false);
        
        return { success: true };
      } catch (error) {
        console.error('Error submitting rating:', error);
        let errorMessage = error.message;
        if (error.message === 'Failed to fetch' || error.message.includes('load failed')) {
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