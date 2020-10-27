const initialState = {
  isPlaying: false,
  time: 0,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PLAY':
      return {
        ...state,
        isPlaying: true,
      }
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false,
      }
    default:
      return state
  }
}

export default reducer