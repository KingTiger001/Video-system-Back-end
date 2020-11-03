import { useDispatch, useSelector } from 'react-redux'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const Tools = () => {
  const dispatch = useDispatch()
  const tool = useSelector(state => state.campaign.tool)
  
  const selectTool = (clickedTool) => dispatch({ type: 'SELECT_TOOL', data: tool === clickedTool ? 0 : clickedTool })

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
          selectTool(2)
          dispatch({ type: 'DISPLAY_ELEMENT', data: 'video' })
        }}
      >
        <img src="/assets/campaign/toolVideos.svg" />
        <p>Videos</p>
      </li>
      <li
        className={`${styles.tool} ${tool === 3 ? styles.toolSelected : ''}`}
        onClick={() => {
          selectTool(3)
          dispatch({ type: 'DISPLAY_ELEMENT', data: 'helloScreen' })
        }}
      >
        <img src="/assets/campaign/toolElement.svg" />
        <p>Hello Screen</p>
      </li>
      <li
        className={`${styles.tool} ${tool === 4 ? styles.toolSelected : ''}`}
        onClick={() => {
          selectTool(4)
          dispatch({ type: 'DISPLAY_ELEMENT', data: 'endScreen' })
        }}
      >
        <img src="/assets/campaign/toolElement.svg" />
        <p>End Screen</p>
      </li>
      <li
        className={`${styles.tool} ${tool === 5 ? styles.toolSelected : ''}`}
        onClick={() => selectTool(5)}
      >
        <img src="/assets/campaign/toolLogo.svg" />
        <p>Logo</p>
      </li>
    </ul>
  )
}

export default Tools