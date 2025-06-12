import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Update for prod if needed

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
