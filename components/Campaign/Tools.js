import { useDispatch, useSelector } from 'react-redux'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const Tools = () => {
  const dispatch = useDispatch()
  const isPlaying = useSelector(state => state.campaign.isPlaying)
  const tool = useSelector(state => state.campaign.tool)
  
  const selectTool = (clickedTool, element) => {
    dispatch({ type: 'SELECT_TOOL', data: tool === clickedTool ? 0 : clickedTool })
    isPlaying ? dispatch({ type: 'PAUSE' }) : ''
    tool === clickedTool ? dispatch({ type: 'HIDE_PREVIEW' }) : dispatch({ type: 'SHOW_PREVIEW', data: { element } })
  }

  return (
    <ul className={styles.tools}>
      <li
        className={`${styles.tool} ${tool === 1 ? styles.toolSelected : ''}`}
        onClick={() => selectTool(1)}
      >
        <img src="/assets/campaign/record.svg" />
        <p>Record</p>
      </li>
      <li
        className={`${styles.tool} ${tool === 2 ? styles.toolSelected : ''}`}
        onClick={() => {
          dispatch({ type: 'SET_PREVIEW_VIDEO', data: '' })
          selectTool(2, 'video')
        }}
      >
        <img src="/assets/campaign/toolVideos.svg" />
        <p>Videos</p>
      </li>
      <li
        className={`${styles.tool} ${tool === 3 ? styles.toolSelected : ''}`}
        onClick={() => selectTool(3, 'helloScreen')}
      >
        <img src="/assets/campaign/toolElement.svg" />
        <p>Hello Screen</p>
      </li>
      <li
        className={`${styles.tool} ${tool === 4 ? styles.toolSelected : ''}`}
        onClick={() => selectTool(4, 'endScreen')}
      >
        <img src="/assets/campaign/toolElement.svg" />
        <p>End Screen</p>
      </li>
      <li
        className={`${styles.tool} ${tool === 5 ? styles.toolSelected : ''}`}
        onClick={() => selectTool(5, 'logo')}
      >
        <img src="/assets/campaign/toolLogo.svg" />
        <p>Logo</p>
      </li>
    </ul>
  )
}

export default Tools