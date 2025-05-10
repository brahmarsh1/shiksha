import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shiksha</h1>
      <p style={styles.subtitle}>Swara Analyzer for Vedic Chanting</p>

      <div style={styles.uploadSection}>
        <input type="file" accept="audio/*" onChange={handleFileChange} style={styles.fileInput} />
        <button onClick={handleUpload} style={styles.button}>Upload & Analyze</button>
      </div>

      {response && (
        <div style={styles.resultBox}>
          <h3>Analysis Result:</h3>
          <pre style={styles.pre}>{JSON.stringify(response, null, 2)}</pre>
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
  },
  resultBox: {
    background: '#fff',
    padding: '1rem',
    textAlign: 'left',
    borderRadius: '8px',
    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.1)',
    marginTop: '2rem',
  },
  pre: {
    fontSize: '0.9rem',
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
};

export default App;
