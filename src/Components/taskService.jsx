import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://backendtaskmanager-8r4n.onrender.com/api'
});

export default instance;
