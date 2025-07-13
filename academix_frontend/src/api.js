import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:8000/api" });
export const createCourse = (subject) =>
  API.post("/courses/create/", { subject });
export const chatWithBot = (topic_id, message) =>
  API.post("/chat/", { topic_id, message });
