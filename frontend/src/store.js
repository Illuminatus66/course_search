import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk";
import listReducer from "./reducers/list";

const rootReducer = combineReducers({
  list: listReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
