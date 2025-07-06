import { Description } from '@radix-ui/react-dialog';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; 

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
  try {
    const res = await axios.post(`${API_BASE_URL}/send-roadmap-start-email`, {
      email,
      title,
      description,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to send roadmap start email:", error);
    throw error;
  }
};
