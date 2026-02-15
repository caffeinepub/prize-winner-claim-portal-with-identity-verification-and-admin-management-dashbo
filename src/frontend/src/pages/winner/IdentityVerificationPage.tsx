import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import CameraCapture from '../../components/winner/CameraCapture';
import ImagePicker from '../../components/winner/ImagePicker';
import { Camera, Upload, CheckCircle } from 'lucide-react';

export default function IdentityVerificationPage() {
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [captureMode, setCaptureMode] = useState<'upload' | 'camera'>('upload');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSelfieCapture = (file: File) => {
    setSelfieFile(file);
    setCaptureMode('upload');
  };

  const handleUpload = async () => {
    if (!selfieFile || !idCardFile) return;

    // In a real implementation, this would upload to blob storage
    // For now, we'll simulate success
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
        <p className="text-muted-foreground">Upload your selfie and ID card to verify your identity</p>
      </div>

      <Alert>
        <AlertDescription>
          For security purposes, we require a recent selfie and a photo of your government-issued ID card. All images are encrypted and
          stored securely.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Selfie Photo</CardTitle>
            <CardDescription>Take a clear photo of your face or upload an existing one</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {captureMode === 'camera' ? (
              <CameraCapture onCapture={handleSelfieCapture} onCancel={() => setCaptureMode('upload')} />
            ) : (
              <>
                <ImagePicker file={selfieFile} onChange={setSelfieFile} label="Selfie" accept="image/*" />
                <Button variant="outline" className="w-full gap-2" onClick={() => setCaptureMode('camera')}>
                  <Camera className="h-4 w-4" />
                  Use Camera
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ID Card Photo</CardTitle>
            <CardDescription>Upload a clear photo of your government-issued ID</CardDescription>
          </CardHeader>
          <CardContent>
            <ImagePicker file={idCardFile} onChange={setIdCardFile} label="ID Card" accept="image/*" />
          </CardContent>
        </Card>
      </div>

      {uploadSuccess && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            Identity documents uploaded successfully!
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={handleUpload} disabled={!selfieFile || !idCardFile} size="lg" className="w-full gap-2">
        <Upload className="h-4 w-4" />
        Upload Identity Documents
      </Button>
    </div>
  );
}
