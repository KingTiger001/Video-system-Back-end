const initialState = {
  searchQuery: "",
  sortBy: "createdAt",
  direction: -1,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        ...state,
        searchQuery: action.searchQuery,
        sortBy: "createdAt",
        direction: -1,
      };
    case "HIDE_POPUP":
      return initialState;
    default:
      return state;
  }
};

export default reducer;
