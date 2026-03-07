import { useState } from 'react';
import axios from 'axios';
import './FileUploader.css';
 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
 
export default function FileUploader() {
  const [file, setFile]         = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
 
  const handleInputChange = (e) => {
    setError(null);
    setResponse(null);
    setFile(e.target.files[0] || null);
  };
 
  const handleUpload = async () => {
    if (!file) { setError('Selecciona un archivo PDF.'); return; }
    setLoading(true); setError(null); setResponse(null);
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const res = await axios.post(`${API_URL}/api/pdf/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error de conexión con el servidor.');
    } finally { setLoading(false); }
  };
 
  const handleReset = () => { setFile(null); setResponse(null); setError(null); };
 
  return (
    <section className="uploader-card">
      {!response && (
        <>
          <label className="file-label">
            <input type="file" accept="application/pdf,.pdf" onChange={handleInputChange} />
            <span>{file ? file.name : 'Selecciona un PDF'}</span>
          </label>
          <button onClick={handleUpload} disabled={loading || !file}>
            {loading ? 'Procesando...' : '🔊 Convertir a Audio'}
          </button>
        </>
      )}
      {error && <div className="alert alert--error">⚠️ {error}</div>}
      {response && (
        <div className="result">
          <h2>✅ Conversión completada</h2>
          <p><strong>Idioma:</strong> {response.detectedLanguage}</p>
          {response.translated && <p>🔄 Traducido automáticamente de inglés a español</p>}
          <p>{response.preview}</p>
          <audio controls src={response.audioUrl} />
          <a href={response.audioUrl} download="audio.mp3">⬇️ Descargar MP3</a>
          <button onClick={handleReset}>🔁 Convertir otro PDF</button>
        </div>
      )}
    </section>
  );
}

