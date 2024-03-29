import { useMemo } from "react";
import { applyMiddleware, createStore, combineReducers } from "redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

// Reducers
import campaign from "./reducers/campaign";
import popup from "./reducers/popup";
import videoPlayer from "./reducers/videoPlayer";
import global from "./reducers/global";

let store;

function initStore(preloadedState = {}) {
   return createStore(
      combineReducers({
         campaign,
         popup,
         global,
         videoPlayer,
      }),
      preloadedState,
      composeWithDevTools(applyMiddleware(logger))
   );
}

export const initializeStore = (preloadedState) => {
   let _store = store ?? initStore(preloadedState);

   // After navigating to a page with an initial Redux state, merge that state
   // with the current state in the store, and create a new store
   if (preloadedState && store) {
      _store = initStore({
         ...store.getState(),
         ...preloadedState,
      });
      // Reset the current store
      store = undefined;
   }

   // For SSG and SSR always create a new store
   if (typeof window === "undefined") return _store;
   // Create the store once in the client
   if (!store) store = _store;

   return _store;
};

export function useStore(initialState) {
   const store = useMemo(() => initializeStore(initialState), [initialState]);
   return store;
}
