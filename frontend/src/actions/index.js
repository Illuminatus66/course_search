import * as api from "../api";
import { CLEAR_LIST, SEARCH_QUERY } from "./actionTypes";

export const searchQuery = (query) => async (dispatch) => {
  try {
    const { data } = await api.search(query);
    dispatch({ type: SEARCH_QUERY, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const fetchDocument = (filename) => async () => {
  try {
    const { data } = await api.fetchdocument(filename);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const clearList = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_LIST });
  } catch (error) {
    console.log(error);
  }
};
