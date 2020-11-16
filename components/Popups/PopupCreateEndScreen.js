import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Input from '../Input'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupCreateEndScreen.module.sass'

const PopupCreateEndScreen = ({ onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const popup = useSelector(state => state.popup)

  const [isLoading, setIsLoading] = useState(false)
  const [endScreenName, setEndScreenName] = useState(null)

  const create = async (e) => {
    e.preventDefault()
    if (!isLoading) {
      try {
        setIsLoading(true)
        delete popup.data._id
        await mainAPI.post('/endScreens', {
          ...popup.data,
          name: endScreenName,

        })
        onDone()
      } catch (err) {
        setIsLoading(false)
        console.log(err)
      }
    }
  }

  return (
    <Popup
      title="New end screen template"
    >
      <form
        className={styles.form}
        onSubmit={create}
      >
        <Input
          onChange={(e) => setEndScreenName(e.target.value)}
          placeholder="Template name*"
          type="text"
          required
        />
        <Button>Create</Button>
        <p
          onClick={hidePopup}
          className={styles.cancel}
        >
          Cancel
        </p>
      </form>
    </Popup>
  )
}


export default PopupCreateEndScreen