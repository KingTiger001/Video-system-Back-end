import Countdown from './Countdown'
import Timer from './Timer'

import styles from '@/styles/components/Campaign/VideoRecorder/Actions.module.sass'

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

  // custom props
  onClose,
  onSave,
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
        <div className={`${styles.buttons} ${styles.end}`}>
          <button onClick={onStopReplaying}>
            Restart
          </button>
          <button onClick={onSave}>
            Save & continue
          </button>
        </div>
      )
    }

    if (isRecording) {
      return (
        <div className={styles.buttons}>
          <button onClick={onStopRecording}>
            <span />
            Stop recording
          </button>
        </div>
      )
    }

    if (isCameraOn && streamIsReady) {
      return (
        <div className={styles.buttons}>
          <button onClick={onStartRecording}>
            <span />
            Start recording
          </button>
        </div>
      )
    }

    return (
      <button type='button' onClick={onTurnOnCamera}>
        Turn my camera ON
      </button>
    )
  }

  return (
    <div className={styles.actions}>
      {!isConnecting &&
        <Timer
          timeLimit={timeLimit}
          isRecording={isRecording}
        />
      }
      {isRunningCountdown && <Countdown countdownTime={countdownTime} />}
      {!isRunningCountdown && !isRecording &&
        <div
          onClick={() => {
            onTurnOffCamera()
            onClose()
          }}
          className={styles.close}
        >
          <img src="/assets/common/closeW.svg" />
        </div>
      }
      {renderActions()}
    </div>
  )
}

export default Actions