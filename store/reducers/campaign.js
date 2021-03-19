const defaultHelloScreen = {
  background: '#000',
  duration: 10000,
  name: 'Draft',
  title: {
    color: '#fff',
    displayStyle: false,
    displayVariables: false,
    fontSize: 50,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    value: '',
  },
  subtitle: {
    color: '#fff',
    displayStyle: false,
    displayVariables: false,
    fontSize: 35,
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    value: '',
  },
}

const defaultEndScreen = {
  background: '#000',
  duration: 10000,
  name: 'Draft',
  title: {
    color: '#fff',
    displayStyle: false,
    fontSize: 50,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    value: '',
  },
  subtitle: {
    color: '#fff',
    displayStyle: false,
    fontSize: 35,
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    value: '',
  },
  button: {
    value: '',
    href: '',
  },
  email: {
    color: '#fff',
    displayStyle: false,
    fontSize: 16,
    fontWeight: 400,
    value: '',
  },
  phone: {
    color: '#fff',
    displayStyle: false,
    fontSize: 16,
    fontWeight: 400,
    value: '',
  },
}

const initialState = {
  duration: 0,
  endScreen: {
    duration: 0,
  },
  endScreenList: [],
  hasChanges: false,
  helloScreen: {
    duration: 0,
  },
  helloScreenList: [],
  isPlaying: false,
  logo: {
    placement: 'top-left',
    value: '',
    size: 60,
  },
  name: '',
  preview: {
    show: false,
    element: 'video',
  },
  previewEndScreen: {},
  previewHelloScreen: {},
  previewVideo: {},
  progression: 0,
  timelineDraggable: false,
  tool: 0,
  video: {},
  videoList: [],
  videoRef: {},
  videoSeeking: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_END_SCREEN':
      return {
        ...state,
        endScreen: defaultEndScreen,
      }
    case 'ADD_HELLO_SCREEN':
      return {
        ...state,
        helloScreen: defaultHelloScreen,
      }
    case 'CHANGE_END_SCREEN':
      return {
        ...state,
        endScreen: {
          duration: 10000,
          ...state.endScreen,
          ...action.data
        },
      }
    case 'CHANGE_HELLO_SCREEN':
      return {
        ...state,
        helloScreen: {
          duration: 10000,
          ...state.helloScreen,
          ...action.data
        },
      }
    case 'CHANGE_LOGO':
      return {
        ...state,
        logo: {
          ...state.logo,
          ...action.data
        },
      }
    case 'HAS_CHANGES':
      return {
        ...state,
        hasChanges: action.data,
      }
    case 'SHOW_PREVIEW':
      return {
        ...state,
        preview: {
          ...state.preview,
          show: true,
          ...action.data,
        },
      }
    case 'HIDE_PREVIEW':
      return {
        ...state,
        preview: {
          ...state.preview,
          show: false,
        },
      }
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
    case 'RESET_END_SCREEN':
      return {
        ...state,
        endScreen: {
          duration: 0,
        },
      }
    case 'RESET_HELLO_SCREEN':
      return {
        ...state,
        helloScreen: {
          duration: 0,
        },
      }
    case 'SET_CAMPAIGN':
      return {
        ...state,
        endScreen: action.data.endScreen || { duration: 0 },
        helloScreen: action.data.helloScreen || { duration: 0 },
        logo: action.data.logo || initialState.logo,
        name: action.data.name,
        video: action.data.video || {},
      }
    case 'CALC_DURATION':
      const { endScreen, helloScreen, video } = state
      return {
        ...state,
        duration: (helloScreen && Object.keys(helloScreen).length > 1 ? helloScreen.duration : 0) + (Object.keys(video).length > 0 ? video.metadata.duration * 1000 : 0) + (endScreen && Object.keys(endScreen).length > 1 ? endScreen.duration : 0),
      }
    case 'SET_END_SCREEN_LIST':
      return {
        ...state,
        endScreenList: action.data,
      }
    case 'SET_HELLO_SCREEN_LIST':
      return {
        ...state,
        helloScreenList: action.data,
      }
    case 'SET_NAME':
      return {
        ...state,
        name: action.data,
      }
    case 'SET_PREVIEW_END_SCREEN':
      return {
        ...state,
        previewEndScreen: action.data,
      }
    case 'SET_PREVIEW_HELLO_SCREEN':
      return {
        ...state,
        previewHelloScreen: action.data,
      }
    case 'SET_PREVIEW_VIDEO':
      return {
        ...state,
        previewVideo: action.data,
      }
    case 'SET_PROGRESSION':
      return {
        ...state,
        progression: action.data,
      }
    case 'SELECT_TOOL':
      return {
        ...state,
        tool: action.data,
      }
    case 'SET_VIDEO':
      return {
        ...state,
        duration: state.helloScreen.duration + (Object.keys(action.data).length > 0 ? action.data.metadata.duration * 1000 : 0) + state.endScreen.duration,
        video: action.data,
      }
    case 'SET_VIDEO_LIST':
      return {
        ...state,
        videoList: action.data,
      }
    case 'SET_VIDEO_REF':
      return {
        ...state,
        videoRef: action.data,
      }
    case 'SET_VIDEO_SEEKING':
      return {
        ...state,
        videoSeeking: action.data,
      }
    case 'TIMELINE_DRAGGABLE':
      return {
        ...state,
        timelineDraggable: action.data,
      }
    default:
      return state
  }
}

export default reducer