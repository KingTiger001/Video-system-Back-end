export const defaultHelloScreen = {
  background: "#000",
  duration: 200, // 0.2s
  name: "Draft",
  title: {
    color: "#fff",
    displayStyle: false,
    displayVariables: false,
    fontSize: 50,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: "center",
    value: "",
  },
  subtitle: {
    color: "#fff",
    displayStyle: false,
    displayVariables: false,
    fontSize: 35,
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: "center",
    value: "",
  },
};

export const defaultEndScreen = {
  background: "#000",
  duration: 1, // 0.2s
  name: "Draft",
  title: {
    color: "#fff",
    displayStyle: false,
    fontSize: 50,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: "center",
    value: "",
  },
  subtitle: {
    color: "#fff",
    displayStyle: false,
    fontSize: 35,
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: "center",
    value: "",
  },
  button: {
    value: "",
    href: "",
  },
  email: {
    color: "#fff",
    displayStyle: false,
    fontSize: 16,
    fontWeight: 400,
    value: "",
  },
  phone: {
    color: "#fff",
    displayStyle: false,
    fontSize: 16,
    fontWeight: 400,
    value: "",
  },
};

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
    placement: "top-left",
    value: "",
    size: 60,
  },
  name: "",
  preview: {
    show: false,
    element: "video",
  },
  previewEndScreen: {},
  previewHelloScreen: {},
  previewVideo: {},
  progression: 0,
  timelineDraggable: false,
  tool: 0,
  toolItem: 0,
  contents: [],
  videoList: [],
  videoRef: {},
  videosRef: [],
  currentVideo: -1,
  currentOverlay: -1,
  videosOffset: [],
  videoSeeking: false,
  selectedContent: {},
  finalVideo: { url: null },
};

const getDurationByType = (elem) => {
  if (!elem) return;
  switch (elem.type) {
    case "video":
      return elem.video.metadata.duration;

    case "screen":
      return elem.screen.duration;
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_END_SCREEN":
      return {
        ...state,
        endScreen: defaultEndScreen,
      };
    case "ADD_HELLO_SCREEN":
      return {
        ...state,
        helloScreen: defaultHelloScreen,
      };
    case "CHANGE_END_SCREEN":
      return {
        ...state,
        endScreen: {
          ...state.endScreen,
          ...action.data,
        },
      };
    case "CHANGE_HELLO_SCREEN":
      return {
        ...state,
        helloScreen: {
          duration: 10000,
          ...state.helloScreen,
          ...action.data,
        },
      };
    case "CHANGE_LOGO":
      return {
        ...state,
        logo: {
          ...state.logo,
          ...action.data,
        },
      };
    case "HAS_CHANGES":
      return {
        ...state,
        hasChanges: action.data,
      };
    case "SHOW_PREVIEW":
      return {
        ...state,
        preview: {
          ...state.preview,
          show: true,
          ...action.data,
        },
      };
    case "HIDE_PREVIEW":
      return {
        ...state,
        preview: {
          ...state.preview,
          show: false,
        },
      };
    case "PLAY":
      return {
        ...state,
        isPlaying: true,
      };
    case "PAUSE":
      return {
        ...state,
        isPlaying: false,
      };
    case "RESET_END_SCREEN":
      return {
        ...state,
        endScreen: {
          duration: 0,
        },
      };
    case "RESET_HELLO_SCREEN":
      return {
        ...state,
        helloScreen: {
          duration: 0,
        },
      };
    case "SET_CAMPAIGN":
      const contentsArr = action.data.contents
        ? action.data.contents.sort((a, b) => a.position - b.position)
        : [];
      return {
        ...state,
        endScreen: action.data.endScreen || { duration: 0 },
        helloScreen: action.data.helloScreen || { duration: 0 },
        _id: action.data._id,
        logo: action.data.logo || initialState.logo,
        name: action.data.name,
        finalVideo: action.data.finalVideo || initialState.finalVideo,
        contents: contentsArr || [],
      };
    case "CALC_DURATION":
      const { contents } = state;
      const totalDuration = contents.reduce(
        (prev, cur) => prev + getDurationByType(cur),
        0
      );
      return {
        ...state,
        duration: contents.length > 0 ? totalDuration * 1000 : 0,
      };
    case "SET_END_SCREEN_LIST":
      return {
        ...state,
        endScreenList: action.data,
      };
    case "SET_HELLO_SCREEN_LIST":
      return {
        ...state,
        helloScreenList: action.data,
      };
    case "SET_NAME":
      return {
        ...state,
        name: action.data,
      };
    case "SET_PREVIEW_END_SCREEN":
      return {
        ...state,
        previewEndScreen: action.data,
      };
    case "SET_PREVIEW_HELLO_SCREEN":
      return {
        ...state,
        previewHelloScreen: action.data,
      };
    case "SET_PREVIEW_VIDEO":
      return {
        ...state,
        previewVideo: action.data,
      };
    case "SET_PROGRESSION":
      return {
        ...state,
        progression: action.data,
      };
    case "SELECT_TOOL":
      return {
        ...state,
        tool: action.data,
      };
    case "SELECT_TOOL_ITEM":
      return {
        ...state,
        toolItem: action.data,
      };
    case "SET_VIDEO":
      const setVideoDuration = action.data.reduce(
        (prev, cur) => prev + getDurationByType(cur),
        0
      );
      return {
        ...state,
        duration:
          Object.keys(action.data).length > 0 ? setVideoDuration * 1000 : 0,
        contents: action.data,
      };
    case "SET_VIDEO_LIST":
      return {
        ...state,
        videoList: action.data,
      };
    case "SET_VIDEO_REF":
      return {
        ...state,
        videoRef: action.data,
      };
    case "SET_VIDEOS_REF":
      const refs = action.data ? [...state.videosRef, action.data] : [];
      return { ...state, videosRef: refs };
    case "SET_CURRENT_VIDEO":
      return {
        ...state,
        currentVideo: action.data,
      };
    case "SET_CURRENT_OVERLAY":
      return {
        ...state,
        currentOverlay: action.data,
      };
    case "CALC_VIDEOS_OFFSET":
      const videosOffset = [];
      for (let i = 0; i < action.data.length; i++) {
        videosOffset[i] =
          (videosOffset[i - 1] || 0) +
          (getDurationByType(action.data[i - 1]) || 0);
      }
      return {
        ...state,
        videosOffset: videosOffset,
      };
    case "SET_VIDEO_SEEKING":
      return {
        ...state,
        videoSeeking: action.data,
      };
    case "TIMELINE_DRAGGABLE":
      return {
        ...state,
        timelineDraggable: action.data,
      };
    case "SET_SELECTED_CONTENT":
      return {
        ...state,
        selectedContent: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
