import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [language, setLanguage] = useState('auto');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (uploadFile) => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const endpoint =
        language === 'sa'
          ? 'http://localhost:8000/transcribe?lang=sa'
          : 'http://localhost:8000/transcribe';

      const res = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setText(res.data.text || '');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    audioChunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      setRecordedBlob(audioBlob);
      setFile(audioBlob);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shiksha</h1>
      <p style={styles.subtitle}>AI Sanskrit Speech-to-Text</p>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Language:</strong>{' '}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.dropdown}
          >
            <option value="auto">Auto Detect</option>
            <option value="sa">Sanskrit</option>
          </select>
        </label>
      </div>

      <div style={styles.uploadSection}>
        <input type="file" accept="audio/*" onChange={handleFileChange} style={styles.fileInput} />
        <button onClick={() => handleUpload(file)} style={styles.button}>Upload File</button>
      </div>

      <div style={{ margin: '2rem 0' }}>
        {!isRecording ? (
          <button onClick={startRecording} style={styles.button}>🎙️ Start Recording</button>
        ) : (
          <button onClick={stopRecording} style={styles.button}>⏹️ Stop Recording</button>
        )}
        {recordedBlob && (
          <div style={{ marginTop: '1rem' }}>
            <audio controls src={URL.createObjectURL(recordedBlob)} />
            <br />
            <button onClick={() => handleUpload(recordedBlob)} style={styles.button}>Upload Recording</button>
          </div>
        )}
      </div>

      {text && (
        <div style={styles.resultBox}>
          <h3>📝 Transcription:</h3>
          <p style={styles.transcribedText}>{text}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: `'Segoe UI', sans-serif`,
    maxWidth: '700px',
    margin: '0 auto',
    textAlign: 'center',
    background: '#f5f5f5',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2.5rem',
    color: '#663399',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#444',
    marginBottom: '2rem',
  },
  uploadSection: {
    marginBottom: '2rem',
  },
  fileInput: {
    marginRight: '1rem',
  },
  button: {
    padding: '0.5rem 1.2rem',
    background: '#663399',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  dropdown: {
    padding: '0.3rem',
    fontSize: '1rem',
    marginLeft: '0.5rem',
  },
  resultBox: {
    background: '#fff',
    padding: '1rem',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.1)',
    marginTop: '2rem',
  },
  transcribedText: {
    fontSize: '1.4rem',
    color: '#111',
    marginTop: '1rem',
  },
};

export default App;
