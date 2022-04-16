const initialState = {
   selectedScreen: null,
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case "SET_SELECTED_SCREEN":
         return {
            ...state,
            selectedScreen: action.data,
         };
      default:
         return state;
   }
};

export default reducer;
