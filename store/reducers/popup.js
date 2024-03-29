const initialState = {
   display: "",
   data: null,
   target: null,
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case "SHOW_POPUP":
         return {
            ...state,
            display: action.display,
            data: action.data,
            from: action.from,
            target: action.target || null,
         };
      case "HIDE_POPUP":
         return initialState;
      default:
         return state;
   }
};

export default reducer;
