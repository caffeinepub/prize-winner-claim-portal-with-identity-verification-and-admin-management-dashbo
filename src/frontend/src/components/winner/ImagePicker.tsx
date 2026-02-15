import { useRef } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, X, AlertCircle } from 'lucide-react';

interface ImagePickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
  label: string;
  accept?: string;
}

export default function ImagePicker({ file, onChange, label, accept = 'image/*' }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    onChange(selectedFile);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {file ? (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden border bg-muted" style={{ aspectRatio: '4/3' }}>
            <img src={URL.createObjectURL(file)} alt={label} className="w-full h-full object-cover" />
            <Button
              onClick={handleRemove}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">Click to upload {label.toLowerCase()}</p>
          <Button onClick={() => inputRef.current?.click()} variant="outline">
            Choose File
          </Button>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">Maximum file size: 10MB. Accepted formats: JPG, PNG, WebP</AlertDescription>
      </Alert>
    </div>
  );
}
