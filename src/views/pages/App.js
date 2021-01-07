import { useState, useRef } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import { IconButton, List, ListItem, ListItemText } from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import './App.css';

const App = () =>  {
  const [recording, setRecording] = useState('inactive')
  const [fileName, setFileName] = useState('sample')
  const [audio, setAudio] = useState(null)
  const [audioList, setAudioList] = useState([])
  // useRefは中身が変更になってもそのことを通知しない
  // https://ja.reactjs.org/docs/hooks-reference.html#useref
  const recordRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
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

    recordRef.current.addEventListener('stop', () => {
      const audio = URL.createObjectURL(new Blob(tempChunks))
      setAudio(audio)
      setSelectedIndex(audioList.length + 1)
      setAudioList([...audioList, {id: audioList.length + 1, name: fileName, audio: audio}])
      setRecording(recordRef.current.state)
    })

    // onclick時に起動させる
    recordRef.current.start()
    setRecording(recordRef.current.state)
  }

  return (
    <div className="App">
      <div>
        <ReactAudioPlayer src={audio === null ? '' : audio} controls />
      </div>
      <div>
        <input value={fileName} onChange={event => setFileName(event.target.value)}></input>
        <IconButton
          color='secondary'
          onClick={() => {
            recording === 'inactive' ? startRecording() : recordRef.current.stop()
          }}
        >
          {recording === 'inactive' ? <KeyboardVoiceIcon /> : <StopIcon />} 
        </IconButton>
      </div>
      <div>    
        <List component="nav" aria-label="secondary">
          {
            audioList.map(item =>
              <ListItem
                button
                selected={selectedIndex === item.id} key={item.id}>
                <ListItemText
                  primary={item.name}
                  onClick={(event) => {
                    setAudio(item.audio)
                    handleListItemClick(event, item.id)
                  }} />
              </ListItem>
            )
          }
        </List>  
      </div>
    </div>
  );
}

const failRecording = (error) => {              
  console.error('mediaDevice.getUserMedia() error:', error);
  return; 
}

export default App;
