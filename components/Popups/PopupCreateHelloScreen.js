import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Input from '../Input'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupCreateHelloScreen.module.sass'

const PopupCreateHelloScreen = ({ onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const popup = useSelector(state => state.popup)

  const [isLoading, setIsLoading] = useState(false)
  const [helloScreenName, setHelloScreenName] = useState(null)

  const create = async (e) => {
    e.preventDefault()
    if (!isLoading) {
      try {
        setIsLoading(true)
        delete popup.data._id
        await mainAPI.post('/helloScreens', {
          ...popup.data,
          name: helloScreenName,

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
      title="New start screen template"
    >
      <form
        className={styles.form}
        onSubmit={create}
      >
        <Input
          onChange={(e) => setHelloScreenName(e.target.value)}
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


export default PopupCreateHelloScreen