import axios from 'axios';

const apiClient = axios.create({
  // Replace this with your actual Mac IP found in the step above
  baseURL: 'http://50.0.2.1:5001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;