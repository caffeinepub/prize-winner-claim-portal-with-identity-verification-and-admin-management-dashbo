import { useCamera } from '../../camera/useCamera';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Camera, X, RotateCw, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const { isActive, isSupported, error, isLoading, startCamera, stopCamera, capturePhoto, switchCamera, retry, videoRef, canvasRef } =
    useCamera({
      facingMode: 'user',
      quality: 0.9,
    });

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      onCapture(photo);
      await stopCamera();
    }
  };

  const handleSwitchCamera = async () => {
    await switchCamera();
  };

  if (isSupported === false) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Camera is not supported on this device or browser.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '300px' }}>
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Button onClick={startCamera} disabled={isLoading} size="lg" className="gap-2">
              <Camera className="h-5 w-5" />
              {isLoading ? 'Starting Camera...' : 'Start Camera'}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message}
            {error.type === 'permission' && ' Please allow camera access in your browser settings.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {isActive && (
          <>
            <Button onClick={handleCapture} className="flex-1 gap-2">
              <Camera className="h-4 w-4" />
              Capture Photo
            </Button>
            <Button onClick={handleSwitchCamera} variant="outline" size="icon" title="Switch Camera">
              <RotateCw className="h-4 w-4" />
            </Button>
          </>
        )}
        {error && (
          <Button onClick={retry} variant="outline" className="flex-1">
            Retry
          </Button>
        )}
        <Button onClick={onCancel} variant="outline" size="icon" title="Cancel">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
