import ReactAudioPlayer from 'react-audio-player'

const AudioPlayer = ({audio}) => <ReactAudioPlayer src={audio === null ? '' : audio} controls />

export default AudioPlayer;