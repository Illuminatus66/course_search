import { CLEAR_LIST, SEARCH_QUERY } from "../actions/actionTypes";

const initialState = {
  list: [],
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_LIST:
      return { ...state, list: [] };
    case SEARCH_QUERY:
      return {
        ...state,
        list: action.payload.results,
      };
    default:
      return state;
  }
};

export default listReducer;
