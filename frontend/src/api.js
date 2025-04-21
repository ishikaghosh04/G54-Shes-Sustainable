import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8800",
  withCredentials: true    // if you need cookies/auth
});

const token = localStorage.getItem("jwt");
if (token) {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default API;
