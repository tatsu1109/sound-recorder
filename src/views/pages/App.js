import { useState, useRef } from 'react'

import StopIcon from '@material-ui/icons/Stop';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import './App.css';
import SelectedList from '../components/SelectedList'
import AudioPlayer from '../components/AudioPlayer'
import IconButton from '../components/IconButton'

const App = () => {
  const [audioList, setAudioList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recording, setRecording] = useState('inactive')
  const [fileName, setFileName] = useState('sample')
  const [audio, setAudio] = useState(null)
  // useRefは中身が変更になってもそのことを通知しない
  // https://ja.reactjs.org/docs/hooks-reference.html#useref
  const recordRef = useRef(null)

  const handleAudioListItemClick = ({id, audio}) => {
    setSelectedIndex(id)
    setAudio(audio)
  };

  const handleRecordingButtonOnClick = () => {
    recording === 'inactive' ? startRecording() : recordRef.current.stop()
  }

  const startRecording = () => {
    // メディア入力デバイスへのアクセスを起動する、Promiseを作成
    // https://developer.mozilla.org/ja/docs/Web/API/MediaDevices
    navigator.mediaDevices.getUserMedia(
      { audio: true, video: false }
    ).then(successRecording, failRecording)
  }

  const successRecording = stream => {
  // 入力されたMediaStreamを記録する
  // https://developer.mozilla.org/ja/docs/Web/API/MediaRecorder
    recordRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    })

    let tempChunks = [];
    recordRef.current.addEventListener('dataavailable', ele => {
      if (ele.data.size > 0) {
        tempChunks.push(ele.data);
      }
    })

    recordRef.current.addEventListener('start', () => {
      setRecording(recordRef.current.state)
    })    

    recordRef.current.addEventListener('stop', () => {
      const audio = URL.createObjectURL(new Blob(tempChunks))
      const audioListItem = {id: audioList.length + 1, name: fileName, audio: audio}
      handleAudioListItemClick(audioListItem)
      setAudioList([...audioList, audioListItem])
      setRecording(recordRef.current.state)
    })

    // onclick時に起動させる
    recordRef.current.start()
  }

  const failRecording = (error) => {              
    console.error('mediaDevice.getUserMedia() error:', error);
    return; 
  }

  return (
    <div className="App">
      <div>
        <AudioPlayer audio={audio === null ? '' : audio} controls />
      </div>
      <div>
        <input
          value={fileName}
          onChange={event => setFileName(event.target.value)} />
        <IconButton
          color='secondary'
          handleClick={handleRecordingButtonOnClick}
          icon={recording === 'inactive' ? <KeyboardVoiceIcon /> : <StopIcon />} 
        />
      </div>
      <div>
        <SelectedList
          list={audioList}
          handleClick={handleAudioListItemClick}
          index={selectedIndex} />
      </div>
    </div>
  );
}

export default App;
