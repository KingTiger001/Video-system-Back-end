import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'

import { useVideoResize } from '@/hooks'

import dayjs from '@/plugins/dayjs'

import EndScreen from '@/components/Campaign/EndScreen'
import HelloScreen from '@/components/Campaign/HelloScreen'
import Logo from '@/components/Campaign/Logo'

import styles from '@/styles/components/Campaign/Player.module.sass'

const Player = () => {
  const dispatch = useDispatch()

  const endScreen = useSelector(state => state.campaign.endScreen)
  const duration = useSelector(state => state.campaign.duration)
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const isPlaying = useSelector(state => state.campaign.isPlaying)
  const preview = useSelector(state => state.campaign.preview)
  const previewVideo = useSelector(state => state.campaign.previewVideo)
  const progression = useSelector(state => state.campaign.progression)
  const video = useSelector(state => state.campaign.video)
  const videoSeeking = useSelector(state => state.campaign.videoSeeking)
  const videoRef = useSelector(state => state.campaign.videoRef)
  
  const playerRef = useRef()
  const { width: playerWidth } = useVideoResize({ ref: playerRef, autoWidth: true })

  const videoRefCb = useCallback(node => {
    const handleSeeking = () => dispatch({ type: 'SET_VIDEO_SEEKING', data: true })
    const handlePlaying = () => dispatch({ type: 'SET_VIDEO_SEEKING', data: false })
    
    if (node !== null) {
      dispatch({ type: 'SET_VIDEO_REF', data: node })

      if (Object.keys(videoRef).length > 0) {
        videoRef.addEventListener('playing', handlePlaying)
        videoRef.addEventListener('seeking', handleSeeking)
        const currentTime = (progression - helloScreen.duration) / 1000
        videoRef.currentTime = currentTime > 0 ? currentTime : 0 
      }
    } else {
      if (Object.keys(videoRef).length > 0) {
        videoRef.removeEventListener('seeking', handleSeeking)
        videoRef.removeEventListener('playing', handlePlaying)
      }
    }
  }, [video, videoRef]);

  useEffect(() => {
    let interval = null;
    if (
      ((progression > helloScreen.duration) && (progression < (duration - endScreen.duration)) && videoSeeking)
      || (!isPlaying && progression !== 0)
    ) {
      clearInterval(interval);
    } else if (isPlaying) {
      interval = setInterval(() => {
        dispatch({
          type: 'SET_PROGRESSION',
          data: progression + 50,
        });
      }, 50);
    }
    if (progression >= duration) {
      dispatch({ type: 'PAUSE' });
      dispatch({
        type: 'SET_PROGRESSION',
        data: 0,
      });
    }
    if (progression < 0) {
      dispatch({
        type: 'SET_PROGRESSION',
        data: 0,
      });
    }
    if (Object.keys(videoRef).length > 0 && (progression <= helloScreen.duration || progression >= duration - endScreen.duration)) {
      videoRef.pause()
      videoRef.currenTime = 0
    } else if (Object.keys(videoRef).length > 0 && videoRef.paused && progression > helloScreen.duration && isPlaying) {
      videoRef.play()
    }
    return () => clearInterval(interval);
  }, [isPlaying, progression, videoSeeking])

  const displayProgression = () => {
    const t = dayjs.duration(progression)
    const m = t.minutes()
    const s = t.seconds()
    const ms = t.milliseconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}:${ms.toString().substring(0, 1)}`
  }

  return (
    <div className={styles.player}>
      <div
        ref={playerRef}
        className={styles.video}
        style={{ width: playerWidth }}
      >
        { preview.show && 
          <div>
            { preview.element === 'video' &&
              <video
                key={previewVideo}
                controls
                height="100%"
                width="100%"
              >
                {previewVideo && <source src={previewVideo} type="video/mp4" />}
                Sorry, your browser doesn't support embedded videos.
              </video>
            }
            { preview.element === 'helloScreen' && <HelloScreen />}
            { preview.element === 'endScreen' && <EndScreen /> }
            { preview.element === 'logo' && <Logo /> }
          </div>
        }
        { !preview.show &&
          <div> 
            <video
              ref={videoRefCb}
              key={video.url}
              src={video.url}
              height="100%"
              width="100%"
              style={{
                display: progression > (helloScreen.duration || 0) && progression < duration - (endScreen.duration || 0) ? 'block' : 'none'
              }}
            />
            {progression <= helloScreen.duration && <HelloScreen />}
            {progression >= duration - endScreen.duration && <EndScreen />}
            <Logo />
          </div>
        }
      </div>
      <div className={styles.controls}>
        <img
          onClick={() => {
            dispatch({ type: isPlaying ? 'PAUSE' : 'PLAY' })
            dispatch({ type: 'SELECT_TOOL', data: 0 })
            dispatch({ type: 'HIDE_PREVIEW' })
            if (progression > (helloScreen.duration || 0) && progression < duration - (endScreen.duration || 0)) {
              isPlaying ? videoRef.pause() : videoRef.play()
            }
          }}
          src={isPlaying ? '/assets/campaign/pause.svg' : '/assets/campaign/play.svg'}
        />
        <p className={styles.progression}>{displayProgression()}</p>
      </div>
    </div>
  )
}

export default Player