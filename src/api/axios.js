import axios from "axios";

const instance = axios.create({
    baseURL: "https://sm.oportuna.red",
    withCredentials: true,
})

export default instance