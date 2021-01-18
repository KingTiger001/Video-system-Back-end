import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Input from '../Input'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupDuplicateCampaign.module.sass'

const PopupDuplicateCampaign = ({ onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const popup = useSelector(state => state.popup)

  const duplicateCampaign = async (e) => {
    e.preventDefault()
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.post(`/campaigns/${popup.data._id}/duplicate`, { name })
        onDone()
      } catch (err) {
        setLoading(false)
      }
    }
  }

  return (
    <Popup
      title="Duplicate a video campaign"
    >
      <form
        className={styles.form}
        onSubmit={duplicateCampaign}
      >
        <Input
          onChange={(e) => setName(e.target.value)}
          placeholder="Video campaign name*"
          type="text"
          required
        />
        <Button>Duplicate</Button>
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

export default PopupDuplicateCampaign