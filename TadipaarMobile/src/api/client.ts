import axios from 'axios';

const apiClient = axios.create({
  // Replace this with your actual Mac IP found in the step above
  baseURL: 'http://10.121.105.170:5001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;