import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        "Content-Type": "application/json",
    },
});


// Add a request interceptor
instance.interceptors.request.use(
    async function (config) {
        let accessToken = localStorage.getItem("accessToken");

        config.headers.Authorization = "Bearer " + accessToken;
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);


// Add a response interceptor
instance.interceptors.response.use(
    function (response) {

        return response;
    },
    function (error) {

        return Promise.reject(error.response.data);
    }
);


export default instance;