import { useState } from 'react'
import { ChromePicker } from 'react-color'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import InputNumber from '@/components/InputNumber'
import InputStyle from '@/components/Campaign/InputStyle'
import PopupDeleteEndScreen from '@/components/Popups/PopupDeleteEndScreen'
import PopupDeleteDraftEndScreen from '@/components/Popups/PopupDeleteDraftEndScreen'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const ToolEndScreen = ({ saveCampaign }) => {
  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const tool = useSelector(state => state.campaign.tool)
  
  const endScreen = useSelector(state => state.campaign.endScreen)
  const endScreenList = useSelector(state => state.campaign.endScreenList)
  const preview = useSelector(state => state.campaign.preview)
  const previewEndScreen = useSelector(state => state.campaign.previewEndScreen)

  const [displayFormEndScreen, showFormEndScreen] = useState(false)
  const [error, setError] = useState('')

  const addEndScreenToLibrary = async () => {
    try {
      const data = { ...endScreen }
      delete data._id
      await mainAPI.post('/endScreens', data)
      toast.success('End screen added to the library.')
      getEndScreenList()
    } catch (err) {
      console.log(err)
    }
  }

  const checkFormErrors = () => {
    if (!endScreen.duration) {
      throw new Error('A duration must be set.')
    }
  }

  const getEndScreenList = async () => {
    const { data } = await mainAPI.get('/users/me/endScreens')
    console.log(data)
    dispatch({
      type: 'SET_END_SCREEN_LIST',
      data,
    })
  }

  const saveEndScreen = async () => {
    try {
      await checkFormErrors()
      await saveCampaign()
      toast.success('End screen saved.')
    } catch (err) {
      setError(err.message)
    }
  }

  const addNetwork = () => {
    dispatch({
      type: 'CHANGE_END_SCREEN',
      data: {
        networks: endScreen.networks
          ? [
              ...endScreen.networks,
              {
                id: endScreen.networks.length + 1 ,
                link: '',
              }
            ]
          : [{
              id: 1,
              link: '',
              site: ''
            }],
      },
    })
  }

  const deleteNetwork = (id) => {
    const newArray = endScreen.networks.filter(network => network.id !== id)
    dispatch({
      type: 'CHANGE_END_SCREEN',
      data: {
        networks: newArray
      },
    })
  }

  const updateNetwork = ({ index, property, value }) => {
    const newArray = [...endScreen.networks]
    newArray[index][property] = value
    dispatch({
      type: 'CHANGE_END_SCREEN',
      data: {
        networks: newArray
      },
    })
  }

  return tool === 4 && (
    <div
      className={styles.toolEndScreen}
      onClick={() => {
        if (!preview.show) {
          dispatch({ type: 'SHOW_PREVIEW' })
        }
      }}
    >
      { popup.display === 'DELETE_DRAFT_END_SCREEN' && 
        <PopupDeleteDraftEndScreen
          onConfirm={() => {
            dispatch({ type: 'RESET_END_SCREEN' })
            hidePopup()
          }}
        />
      }
      { popup.display === 'DELETE_END_SCREEN' && 
        <PopupDeleteEndScreen
          onDone={() => {
            getEndScreenList()
            toast.success('End screen deleted.')
            hidePopup()
          }}
        />
      }
      { displayFormEndScreen
          ?
          <div>
            <p
              onClick={() => showFormEndScreen(false)}
              className={styles.toolBack}
            >
              &lt; Back to my library
            </p>
            <p className={styles.toolTitle}>Edit an End Screen</p>
            <p className={styles.toolSubtitle}>Your End screen</p>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Template Name *</label>
              <input
                className={styles.toolInput}
                onChange={(e) => dispatch({
                  type: 'CHANGE_END_SCREEN',
                  data: {
                    name: e.target.value
                  },
                })}
                value={endScreen.name}
                required
              />
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Duration (in seconds)</label>
              <InputNumber
                className={styles.toolInput}
                initialValue={endScreen.duration / 1000}
                onChange={(value) => {
                  dispatch({
                    type: 'CHANGE_END_SCREEN',
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
              <label className={styles.toolLabel}>Background</label>
              <ChromePicker
                className={styles.colorPicker}
                disableAlpha={true}
                color={endScreen.background}
                onChange={(color) => dispatch({
                  type: 'CHANGE_END_SCREEN',
                  data: {
                    background: color.hex,
                  },
                })}
              />
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Title</label>
              <InputStyle
                dispatchType="CHANGE_END_SCREEN"
                object={endScreen}
                property="title"
              />
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Text</label>
              <InputStyle
                dispatchType="CHANGE_END_SCREEN"
                object={endScreen}
                property="subtitle"
              />
            </div>

            <p className={styles.toolSubtitle}>Add link & more info</p>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Link Button</label>
              <div className={styles.toolInputGrid}>
                <input
                  className={styles.toolInput}
                  onChange={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      button: {
                        ...endScreen.button,
                        value: e.target.value,
                      }
                    },
                  })}
                  placeholder="Text"
                  value={endScreen.button ? endScreen.button.value : ''}
                />
                <input
                  className={styles.toolInput}
                  onChange={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      button: {
                        ...endScreen.button,
                        href: e.target.value,
                      }
                    },
                  })}
                  placeholder="Copy link"
                  value={endScreen.button ? endScreen.button.href : ''}
                />
              </div>
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Email</label>
              <InputStyle
                dispatchType="CHANGE_END_SCREEN"
                object={endScreen}
                property="email"
              />
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Phone</label>
              <InputStyle
                dispatchType="CHANGE_END_SCREEN"
                object={endScreen}
                property="phone"
              />
            </div>
            {/* //TODO: FINISH THIS */}
            {/* <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Networks</label>
              <div className={styles.networks}>
                {
                  endScreen.networks && endScreen.networks.map((network, index) => (
                    <div
                      className={styles.network}
                      key={network.id}
                    >
                      <select
                        className={styles.networkSelect}
                        onChange={(e) => updateNetwork({ index, property: 'site', value: e.target.value })}
                        required
                        value={network.site}
                      >
                        <option value="facebook">FB</option>
                        <option value="twitter">TW</option>
                        <option value="pinterest">PIB</option>
                        <option value="linkedin">LKD</option>
                      </select>
                      <input
                        className={styles.toolInput}
                        onChange={(e) => updateNetwork({ index, property: 'link', value: e.target.value })}
                        placeholder="Copy profile link"
                        type="text"
                        value={network.link}
                      />
                      <img
                        className={styles.networkDelete}
                        onClick={() => deleteNetwork(network.id)}
                        src="/assets/common/close.svg"
                      />
                    </div>
                  ))
                }
                <p
                  className={styles.networkAdd}
                  onClick={addNetwork}
                >
                  Add more
                </p>
              </div>
            </div> */}
            {error && <p className={styles.error}>{error}</p>}
            <Button onClick={saveEndScreen}>Save changes</Button>
            <Button
              onClick={addEndScreenToLibrary}
              outline={true}
              type="div"
            >
              Add to my library
            </Button>
          </div>
          :
          <div className={styles.toolSection}>
            <p className={styles.toolTitle}>End Screen</p>
            <div
              className={styles.toolAdd}
              onClick={() => {
                dispatch({ type: 'ADD_END_SCREEN' })
                dispatch({
                  type: 'SET_PREVIEW_END_SCREEN',
                  data: {},
                })
                dispatch({ type: 'CALC_DURATION' })
                showFormEndScreen(true)
              }}
            >
              <img src="/assets/campaign/add.svg" />
              <p>Create an End Screen</p>
            </div>
            {
              Object.keys(endScreen).length > 1 &&
              <div>
                <p className={styles.toolSubtitle}>Currently Selected</p>
                <div className={styles.toolDraftItem}>
                  <p
                    className={`${styles.toolDraftItemName} ${!previewEndScreen.name ? styles.toolLibraryItemPreview : ''}`}
                    onClick={() => {
                      dispatch({
                        type: 'SET_PREVIEW_END_SCREEN',
                        data: {},
                      })
                    }}
                  >
                    {endScreen.name}
                  </p>
                  <div
                    className={styles.toolLibraryItemEdit}
                    onClick={() => {
                      dispatch({
                        type: 'SET_PREVIEW_END_SCREEN',
                        data: {},
                      })
                      showFormEndScreen(true)
                    }}
                  >
                    <img src="/assets/campaign/libraryEdit.svg" />
                    <p>Edit</p>
                  </div>
                  <div
                    className={styles.toolLibraryItemDelete}
                    onClick={() => showPopup({ display: 'DELETE_DRAFT_END_SCREEN' })}
                  >
                    <img src="/assets/campaign/libraryDelete.svg" />
                    <p>Delete</p>
                  </div>
                </div>
              </div>
            }
            <p className={styles.toolSubtitle}>Your Library</p>
            {
              endScreenList.length > 0
                ?
                <div className={styles.toolLibrary}>
                  {
                    endScreenList.map((es) => (
                      <div
                        key={es._id}
                        className={styles.toolLibraryItem}
                      >
                        <p
                          className={`${styles.toolLibraryItemName} ${previewEndScreen.name === es.name ? styles.toolLibraryItemPreview : ''}`}
                          onClick={() => {
                            dispatch({ type: 'DISPLAY_ELEMENT', data: 'endScreen' })
                            dispatch({
                              type: 'SET_PREVIEW_END_SCREEN',
                              data: es,
                            })
                          }}
                        >
                          {es.name}
                        </p>
                        <div className={styles.toolLibraryItemEdit}>
                          <img
                            src="/assets/campaign/librarySelect.svg"
                            onClick={() => {
                              dispatch({ type: 'DISPLAY_ELEMENT', data: 'endScreen' })
                              dispatch({
                                type: 'CHANGE_END_SCREEN',
                                data: es,
                              })
                              dispatch({
                                type: 'SET_PREVIEW_END_SCREEN',
                                data: {},
                              })
                              showFormEndScreen(true)
                              saveCampaign({ endScreen: es })
                            }}
                          />
                          <p>Select</p>
                        </div>
                        <div className={styles.toolLibraryItemDelete}>
                          <img
                            src="/assets/campaign/libraryDelete.svg"
                            onClick={() => showPopup({
                              display: 'DELETE_END_SCREEN',
                              data: es,
                            })}
                          />
                          <p>Delete</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
                :
                <p className={styles.toolLibraryEmptyText}>Here you will find your end screens created. Start by creating one by clicking just above!</p>
            }
          </div>
      }
    </div>
  )
}

export default ToolEndScreen