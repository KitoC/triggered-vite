import axios from 'axios';

const api = {
  sanityProxy: axios.create({ baseURL: import.meta.env.VITE_PROXY_SERVER_URL }),
};

export default api;
