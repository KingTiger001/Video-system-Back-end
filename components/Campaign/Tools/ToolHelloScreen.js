import { useState } from 'react'
import { ChromePicker } from 'react-color'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import InputNumber from '@/components/InputNumber'
import InputStyle from '@/components/Campaign/InputStyle'
import PopupDeleteHelloScreen from '@/components/Popups/PopupDeleteHelloScreen'
import PopupDeleteDraftHelloScreen from '@/components/Popups/PopupDeleteDraftHelloScreen'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const ToolHelloScreen = ({ saveCampaign }) => {
  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const tool = useSelector(state => state.campaign.tool)
  
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const helloScreenList = useSelector(state => state.campaign.helloScreenList)
  const preview = useSelector(state => state.campaign.preview)

  const [displayFormHelloScreen, showFormHelloScreen] = useState(false)
  const [error, setError] = useState('')

  const addHelloScreenToLibrary = async () => {
    try {
      const data = { ...helloScreen }
      delete data._id
      await mainAPI.post('/helloScreens', data)
      toast.success('Start screen added to the library.')
      getHelloScreenList()
    } catch (err) {
      console.log(err)
    }
  }

  const checkFormErrors = () => {
    if (!helloScreen.duration) {
      throw new Error('A duration must be set.')
    }
  }

  const getHelloScreenList = async () => {
    const { data } = await mainAPI.get('/users/me/helloScreens')
    dispatch({
      type: 'SET_HELLO_SCREEN_LIST',
      data,
    })
  }

  const saveHelloScreen = async () => {
    try {
      await checkFormErrors()
      await saveCampaign()
      toast.success('Start screen saved.')
    } catch (err) {
      setError(err.message)
    }
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
            <p className={styles.toolTitle}>Edit a Start Screen</p>
            <p className={styles.toolSubtitle}>Your start screen</p>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Template Name *</label>
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
              <label className={styles.toolLabel}>Duration (in seconds)</label>
              <InputNumber
                className={styles.toolInput}
                initialValue={helloScreen.duration / 1000}
                onChange={(value) => {
                  dispatch({
                    type: 'CHANGE_HELLO_SCREEN',
                    data: {
                      duration: parseFloat(value * 1000, 10)
                    },
                  })
                  dispatch({ type: 'CALC_DURATION' })
                }}
                max={10}
              />
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Background Color</label>
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
              <label className={styles.toolLabel}>Title</label>
              <InputStyle
                dispatchType="CHANGE_HELLO_SCREEN"
                object={helloScreen}
                property="title"
              />
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Text</label>
              <InputStyle
                dispatchType="CHANGE_HELLO_SCREEN"
                object={helloScreen}
                property="subtitle"
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <Button onClick={saveHelloScreen}>Save changes</Button>
            <Button
              onClick={addHelloScreenToLibrary}
              outline={true}
              type="div"
            >
              Add to my library
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
              }}
            >
              <img src="/assets/campaign/add.svg" />
              <p>Create a Start Screen</p>
            </div>
            {
              Object.keys(helloScreen).length > 1 &&
              <div>
                <p className={styles.toolSubtitle}>Currently Selected</p>
                <div className={styles.toolDraftItem}>
                  <p
                    className={styles.toolDraftItemName}
                    // onClick={() => {
                    //   dispatch({
                    //     type: 'SET_PREVIEW_HELLO_SCREEN',
                    //     data: {},
                    //   })
                    // }}
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
                    }}
                  >
                    <img src="/assets/campaign/edit.svg" />
                    <p>Edit</p>
                  </div>
                  <div
                    className={styles.toolLibraryItemDelete}
                    onClick={() => showPopup({ display: 'DELETE_DRAFT_HELLO_SCREEN' })}
                  >
                    <img src="/assets/campaign/delete.svg" />
                    <p>Delete</p>
                  </div>
                </div>
              </div>
            }
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
                          className={styles.toolLibraryItemName}
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
                        <div className={styles.toolLibraryItemEdit}>
                          <img
                            src="/assets/campaign/select.svg"
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
                              showFormHelloScreen(true)
                            }}
                          />
                          <p>Select</p>
                        </div>
                        <div className={styles.toolLibraryItemDelete}>
                          <img
                            src="/assets/campaign/delete.svg"
                            onClick={() => showPopup({
                              display: 'DELETE_HELLO_SCREEN',
                              data: hs,
                            })}
                          />
                          <p>Delete</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
                :
                <p className={styles.toolLibraryEmptyText}>Here you will find your first screens created. Start by creating one by clicking just above!</p>
            }
          </div>
      }
    </div>
  )
}

export default ToolHelloScreen