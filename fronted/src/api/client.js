import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

const client = axios.create({
  baseURL: BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

const clearSession = () => {
  ['accessToken', 'refreshToken', 'token', 'user', 'isLoggedIn'].forEach((k) =>
    localStorage.removeItem(k)
  );
  window.dispatchEvent(new Event('storage'));
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return client(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      isRefreshing = false;
      clearSession();
      return Promise.reject(error);
    }

    try {
      const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefresh } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('token', accessToken);
      if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

      processQueue(null, accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return client(original);
    } catch (err) {
      processQueue(err, null);
      clearSession();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;
