import { useState, useRef } from 'react'

import StopIcon from '@material-ui/icons/Stop';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import './App.css';
import SelectedList from '../components/SelectedList'
import AudioPlayer from '../components/AudioPlayer'
import IconButton from '../components/IconButton'

const App = () => {
  const [recording, setRecording] = useState('inactive')
  const [fileName, setFileName] = useState('sample')
  const [audio, setAudio] = useState(null)
  // useRefは中身が変更になってもそのことを通知しない
  // https://ja.reactjs.org/docs/hooks-reference.html#useref
  const recordRef = useRef(null)

  const [audioList, setAudioList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleAudioListItemClick = ({id, audio}) => {
    setSelectedIndex(id)
    setAudio(audio)
  };

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

    recordRef.current.addEventListener('start', () => setRecording(recordRef.current.state))    

    recordRef.current.addEventListener('stop', () => {
      const audioListItem = {
        id: audioList.length === 0 ? 1 : audioList.flatMap(item => item.id).reduce((a, b) => Math.max(a, b)) + 1,
        name: fileName,
        audio: URL.createObjectURL(new Blob(tempChunks))
      }
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
          handleClick={() => recording === 'inactive' ? startRecording() : recordRef.current.stop()}
          icon={recording === 'inactive' ? <KeyboardVoiceIcon /> : <StopIcon />} 
        />
      </div>
      <div>
        <SelectedList
          list={audioList}
          handleItemClick={handleAudioListItemClick}
          handleDeleteClick={(list, { id }) => setAudioList(list.filter(item => item.id !== id))}
          index={selectedIndex} />
      </div>
    </div>
  );
}

export default App;
