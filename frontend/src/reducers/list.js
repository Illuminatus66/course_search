import { CLEAR_LIST, SEARCH_QUERY } from "../actions/actionTypes";

const initialState = {
  list: [],
  analysis: [],
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_LIST:
      return { ...state, list: [], analysis: [] };
    case SEARCH_QUERY:
      return {
        ...state,
        list: action.payload.results,
        analysis: action.payload.analysis,
      };
    default:
      return state;
  }
};

export default listReducer;
