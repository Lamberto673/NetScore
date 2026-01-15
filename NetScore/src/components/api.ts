import axios from "axios";

const Api = axios.create({
    baseURL:"http://localhost:5001",
    withCredentials: true,
})
export default Api;