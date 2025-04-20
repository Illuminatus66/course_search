import axios from "axios";

const API = axios.create({
  baseURL: "https://example-backend.com/",
});

export const search = (query) => API.post("/search", {query});
export const fetchdocument = (filename) => API.get(`document/${filename}`);