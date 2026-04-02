import { useRef } from 'react';
import { usePdfUpload } from '../features/upload/hooks/usePdfUpload';
import UploadDropZone from '../features/upload/components/UploadDropzone';
import UploadActions from '../features/upload/components/UploadActions';
import '../main.css';
import UploadError from '../features/upload/components/UploadError';

const MAX_SIZE_MB = 10;

export default function FileUploader() {
  const inputRef = useRef(null);

  const { file, response, loading, error, selectFile, upload, reset } = usePdfUpload();

  const handleInputChange = (e) => {
    selectFile(e.target.files[0] || null);
  };

  const handleUpload = async () => {
    await upload();
  };

  const handleReset = () => {
    reset();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <section className="uploader-card">
      {!response && (
        <>
          <UploadDropZone
          file={file}
          inputRef={inputRef}
          onInputChange = {handleInputChange}
          MAX_SIZE_MB = {MAX_SIZE_MB}
          />
          <UploadActions
          file={file}
          loading={loading}
          handleUpload = {handleUpload}
          />
        </>
      )}
      {error && (
        <UploadError
        message={error}
        />
      )}
      {response && (
        <div className="result" aria-live="polite">
          <div className="result__header">
            <h2 className="result__title">Conversión completada</h2>
          </div>
          <div className="result__badges">
            <span className="badge badge--lang">
              Idioma detectado:
              {response.detectedLanguage}
            </span>
            {response.translated && (
              <span className="badge badge--translated">Traducido de inles a español</span>
            )}
          </div>
          <div className="result__audio">
            <h3 className="result__audio-title">Reproducir audio</h3>
            <audio controls src={response.audioUrl} className="audio-player" />
          </div>
          <div className="result__actions">
            <a className="btn btn--success" href={response.audioUrl} download="pdf2voice-audio.mp3">
              <span>Descargar MP3</span>
            </a>
            <button className="btn btn--secondary" onClick={handleReset}>
              <span>Convertir otro PDF</span>
            </button>
            <button className="btn btn--secondary" onClick={handleReset}>
              <span>Administrar audios</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
