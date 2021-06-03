import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useVideoResize } from '@/hooks'

import dayjs from '@/plugins/dayjs'

import EndScreen from '@/components/Campaign/EndScreen'
import {defaultEndScreen, defaultHelloScreen} from '../../store/reducers/campaign'
import HelloScreen from '@/components/Campaign/HelloScreen'
import Logo from '@/components/Campaign/Logo'

import styles from '@/styles/components/Campaign/Player.module.sass'
import Placeholder from './Placeholder'

const Player = () => {
  const dispatch = useDispatch()

  const endScreen = useSelector(state => state.campaign.endScreen)
  const duration = useSelector(state => state.campaign.duration)
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const isPlaying = useSelector(state => state.campaign.isPlaying)
  const logo = useSelector(state => state.campaign.logo)
  const preview = useSelector(state => state.campaign.preview)
  const previewEndScreen = useSelector(state => state.campaign.previewEndScreen)
  const previewHelloScreen = useSelector(state => state.campaign.previewHelloScreen)
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
      ((progression > helloScreen.duration) && (progression < (duration - endScreen.duration)) && videoSeeking && videoRef.currentTime !== 0)
      || (!isPlaying && progression !== 0)
    ) {
      clearInterval(interval)
    } else if (isPlaying) {
      interval = setInterval(() => {
        dispatch({
          type: 'SET_PROGRESSION',
          data: progression + 50,
        });
      }, 50);
    }
    if (progression >= duration) {
      dispatch({ type: 'PAUSE' })
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

    if (videoRef.ended && !videoRef.paused) {
      videoRef.currenTime = 0
      videoRef.pause()
    } else if (Object.keys(videoRef).length > 0 && !videoRef.paused && (progression < helloScreen.duration || progression > duration - endScreen.duration)) {
      videoRef.currenTime = 0
      videoRef.pause()
    } else if (Object.keys(videoRef).length > 0 && videoRef.paused && progression > helloScreen.duration && progression < duration - endScreen.duration && isPlaying) {
      videoRef.play()
    }
    return () => clearInterval(interval);
  }, [isPlaying, progression, videoSeeking])

  const displayProgression = () => {
    const t = dayjs.duration(progression)
    const m = t.minutes()
    const s = t.seconds()
    const ms = t.milliseconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}:${ms < 100 ? '0' : ms.toString().substring(0, 1)}`
  }

  return (
    <div className={styles.player}>
      <div
        ref={playerRef}
        className={styles.video}
        style={{ width: playerWidth }}
      >
        {preview.show ? (
          <div>
            {preview.element === 'record' && (
              <Placeholder  of={preview.element} />
            )}
            {preview.element === 'video' &&
              (previewVideo.url || video.url ? (
                <video
                  key={previewVideo.url}
                  controls
                  height="100%"
                  width="100%"
                >
                  <source
                    src={previewVideo.url || video.url}
                    type="video/mp4"
                  />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              ) : (
                <Placeholder of={preview.element} />
              ))}
            {preview.element === 'helloScreen' &&
              (Object.keys(previewHelloScreen).length == 0 &&
              (JSON.stringify(helloScreen) ===
                JSON.stringify(defaultHelloScreen) ||
                !helloScreen.name) ? (
                  <Placeholder of={preview.element} />
              ) : (
                <HelloScreen
                  data={
                    Object.keys(previewHelloScreen).length > 0
                      ? previewHelloScreen
                      : helloScreen
                  }
                />
              ))}
            {preview.element === 'endScreen' &&
              (Object.keys(previewEndScreen).length == 0 &&
              (JSON.stringify(endScreen) === JSON.stringify(defaultEndScreen) ||
                !endScreen.name) ? (
                  <Placeholder of={preview.element} />
              ) : (
                <EndScreen
                  data={
                    Object.keys(previewEndScreen).length > 0
                      ? previewEndScreen
                      : endScreen
                  }
                />
              ))}
            {logo && <Logo data={logo}/>}
          </div>
        ):<Placeholder of='all' />
        }
        <div style={{ display: preview.show ? 'none' : 'block' }}> 
          <video
            ref={videoRefCb}
            key={video.url}
            src={video.url}
            height="100%"
            width="100%"
            style={{
              display: progression > helloScreen.duration && progression < duration - endScreen.duration ? 'block' : 'none'
            }}
          />
          {progression < helloScreen.duration && <HelloScreen data={helloScreen} />}
          {progression >= duration - endScreen.duration && <EndScreen data={endScreen} />}
          <Logo data={logo} />
        </div>
      </div>
      <div className={styles.controls}>
        <img
          onClick={async () => {
            dispatch({ type: 'HIDE_PREVIEW' }) 
            dispatch({ type: isPlaying ? 'PAUSE' : 'PLAY' })
            if (progression > helloScreen.duration && progression < duration - endScreen.duration) {
              isPlaying ? videoRef.pause() : videoRef.play()
            }
          }}
          src={isPlaying ? '/assets/video/pause.svg' : '/assets/video/play.svg'}
        />
        <p className={styles.progression}>{displayProgression()}</p>
      </div>
    </div>
  )
}

export default Player