import axios from "axios";

const API = axios.create({
  baseURL: "https://irda-00cb067661c9.herokuapp.com/",
});

export const search = (query) => API.post("search", {query});
export const fetchdocument = (filename) => API.get(`document/${filename}`);