const defaultHelloScreen = {
  background: '#000',
  duration: 10000,
  title: {
    color: '#fff',
    displayOptions: false,
    fontSize: 50,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    value: '',
  },
  subtitle: {
    color: '#fff',
    displayOptions: false,
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
  title: {
    color: '#fff',
    displayOptions: false,
    fontSize: 50,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    value: '',
  },
  subtitle: {
    color: '#fff',
    displayOptions: false,
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
    displayOptions: false,
    fontSize: 16,
    fontWeight: 400,
    value: '',
  },
  phone: {
    color: '#fff',
    displayOptions: false,
    fontSize: 16,
    fontWeight: 400,
    value: '',
  },
}

const initialState = {
  duration: 110000,
  endScreen: {
    duration: 0,
  },
  helloScreen: {
    duration: 0,
  },
  helloScreenList: [],
  isPlaying: false,
  logo: {
    placement: 'top-left',
    value: '',
    size: 50,
  },
  name: '',
  preview: {
    show: false,
    element: 'video',
  },
  previewHelloScreen: {},
  previewVideo: '',
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
    case 'SHOW_PREVIEW':
      return {
        ...state,
        preview: {
          show: true,
          ...action.data
        },
      }
    case 'HIDE_PREVIEW':
      return {
        ...state,
        preview: {
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
        endScreen: action.data.endScreen || defaultEndScreen,
        helloScreen: action.data.helloScreen || { duration: 0 },
        logo: action.data.logo || initialState.logo,
        name: action.data.name,
        video: action.data.video || {},
      }
    case 'SET_DURATION':
      const { endScreen, helloScreen, video } = state
      return {
        ...state,
        duration: (helloScreen && Object.keys(helloScreen).length > 1 ? helloScreen.duration : 0) + (Object.keys(video).length > 0 ? video.metadata.duration * 1000 : 0) + (endScreen && Object.keys(endScreen).length > 1 ? endScreen.duration : 0),
      }
    case 'SET_HELLO_SCREEN_LIST':
      return {
        ...state,
        helloScreenList: action.data,
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
    case 'SELECT_TOOL':
      return {
        ...state,
        tool: action.data,
      }
    case 'SET_NAME':
      return {
        ...state,
        name: action.data,
      }
    case 'SET_PROGRESSION':
      return {
        ...state,
        progression: action.data,
      }
    case 'SET_VIDEO':
      return {
        ...state,
        duration: state.helloScreen.duration + (action.data.metadata.duration * 1000) + state.endScreen.duration,
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