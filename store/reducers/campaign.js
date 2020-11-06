const defaultHelloScreen = {
  background: '#000',
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
  endScreen: {},
  helloScreen: {},
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
  progression: 0,
  tool: 0,
  videos: [],
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
          ...state.endScreen,
          ...action.data
        },
      }
    case 'CHANGE_HELLO_SCREEN':
      return {
        ...state,
        helloScreen: {
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
        helloScreen: {},
      }
    case 'SET_CAMPAIGN':
      return {
        ...state,
        endScreen: action.data.endScreen || defaultEndScreen,
        helloScreen: action.data.helloScreen || {},
        logo: action.data.logo || initialState.logo,
        name: action.data.name,
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
    case 'SET_VIDEOS':
      return {
        ...state,
        videos: action.data,
      }
    default:
      return state
  }
}

export default reducer