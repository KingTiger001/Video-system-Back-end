import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Input from '../Input'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupCreateHelloScreen.module.sass'

const PopupCreateHelloScreen = ({ helloScreen, onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [isLoading, setIsLoading] = useState(false)
  const [helloScreenName, setHelloScreenName] = useState(null)

  const create = async (e) => {
    e.preventDefault()
    if (!isLoading) {
      try {
        setIsLoading(true)
        await mainAPI.post('/helloScreens', {
          ...helloScreen,
          name: helloScreenName,
        })
        onDone()
        hidePopup()
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Popup
      title="Create a hello screen template"
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
          onClick={() => hidePopup}
          className={styles.cancel}
        >
          Cancel
        </p>
      </form>
    </Popup>
  )
}


export default PopupCreateHelloScreen