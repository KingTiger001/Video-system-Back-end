import { useDispatch, useSelector } from 'react-redux'

import { useDebounce } from '@/hooks'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const ToolVideos = ({ saveCampaign }) => {
  const dispatch = useDispatch()
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const tool = useSelector(state => state.campaign.tool)
  
  const preview = useSelector(state => state.campaign.preview)
  const previewVideo = useSelector(state => state.campaign.previewVideo)
  const video = useSelector(state => state.campaign.video)
  const videoList = useSelector(state => state.campaign.videoList)

  const displayDuration = (value) => {
    if (!value) {
      return '00:00'
    }
    const t = dayjs.duration(parseInt(value, 10))
    const m = t.minutes()
    const s = t.seconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }

  const updateProcessingVideos = async () => {
    const processingVideos = videoList.filter(video => video.status === 'processing' || video.status === 'waiting')
    if (processingVideos.length > 0) {
      const newVideosPromise = await Promise.all(processingVideos.map(video => mainAPI(`/videos/${video._id}`)))
      const newVideos = newVideosPromise.flat().map(video => video.data)
      dispatch({
        type: 'SET_VIDEO_LIST',
        data: videoList.map(video => {
          const videoProcessingFound = newVideos.find(newVideo => newVideo._id === video._id)
          return videoProcessingFound || video
        }),
      })
    }
  }

  useDebounce(updateProcessingVideos, 3000, [videoList])

  return tool === 2 && (
    <div
      className={styles.toolVideos}
      onClick={() => {
        if (!preview.show) {
          dispatch({ type: 'SHOW_PREVIEW' })
        }
      }}
    >
      <p className={styles.toolTitle}>Videos</p>
      <div className={styles.videosList}>
        {
          videoList.map(vd => 
            <div
              key={vd._id}
              className={`${styles.toolLibraryItem} ${styles.videosItem} ${vd._id === video._id ? styles.selected : ''}`}
            >
              <div
                className={`${styles.toolLibraryItemName} ${previewVideo.name === vd.name ? styles.toolLibraryItemPreview : ''}`}
                onClick={() => dispatch({ type: 'SET_PREVIEW_VIDEO', data: vd })}
              >
                <p>{vd.name}</p>
                { vd.status === 'done'
                  ?
                  <p className={`${styles.videosItemStatus}`}>{displayDuration(vd.metadata.duration * 1000)}</p>
                  :
                  <p className={`${styles.videosItemStatus} ${styles[vd.status]}`}>{vd.status}... {vd.status === 'processing' && vd.statusProgress > 0 ? `${vd.statusProgress || 0}%` : ''}</p>
                }
              </div>

              <div className={styles.toolLibraryItemEdit}>
                {
                  vd._id !== video._id &&
                  <div
                    onClick={() => {
                      dispatch({ type: 'SET_VIDEO', data: vd })
                      dispatch({ type: 'SET_PROGRESSION', data: 0 })
                      saveCampaign({ video: vd })
                    }}
                  >
                    <img src="/assets/campaign/librarySelect.svg"/>
                    <p>Select</p>
                  </div>
                }
              </div>
              <div
                className={styles.toolLibraryItemDelete}
                onClick={() => showPopup({ display: 'DELETE_VIDEO', data: vd })}
              >
                <img src="/assets/campaign/libraryDelete.svg" />
                <p>Delete</p>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ToolVideos