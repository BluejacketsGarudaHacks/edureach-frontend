import axios from "axios";

export const api = axios.create(
    {
        baseURL: "",  
    }
)

axios.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});
