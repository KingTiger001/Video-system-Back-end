import { useDispatch, useSelector } from 'react-redux'

import VideoPlayer from '@/components/VideoPlayer'

import styles from '@/styles/components/Campaign/Preview.module.sass'

const Preview = ({ onClose }) => {
  const dispatch = useDispatch()

  const campaign = useSelector(state => state.campaign)

  const closePreview = () => {
    dispatch({ type: 'videoPlayer/PAUSE' })
    dispatch({
      type: 'videoPlayer/SET_PROGRESSION',
      data: 0,
    })
    onClose()
  }

  return (
    <div className={styles.preview}>
      <div
        className={styles.background}
        onClick={closePreview}
      />
      <div className={styles.player}>
        <div
          className={styles.close}
          onClick={closePreview}
        >
          <img src="/assets/common/closeW.svg" />
        </div>
        <VideoPlayer data={campaign} />
      </div>
    </div>
  )
}


export default Preview