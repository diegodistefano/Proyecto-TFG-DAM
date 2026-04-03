import { useRef } from 'react';
import { usePdfUpload } from '../features/upload/hooks/usePdfUpload';
import UploadDropZone from '../features/upload/components/UploadDropzone';
import UploadActions from '../features/upload/components/UploadActions';
import '../main.css';
import UploadError from '../features/upload/components/UploadError';
import AudioBadges from '../features/audio/components/AudioBadges';
import AudioPlayer from '../features/audio/components/AudioPlayer';
import AudioActions from '../features/audio/components/AudioActions';

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
          <AudioBadges
            detectedLanguage={response.detectedLanguage}
            translated={response.translated}
          />
          <AudioPlayer
            audioUrl={response.audioUrl}
          />
          <AudioActions
            audioUrl={response.audioUrl}
            onReset={handleReset}
          />
        </div>
      )}
    </section>
  );
}
