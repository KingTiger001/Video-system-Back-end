import { useDispatch } from 'react-redux'

import VideoPlayer from '@/components/VideoPlayer'

import styles from '@/styles/components/Campaign/Preview.module.sass'

const Preview = ({ campaign, onClose }) => {
  const dispatch = useDispatch()

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
        <VideoPlayer fromPreview={true} data={campaign} />
      </div>
    </div>
  )
}


export default Preview