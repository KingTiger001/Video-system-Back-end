import { useState } from 'react'
import { ChromePicker } from 'react-color'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import InputNumber from '@/components/InputNumber'
import InputWithTools from '@/components/Campaign/InputWithTools'
import PopupDeleteHelloScreen from '@/components/Popups/PopupDeleteHelloScreen'
import PopupDeleteDraftHelloScreen from '@/components/Popups/PopupDeleteDraftHelloScreen'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const ToolHelloScreen = ({ me }) => {
  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const tool = useSelector(state => state.campaign.tool)
  
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const helloScreenList = useSelector(state => state.campaign.helloScreenList)
  const preview = useSelector(state => state.campaign.preview)
  const previewHelloScreen = useSelector(state => state.campaign.previewHelloScreen)

  const [displayFormHelloScreen, showFormHelloScreen] = useState(false)
  const [editMode, setEditMode] = useState(false)

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

  return tool === 3 && (
    <div
      className={styles.toolHelloScreen}
      onClick={() => {
        if (!preview.show) {
          dispatch({ type: 'SHOW_PREVIEW' })
        }
      }}
    >
      { popup.display === 'DELETE_DRAFT_HELLO_SCREEN' && 
        <PopupDeleteDraftHelloScreen
          onConfirm={() => {
            dispatch({ type: 'RESET_HELLO_SCREEN' })
            hidePopup()
          }}
        />
      }
      { popup.display === 'DELETE_HELLO_SCREEN' && 
        <PopupDeleteHelloScreen
          onDone={() => {
            getHelloScreenList()
            toast.success('Start screen deleted.')
            hidePopup()
          }}
        />
      }

      { displayFormHelloScreen
          ?
          <div>
            <p
              onClick={() => showFormHelloScreen(false)}
              className={styles.toolBack}
            >
              &lt; Back to my library
            </p>
            <p className={styles.toolTitle}>{editMode ? 'Edit' : 'Create'} a Start Screen</p>
            <p className={styles.toolSubtitle}>Your start screen</p>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Start Screen name *</label>
              <input
                className={styles.toolInput}
                onChange={(e) => dispatch({
                  type: 'CHANGE_HELLO_SCREEN',
                  data: {
                    name: e.target.value
                  },
                })}
                value={helloScreen.name}
                required
              />
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Background color</label>
              <ChromePicker
                className={styles.colorPicker}
                disableAlpha={true}
                color={helloScreen.background}
                onChange={(color) => dispatch({
                  type: 'CHANGE_HELLO_SCREEN',
                  data: {
                    background: color.hex,
                  },
                })}
              />
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Text line 1</label>
              <InputWithTools
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
                dispatchType="CHANGE_HELLO_SCREEN"
                me={me}
                object={helloScreen}
                objectName="helloScreen"
                property="subtitle"
                toolStyle={true}
                toolVariables={true}
              />
            </div>
             <Button
              onClick={addHelloScreenToLibrary}
              outline={true}
              type="div"
            >
              Save
            </Button>
          </div>
          :
          <div className={styles.toolSection}>
            <p className={styles.toolTitle}>Start Screen</p>
            <div
              className={styles.toolAdd}
              onClick={() => {
                dispatch({ type: 'ADD_HELLO_SCREEN' })
                dispatch({
                  type: 'SET_PREVIEW_HELLO_SCREEN',
                  data: {},
                })
                dispatch({ type: 'CALC_DURATION' })
                showFormHelloScreen(true)
                setEditMode(false)
              }}>
              <img src="/assets/campaign/add.svg" />
              <p>Create Start Screen</p>
            </div>
            <div>
              <p className={styles.toolSubtitle}>Currently Selected</p>
              { Object.keys(helloScreen).length > 1
                ?
                <div className={styles.toolDraftItem}>
                  <p
                    className={`${styles.toolDraftItemName} ${!previewHelloScreen.name ? styles.toolLibraryItemPreview : ''}`}
                    onClick={() => {
                      dispatch({
                        type: 'SET_PREVIEW_HELLO_SCREEN',
                        data: {},
                      })
                    }}
                  >
                    {helloScreen.name}
                  </p>
                  <div
                    className={styles.toolLibraryItemEdit}
                    onClick={() => {
                      dispatch({
                        type: 'SET_PREVIEW_HELLO_SCREEN',
                        data: {},
                      })
                      showFormHelloScreen(true)
                      setEditMode(true)
                    }}>
                    <img src="/assets/campaign/libraryEdit.svg" />
                    <p>Edit</p>
                  </div>
                  <div
                    className={styles.toolLibraryItemDelete}
                    onClick={() => showPopup({ display: 'DELETE_DRAFT_HELLO_SCREEN' })}
                  >
                    <img src="/assets/campaign/libraryDelete.svg" />
                    <p>Delete</p>
                  </div>
                </div>
                :
                <p className={styles.toolDescription}>Here you will find your start screen created. Start by creating one by clicking just above!</p>
              }
            </div>
            <p className={styles.toolSubtitle}>Your Library</p>
            {
              helloScreenList.length > 0
                ?
                <div className={styles.toolLibrary}>
                  {
                    helloScreenList.map((hs) => (
                      <div
                        key={hs._id}
                        className={styles.toolLibraryItem}
                      >
                        <p
                          className={`${styles.toolLibraryItemName} ${previewHelloScreen.name === hs.name ? styles.toolLibraryItemPreview : ''}`}
                          onClick={() => {
                            dispatch({ type: 'DISPLAY_ELEMENT', data: 'helloScreen' })
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
                            dispatch({ type: 'DISPLAY_ELEMENT', data: 'helloScreen' })
                            dispatch({
                              type: 'CHANGE_HELLO_SCREEN',
                              data: hs,
                            })
                            dispatch({
                              type: 'SET_PREVIEW_HELLO_SCREEN',
                              data: {},
                            })
                            dispatch({ type: 'CALC_DURATION' })
                          }}
                        >
                          <img src="/assets/campaign/librarySelect.svg" />
                          <p>Select</p>
                        </div>
                        <div
                          className={styles.toolLibraryItemDelete}
                          onClick={() => showPopup({
                            display: 'DELETE_HELLO_SCREEN',
                            data: hs,
                          })}
                        >
                          <img src="/assets/campaign/libraryDelete.svg" />
                          <p>Delete</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
                :
                <p className={styles.toolDescription}>Here you will find your start screens created. Start by creating one by clicking just above!</p>
            }
          </div>
      }
    </div>
  )
}

export default ToolHelloScreen