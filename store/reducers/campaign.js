const defaultHelloScreen = {
  background: '#000',
  title: {
    color: '#fff',
    displayOptions: false,
    fontSize: 35,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    value: '',
  },
  subtitle: {
    color: '#fff',
    displayOptions: false,
    fontSize: 20,
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    value: '',
  },
}

const initialState = {
  displayElement: 'video',
  endScreen: {
    background: '#000',
    title: {
      color: '#fff',
      displayOptions: false,
      fontSize: 35,
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1,
      textAlign: 'center',
      value: '',
    },
    subtitle: {
      color: '#fff',
      displayOptions: false,
      fontSize: 20,
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
  },
  helloScreen: defaultHelloScreen,
  helloScreenList: [],
  isPlaying: false,
  logo: {
    placement: 'bottom-left',
    value: '',
  },
  tool: 0,
  time: 0,
  videos: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
    case 'DISPLAY_ELEMENT':
      return {
        ...state,
        displayElement: action.data,
      }
    case 'SHOW_ELEMENT':
      return {
        ...state,
        displayElement: action.data,
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
        helloScreen: defaultHelloScreen,
      }
    case 'SELECT_TOOL':
      return {
        ...state,
        tool: action.data,
      }
    case 'SET_HELLO_SCREEN_LIST':
      return {
        ...state,
        helloScreenList: action.data,
      }
    case 'SET_LOGO':
      return {
        ...state,
        logo: {
          ...state.logo,
          ...action.data
        },
      }
    case 'SET_TIME':
      return {
        ...state,
        time: action.data,
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