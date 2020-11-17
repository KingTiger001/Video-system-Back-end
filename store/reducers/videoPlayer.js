const initialState = {
  duration: 0,
  isPlaying: false,
  progression: 0,
  timelineDraggable: false,
  videoRef: {},
  videoSeeking: false,
  volume: 1,
  volumeDraggable: false,
  volumeMuted: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'videoPlayer/PLAY':
      return {
        ...state,
        isPlaying: true,
      }
    case 'videoPlayer/PAUSE':
      return {
        ...state,
        isPlaying: false,
      }
    case 'videoPlayer/SET_DURATION':
      return {
        ...state,
        duration: action.data,
      }
    case 'videoPlayer/SET_PROGRESSION':
      return {
        ...state,
        progression: action.data,
      }
    case 'videoPlayer/SET_VIDEO_REF':
      return {
        ...state,
        videoRef: action.data,
      }
    case 'videoPlayer/SET_VOLUME':
      return {
        ...state,
        volume: action.data,
      }
    case 'videoPlayer/SET_VOLUME_MUTED':
      return {
        ...state,
        volumeMuted: action.data,
      }
    case 'videoPlayer/SET_VIDEO_SEEKING':
      return {
        ...state,
        videoSeeking: action.data,
      }
    case 'videoPlayer/TIMELINE_DRAGGABLE':
      return {
        ...state,
        timelineDraggable: action.data,
      }
    case 'videoPlayer/VOLUME_DRAGGABLE':
      return {
        ...state,
        volumeDraggable: action.data,
      }
    default:
      return state
  }
}

export default reducer