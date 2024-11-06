import axios, { AxiosError, isAxiosError } from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5005/webhooks/rest/',
    headers: {
        "Content-Type": "application/json",
    },
});
export default instance;