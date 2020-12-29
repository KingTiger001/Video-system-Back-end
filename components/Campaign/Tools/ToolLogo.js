import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { mainAPI, mediaAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import InputNumber from '@/components/InputNumber'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const ToolLogo = ({ saveCampaign }) => {
  const dispatch = useDispatch()

  const tool = useSelector(state => state.campaign.tool)

  const logo = useSelector(state => state.campaign.logo)
  const preview = useSelector(state => state.campaign.preview)

  const [error, setError] = useState('')
  const [uploadloading, setUploadloading] = useState(false)
  
  const saveLogo = async () => {
    await saveCampaign()
    toast.success('Logo saved.')
  }

  const uploadLogo = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'logos')
    formData.append('height', 300)
    formData.append('width', 300)
    try {
      setUploadloading(true)
      const { data: url } = await mediaAPI.post('/images', formData)
      dispatch({
        type: 'CHANGE_LOGO',
        data: {
          value: url
        }
      })
      await mainAPI.patch('/users/me', {
        data: {
          logo: url,
        },
      })
    } catch (err) {
      const code = err.response && err.response.data
      if (code === 'Upload.incorrectFiletype') {
        setError('Only .jpg and .png images are accepted.')
      } else {
        setError('Upload failed.')
      }
    } finally {
      setUploadloading(false)
      setTimeout(() => setError(''), 5000)
    }
  }

  return tool === 5 && (
    <div
      className={styles.toolLogo}
      onClick={() => {
        if (!preview.show) {
          dispatch({ type: 'SHOW_PREVIEW' })
        }
      }}
    >
      <p className={styles.toolTitle}>Logo</p>
      <div className={styles.toolSection}>
        <label className={styles.toolLabel}>Image</label>
        <label
          className={styles.logo}
          htmlFor="logo"
        >
          { uploadloading &&
            <div className={styles.loading}>
              <img src="/assets/common/loader.svg" />
            </div>
          }
          { logo.value &&  <img className={styles.image} src={logo.value} /> }
        </label>
        <input
          accept="image/*"
          id="logo"
          type="file"
          onChange={(e) => uploadLogo(e.target.files[0])}
          className={styles.logoInput}
        />
        { error && <p className={styles.error}>{error}</p> }
      </div>
      <div className={styles.toolSection}>
        <label className={styles.toolLabel}>Size</label>
        <InputNumber
          initialValue={logo.size}
          className={styles.toolInput}
          onChange={(value) => dispatch({
            type: 'CHANGE_LOGO',
            data: {
              size: parseInt(value, 10),
            },
          })}
        />
      </div>
      <div className={styles.toolSection}>
        <label className={styles.toolLabel}>Placement</label>
        <div className={styles.placement}>
          <div
            className={`${logo.placement === 'top-left' ? styles.selected : ''}`}
            onClick={() => dispatch({
              type: 'CHANGE_LOGO',
              data: {
                placement: 'top-left'
              }
            })}
          />
          <div 
            className={`${logo.placement === 'top-right' ? styles.selected : ''}`}
            onClick={() => dispatch({
              type: 'CHANGE_LOGO',
              data: {
                placement: 'top-right'
              }
            })}
          />
          <div 
            className={`${logo.placement === 'bottom-left' ? styles.selected : ''}`}
            onClick={() => dispatch({
              type: 'CHANGE_LOGO',
              data: {
                placement: 'bottom-left'
              }
            })}
          />
          <div 
            className={`${logo.placement === 'bottom-right' ? styles.selected : ''}`}
            onClick={() => dispatch({
              type: 'CHANGE_LOGO',
              data: {
                placement: 'bottom-right'
              }
            })}
          />
        </div>
      </div>
      <Button onClick={saveLogo}>Save changes</Button>
    </div>
  )
}

export default ToolLogo