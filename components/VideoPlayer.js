import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useVideoResize } from '@/hooks'

import dayjs from '@/plugins/dayjs'

import EndScreen from '@/components/Campaign/EndScreen'
import HelloScreen from '@/components/Campaign/HelloScreen'
import Logo from '@/components/Campaign/Logo'

import styles from '@/styles/components/VideoPlayer.module.sass'

const VideoPlayer = ({ data }) => {
  const dispatch = useDispatch()

  const { endScreen, helloScreen, logo, video } = data

  const duration = useSelector(state => state.videoPlayer.duration)
  const isPlaying = useSelector(state => state.videoPlayer.isPlaying)
  const progression = useSelector(state => state.videoPlayer.progression)
  const timelineDraggable = useSelector(state => state.videoPlayer.timelineDraggable)
  const videoRef = useSelector(state => state.videoPlayer.videoRef)
  const videoSeeking = useSelector(state => state.videoPlayer.videoSeeking)
  const volume = useSelector(state => state.videoPlayer.volume)
  const volumeDraggable = useSelector(state => state.videoPlayer.volumeDraggable)
  const volumeMuted = useSelector(state => state.videoPlayer.volumeDraggable)

  const playerRef = useRef()
  const timelineRef = useRef()
  const volumeRef = useRef()
  const { height } = useVideoResize({ ref: playerRef, autoHeight: true })

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
          type: 'videoPlayer/SET_PROGRESSION',
          data: progression + 50,
        });
      }, 50);
    }
    if (progression >= duration) {
      dispatch({ type: 'PAUSE' })
      dispatch({
        type: 'videoPlayer/SET_PROGRESSION',
        data: 0,
      });
    }
    if (progression < 0) {
      dispatch({
        type: 'videoPlayer/SET_PROGRESSION',
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

  const videoRefCb = useCallback(node => {
    const handleSeeking = () => dispatch({ type: 'videoPlayer/SET_VIDEO_SEEKING', data: true })
    const handlePlaying = () => dispatch({ type: 'videoPlayer/SET_VIDEO_SEEKING', data: false })
    
    if (node !== null) {
      dispatch({ type: 'videoPlayer/SET_VIDEO_REF', data: node })
      dispatch({ type: 'videoPlayer/SET_DURATION', data: data.duration })

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

  const displayProgression = () => {
    const t = dayjs.duration(progression)
    const m = t.minutes()
    const s = t.seconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }

  const seekTo = (e) => {
    const rect = timelineRef.current.getBoundingClientRect()
    const position = e.clientX - rect.left
    const progression = position / timelineRef.current.offsetWidth * duration
    dispatch({ type: 'videoPlayer/SET_PROGRESSION', data: progression })
    if (Object.keys(videoRef).length > 0) {
      const currentTime = (progression - helloScreen.duration) / 1000
      videoRef.currentTime = currentTime > 0 ? currentTime : 0 
    }
  }

  const setVolume = (e) => {
    const rect = volumeRef.current.getBoundingClientRect()
    const position = e.clientX - rect.left
    const volume = position / volumeRef.current.offsetWidth
    dispatch({ type: 'videoPlayer/SET_VOLUME', data: volume })
    if (Object.keys(videoRef).length > 0) {
      videoRef.volume = volume < 0 ? 0 : volume > 1 ? 1 : volume
    }
  }

  return (
    <div className={styles.videoPlayer}>
      <div
        className={styles.player}
        onClick={async () => {
          dispatch({ type: isPlaying ? 'videoPlayer/PAUSE' : 'videoPlayer/PLAY' })
          if (progression > helloScreen.duration && progression < duration - endScreen.duration) {
            isPlaying ? videoRef.pause() : videoRef.play()
          }
        }}
        onMouseUp={() => {
          dispatch({ type: 'videoPlayer/TIMELINE_DRAGGABLE', data: false })
          dispatch({ type: 'videoPlayer/VOLUME_DRAGGABLE', data: false })
        }}
        onMouseMove={(e) => {
          timelineDraggable && seekTo(e)
          volumeDraggable && setVolume(e)
        }}
        ref={playerRef}
        style={{ height }}
      >
        <video
          height="100%"
          key={video.url}
          ref={videoRefCb}
          src={video.url}
          style={{
            display: progression > helloScreen.duration && progression < duration - endScreen.duration ? 'block' : 'none'
          }}
          width="100%"
        />
        {progression < helloScreen.duration && <HelloScreen data={helloScreen}/>}
        {progression >= duration - endScreen.duration && <EndScreen data={endScreen}/>}
        <Logo data={logo} />
      </div>
      <div
        className={styles.controls}
      >
        <div
          className={styles.timeline}
          onClick={(e) => seekTo(e)}
          onMouseDown={(e) => dispatch({ type: 'videoPlayer/TIMELINE_DRAGGABLE', data: true })}
          onMouseUp={(e) => dispatch({ type: 'videoPlayer/TIMELINE_DRAGGABLE', data: false })}
          onMouseMove={(e) => timelineDraggable && seekTo(e)}
          ref={timelineRef}
        >
          <div className={styles.timelineDuration}>
            <div
              className={styles.timelineProgression}
              style={{ width: `${(progression / duration) * 100}%` }}
            />
          </div>
        </div>
        <img
          className={styles.playPause}
          onClick={async () => {
            dispatch({ type: isPlaying ? 'videoPlayer/PAUSE' : 'videoPlayer/PLAY' })
            if (progression > helloScreen.duration && progression < duration - endScreen.duration) {
              isPlaying ? videoRef.pause() : videoRef.play()
            }
          }}
          src={isPlaying ? '/assets/video/pause.svg' : '/assets/video/play.svg'}
        />
        <div
          className={styles.volume}
          onMouseDown={(e) => dispatch({ type: 'videoPlayer/VOLUME_DRAGGABLE', data: true })}
          onMouseUp={(e) => dispatch({ type: 'videoPlayer/VOLUME_DRAGGABLE', data: false })}
          onMouseMove={(e) => volumeDraggable && setVolume(e)}
        >
          <div className={styles.volumeIcon}>
            <img src="/assets/video/volumeHigh.svg" />
            {/* <img src="/assets/video/volumeLow.svg" />
            <img src="/assets/video/volumeOff.svg" /> */}
          </div>
          <div
            className={styles.volumeBar}
            ref={volumeRef}
          >
            <div className={styles.volumeTotal}>
              <div
                className={styles.volumeAmount}
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
        <p className={styles.progression}>{displayProgression()}</p>
      </div>
    </div>
  )
}

export default VideoPlayer