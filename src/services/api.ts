import axios from 'axios';

const api = axios.create({
    baseURL: 'https://deploy.ajudacidade.ga',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': true,
    }
});

export default api;