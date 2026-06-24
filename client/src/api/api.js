import axios from "axios";

const API = axios.create({
  baseURL: "https://bugtracker-pw71.onrender.com/api",
});

export default API;