import { createStore, combineReducers } from "redux";
import { createUseReduxStore } from "@aicacia/use-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as decksReducer } from "./decks/reducer";
import { reducer as questionsReducer } from "./questions/reducer";
import { reducer as userReducer } from "./user/reducer";

export const store = createStore(
  combineReducers({
    decks: decksReducer,
    questions: questionsReducer,
    user: userReducer,
  }),
  composeWithDevTools()
);

export type IState = ReturnType<typeof store["getState"]>;

export const useReduxStore = createUseReduxStore(store);
