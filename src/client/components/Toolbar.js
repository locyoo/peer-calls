import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import screenfull from 'screenfull'
import { MessagePropTypes } from './Chat.js'
import { StreamPropType } from './Video.js'

const hidden = {
  display: 'none'
}

export default class Toolbar extends React.PureComponent {
  static propTypes = {
    messages: PropTypes.arrayOf(MessagePropTypes).isRequired,
    stream: StreamPropType,
    onToggleChat: PropTypes.func.isRequired,
    onSendFile: PropTypes.func.isRequired,
    chatVisible: PropTypes.bool.isRequired
  }
  constructor (props) {
    super(props)
    this.file = React.createRef()
    this.state = {
      readMessages: props.messages.length
    }
  }
  handleMicClick = () => {
    const { stream } = this.props
    stream.mediaStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled
    })
    this.mixButton.classList.toggle('on')
  }
  handleCamClick = () => {
    const { stream } = this.props
    stream.mediaStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled
    })
    this.camButton.classList.toggle('on')
  }
  handleFullscreenClick = () => {
    if (screenfull.enabled) {
      screenfull.toggle()
      this.fullscreenButton.classList.toggle('on')
    }
  }
  handleHangoutClick = () => {
    window.location.href = '/'
  }
  handleSendFile = () => {
    this.file.current.click()
  }
  handleSelectFiles = (event) => {
    Array
    .from(event.target.files)
    .forEach(file => this.props.onSendFile(file))
  }
  handleToggleChat = () => {
    this.setState({
      readMessages: this.props.messages.length
    })
    this.props.onToggleChat()
  }
  render () {
    const { messages, stream } = this.props

    return (
      <div className="toolbar active">
        <div onClick={this.handleToggleChat}
          className={classnames('button chat', {
            on: this.props.chatVisible
          })}
          data-blink={!this.props.chatVisible &&
            messages.length > this.state.readMessages}
          title="Chat"
        >
          <span className="icon icon-question_answer" />
        </div>
        <div
          className="button send-file"
          onClick={this.handleSendFile}
          title="Send file"
        >
          <input
            style={hidden}
            type="file"
            multiple
            ref={this.file}
            onChange={this.handleSelectFiles}
          />
          <span className="icon icon-file-text2" />
        </div>

        {stream && (
          <div>
            <div onClick={this.handleMicClick}
              ref={node => { this.mixButton = node }}
              className="button mute-audio"
              title="Mute audio"
            >
              <span className="on icon icon-mic_off" />
              <span className="off icon icon-mic" />
            </div>
            <div onClick={this.handleCamClick}
              ref={node => { this.camButton = node }}
              className="button mute-video"
              title="Mute video"
            >
              <span className="on icon icon-videocam_off" />
              <span className="off icon icon-videocam" />
            </div>
          </div>
        )}

        <div onClick={this.handleFullscreenClick}
          ref={node => { this.fullscreenButton = node }}
          className="button fullscreen"
          title="Enter fullscreen"
        >
          <span className="on icon icon-fullscreen_exit" />
          <span className="off icon icon-fullscreen" />
        </div>

        <div onClick={this.handleHangoutClick}
          className="button hangup"
          title="Hangup"
        >
          <span className="icon icon-call_end" />
        </div>
      </div>
    )
  }
}