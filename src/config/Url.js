import axios from 'axios';

const getBaseURL = () => {
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5001/api';
  }
  return 'https://cbd-backend.onrender.com/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
});