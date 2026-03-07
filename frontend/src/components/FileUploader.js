import { useState, useRef } from 'react';
import axios from 'axios';
import './FileUploader.css';
 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const MAX_SIZE_MB = 10;
 
export default function FileUploader() {
  const [file, setFile]         = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
 
  
  const validateFile = (selectedFile) => {
    if (!selectedFile) return 'No se seleccionó ningún archivo.';
    if (selectedFile.type !== 'application/pdf')
      return 'Solo se permiten archivos PDF (.pdf).';
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024)
      return `El archivo supera el límite de ${MAX_SIZE_MB} MB.`;
    return null;
  };
 
  const handleFileSelect = (selectedFile) => {
    setError(null); setResponse(null);
    const err = validateFile(selectedFile);
    if (err) { setError(err); setFile(null); return; }
    setFile(selectedFile);
  };
 
  const handleInputChange = (e) => handleFileSelect(e.target.files[0] || null);
 
  // Drag & Drop
  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop      = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0] || null);
  };
 
  const handleUpload = async () => {
    if (!file) { setError('Selecciona un archivo PDF antes de continuar.'); return; }
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
 
  const handleReset = () => {
    setFile(null); setResponse(null); setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };
 
  return (
    <section className="uploader-card">
      {!response && (
        <>
          <div
            className={`drop-zone ${dragOver ? 'drop-zone--active' : ''} ${file ? 'drop-zone--has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />
            {file ? (
              <div className="file-info">
                <span>📄</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size/1024/1024).toFixed(2)} MB)</span>
              </div>
            ) : (
              <div className="drop-prompt">
                <span>⬆️</span>
                <p><strong>Arrastra tu PDF aquí</strong> o haz clic para buscarlo</p>
                <p className="drop-hint">Solo PDF • Máximo {MAX_SIZE_MB} MB</p>
              </div>
            )}
          </div>
          <button
            className="btn btn--primary"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? 'Procesando...' : '🔊 Convertir a Audio'}
          </button>
        </>
      )}
      {error && <div className="alert alert--error">⚠️ {error}</div>}
      {response && (
        <div className="result">
          <h2>✅ Conversión completada</h2>
          <p><strong>Idioma:</strong> {response.detectedLanguage}</p>
          {response.translated && <p>🔄 Traducido automáticamente</p>}
          <p>{response.preview}</p>
          <audio controls src={response.audioUrl} />
          <a href={response.audioUrl} download="audio.mp3">⬇️ Descargar MP3</a>
          <button onClick={handleReset}>🔁 Convertir otro PDF</button>
        </div>
      )}
    </section>
  );
}

