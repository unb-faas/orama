import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3001/backend/api/v1",
});

export default api;