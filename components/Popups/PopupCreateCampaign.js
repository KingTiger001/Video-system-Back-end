import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Input from '../Input'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupCreateCampaign.module.sass'

const PopupCreateCampaign = () => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const popup = useSelector(state => state.popup)

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(null)

  const create = async (e) => {
    e.preventDefault()
    if (!isLoading) {
      try {
        setIsLoading(true)
        const { data: campaign } = await mainAPI.post('/campaigns', { name })
        router.push(`/app/campaigns/${campaign._id}`)
        hidePopup()
      } catch (err) {
        setIsLoading(false)
        console.log(err)
      }
    }
  }

  return (
    <Popup
      title="Create a video campaign"
    >
      <form
        className={styles.form}
        onSubmit={create}
      >
        <Input
          onChange={(e) => setName(e.target.value)}
          placeholder="Name*"
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


export default PopupCreateCampaign