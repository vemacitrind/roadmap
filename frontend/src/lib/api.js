import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; 

export const sendProgressEmail = async (email, progressData) => {
  return axios.post(`${API_BASE_URL}/send-progress-email`, {
    email,
    data: progressData,
  });
};

export const askChatbot = async (prompt) => {
  return axios.post(`${API_BASE_URL}/chatbot`, {
    prompt,
  });
};

export const saveDailyLog = async (userId, logData) => {
  return axios.post(`${API_BASE_URL}/log-daily-progress`, {
    userId,
    log: logData,
  });
};

export const sendRoadmapStartEmail = async (email, title, description) => {
  axios.post(`${API_BASE_URL}/send-roadmap-start-email`, {
    email: email,
    title: title,
    description: description,
  })
  .then((res) => {})
  .catch((err) => console.error(err.response?.data || err.message));
};

