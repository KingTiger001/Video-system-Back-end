import Countdown from './Countdown'
import Timer from './Timer'

import styles from '../../styles/components/VideoRecorder/Actions.module.sass'

const Actions = ({
  isVideoInputSupported,
  isInlineRecordingSupported,
  thereWasAnError,
  isRecording,
  isCameraOn,
  streamIsReady,
  isConnecting,
  isRunningCountdown,
  isReplayingVideo,
  countdownTime,
  timeLimit,
  showReplayControls,
  replayVideoAutoplayAndLoopOff,
  useVideoInput,

  onTurnOnCamera,
  onTurnOffCamera,
  onOpenVideoInput,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onStopReplaying,
  onConfirm,

  onClose,
}) => {
  const renderActions = () => {
    if (
      (!isInlineRecordingSupported && !isVideoInputSupported) ||
      thereWasAnError ||
      isConnecting ||
      isRunningCountdown
    ) {
      return null
    }

    if (isReplayingVideo) {
      return (
        <button
          type='button'
          onClick={onStopReplaying}
          data-qa='start-replaying'
        >
          Use another video
        </button>
      )
    }

    if (isRecording) {
      return (
        <div className={styles.recording}>
          <button onClick={onStopRecording}>
            <span />
            Stop recording
          </button>
        </div>
      )
    }

    if (isCameraOn && streamIsReady) {
      return (
        <div className={styles.recording}>
          <button onClick={onStartRecording}>
            <span />
            Start recording
          </button>
        </div>
      )
    }

    return (
      <button type='button' onClick={onTurnOnCamera} data-qa='turn-on-camera'>
        Turn my camera ON
      </button>
    )
  }

  return (
    <div className={styles.actions}>
      { !isConnecting && !isReplayingVideo &&
        <Timer
          timeLimit={timeLimit}
          isRecording={isRecording}
        />
      }
      { isRunningCountdown && <Countdown countdownTime={countdownTime} /> }
      { !isRunningCountdown && !isRecording &&
        <div
          onClick={() => {
            onTurnOffCamera()
            onClose()
          }}
          className={styles.close}
        >
          <img src="/assets/common/close-w.svg" />
        </div>
      }
      {renderActions()}
    </div>
  )
}

export default Actions