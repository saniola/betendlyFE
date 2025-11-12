import axios from 'axios';

function createApi() {
  const token = localStorage.getItem('token');

  return axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
}

export const http = createApi();
