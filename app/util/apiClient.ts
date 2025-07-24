import axios from "axios";

export const api = axios.create(
    {
        baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,  
    }
)

axios.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});
