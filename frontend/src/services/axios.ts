import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your backend URL
  withCredentials: true, // add this If you use cookies for auth
});

export default axiosInstance;