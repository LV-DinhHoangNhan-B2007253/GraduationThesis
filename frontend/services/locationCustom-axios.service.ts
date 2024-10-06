import axios, { AxiosError, isAxiosError } from "axios";

const locationApi = axios.create({
    baseURL: 'https://vapi.vnappmob.com/api',
    headers: {
        "Content-Type": "application/json",
    },
});




export default locationApi;