import { useEffect, useRef, useState } from 'react'
import { ChromePicker } from 'react-color'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import InputWithTools from '@/components/Campaign/InputWithTools'
import PopupDeleteHelloScreen from '@/components/Popups/PopupDeleteHelloScreen'
import PopupDeleteDraftHelloScreen from '@/components/Popups/PopupDeleteDraftHelloScreen'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const ToolHelloScreen = ({ me }) => {
  const dispatch = useDispatch()
  const popup = useSelector((state) => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) =>
    dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const tool = useSelector((state) => state.campaign.tool)

  const helloScreen = useSelector((state) => state.campaign.helloScreen)
  const helloScreenList = useSelector((state) => state.campaign.helloScreenList)
  const preview = useSelector((state) => state.campaign.preview)
  const previewHelloScreen = useSelector(
    (state) => state.campaign.previewHelloScreen
  )

  const [displayFormHelloScreen, showFormHelloScreen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showColor, setShowColor] = useState(false)
  const [showOptions, setShowOptions] = useState({
    display: false,
    data: null,
  })
  const addHelloScreenToLibrary = async () => {
    try {
      if (!editMode) {
        const { data } = await mainAPI.post(`/helloScreens`, helloScreen)
        dispatch({
          type: 'CHANGE_HELLO_SCREEN',
          data,
        })
        toast.success(`Start screen added to the library.`)
      } else {
        await mainAPI.patch(`/helloScreens/${helloScreen._id}`, helloScreen)
        toast.success(`Start screen ${helloScreen.name} updated.`)
      }
      getHelloScreenList()
      showFormHelloScreen(false)
    } catch (err) {
      console.log(err)
    }
  }

  const getHelloScreenList = async () => {
    const { data } = await mainAPI.get('/users/me/helloScreens')
    dispatch({
      type: 'SET_HELLO_SCREEN_LIST',
      data,
    })
  }
  return (
    tool === 3 && (
      <div
        className={styles.toolHelloScreen}
        onClick={() => {
          if (!preview.show) {
            dispatch({ type: 'SHOW_PREVIEW' })
          }
        }}
      >
        {popup.display === 'DELETE_DRAFT_HELLO_SCREEN' && (
          <PopupDeleteDraftHelloScreen
            onConfirm={() => {
              dispatch({ type: 'RESET_HELLO_SCREEN' })
              hidePopup()
            }}
          />
        )}
        {popup.display === 'DELETE_HELLO_SCREEN' && (
          <PopupDeleteHelloScreen
            onDone={() => {
              getHelloScreenList()
              toast.success('Start screen deleted.')
              hidePopup()
            }}
          />
        )}

        {displayFormHelloScreen ? (
          <div>
            <p className={styles.toolTitle}>
              {editMode ? 'Edit' : 'Create'} a Start Screen
            </p>
            <p
              onClick={() => showFormHelloScreen(false)}
              className={styles.toolBack}
            >
              &#8592; Back to my library
            </p>
            <div className={styles.toolAreaScrollable}>
              <div className={styles.toolSection}>
                <label className={styles.toolSubtitleH1}>
                  Name your Start Screen*
                </label>
                <input
                  className={styles.toolInput}
                  placeholder={'Start Screen name'}
                  style={{ width: '50%' }}
                  onChange={(e) =>
                    dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        name: e.target.value,
                      },
                    })
                  }
                  value={helloScreen.name}
                  required
                />
              </div>
              <div className={styles.spliter} />
              <div className={styles.toolSection}>
                <label className={styles.toolSubtitle}>
                  Background color
                  <div
                    onClick={() => setShowColor(!showColor)}
                    className={styles.toolShowColors}
                  >
                    Show colors
                    <img
                      src={
                        showColor
                          ? '/assets/common/expandLessPrimary.svg'
                          : '/assets/common/expandMorePrimary.svg'
                      }
                    />
                  </div>
                </label>
                {showColor && (
                  <ChromePicker
                    className={styles.colorPicker}
                    disableAlpha={true}
                    color={helloScreen.background}
                    onChange={(color) =>
                      dispatch({
                        type: 'CHANGE_HELLO_SCREEN',
                        data: {
                          background: color.hex,
                        },
                      })
                    }
                  />
                )}
              </div>
              <div className={styles.spliter} />
              <div className={styles.toolSection}>
                <label className={styles.toolSubtitle}>Content</label>
                <label className={styles.toolLabel}>Text line 1</label>
                <InputWithTools
                  placeholder={'Text line 1'}
                  dispatchType="CHANGE_HELLO_SCREEN"
                  me={me}
                  object={helloScreen}
                  objectName="helloScreen"
                  property="title"
                  toolStyle={true}
                  toolVariables={true}
                />
              </div>
              <div className={styles.toolSection}>
                <label className={styles.toolLabel}>Text line 2</label>
                <InputWithTools
                  placeholder={'Text line 2'}
                  dispatchType="CHANGE_HELLO_SCREEN"
                  me={me}
                  object={helloScreen}
                  objectName="helloScreen"
                  property="subtitle"
                  toolStyle={true}
                  toolVariables={true}
                />
              </div>
              <Button width="50%" onClick={addHelloScreenToLibrary} type="div">
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.toolSection}>
            <p className={styles.toolTitle}>Start Screen</p>
            <Button
              width={'auto'}
              onClick={() => {
                dispatch({ type: 'ADD_HELLO_SCREEN' })
                dispatch({
                  type: 'SET_PREVIEW_HELLO_SCREEN',
                  data: {},
                })
                dispatch({ type: 'CALC_DURATION' })
                showFormHelloScreen(true)
                setEditMode(false)
              }}
            >
              <div className={styles.toolAdd}>
                <img src="/assets/common/addW.svg" />
                <p>Create Start Screen</p>
              </div>
            </Button>

            <p className={styles.toolSubtitle}>Your Library</p>
            {helloScreenList.length > 0 ? (
              <div className={styles.toolLibrary}>
                {helloScreenList.map((hs) => (
                  <div key={hs._id} className={styles.toolLibraryItem}>
                    <p
                      className={`${styles.toolLibraryItemName} ${
                        previewHelloScreen._id === hs._id
                          ? styles.toolLibraryItemPreview
                          : helloScreen._id === hs._id
                          ? styles.toolLibraryItemSelected
                          : styles.toolLibraryItemNotSelected
                      }`}
                      onClick={() => {
                        dispatch({
                          type: 'DISPLAY_ELEMENT',
                          data: 'helloScreen',
                        })
                        dispatch({
                          type: 'SET_PREVIEW_HELLO_SCREEN',
                          data: hs,
                        })
                      }}
                    >
                      {hs.name}
                    </p>
                    <div
                      className={styles.toolLibraryItemEdit}
                      onClick={() => {
                        dispatch({
                          type: 'DISPLAY_ELEMENT',
                          data: 'helloScreen',
                        })
                        dispatch({
                          type: 'SET_PREVIEW_HELLO_SCREEN',
                          data: {},
                        })
                        dispatch({
                          type: 'CHANGE_HELLO_SCREEN',
                          data: hs,
                        })

                        dispatch({ type: 'CALC_DURATION' })
                      }}
                    >
                      <p>Select</p>
                    </div>
                    <div
                      className={styles.toolLibraryItemDelete}
                      onClick={() => {
                        setShowOptions({
                          data: hs,
                          display: true,
                        })
                      }}
                    >
                      <img src="/assets/common/more.svg" />
                      {showOptions.display && showOptions.data._id == hs._id && (
                        <PopupOptions setAction={setShowOptions}>
                          <span
                            className={styles.PopupOption}
                            onClick={() => {
                              setShowOptions({
                                display: false,
                              })
                              dispatch({
                                type: 'SET_PREVIEW_HELLO_SCREEN',
                                data: {},
                              })
                              dispatch({
                                type: 'CHANGE_HELLO_SCREEN',
                                data: hs,
                              })
                              showFormHelloScreen(true)
                              setEditMode(true)
                            }}
                          >
                            Edit
                          </span>
                          <span
                            className={styles.PopupOption}
                            onClick={() => {
                              setShowOptions({
                                display: false,
                              })
                              showPopup({
                                display: 'DELETE_HELLO_SCREEN',
                                data: hs,
                              })
                            }}
                          >
                            Delete
                          </span>
                        </PopupOptions>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.toolDescription}>
                Here you will find your start screens created. Start by creating
                one by clicking just above!
              </p>
            )}
          </div>
        )}
      </div>
    )
  )
}
const PopupOptions = ({ setAction, children }) => {
  const wrapperRef = useRef(null)
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setAction({ display: false })
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div ref={wrapperRef} className={styles.popupOptions}>
      {children}
    </div>
  )
}

export default ToolHelloScreen
