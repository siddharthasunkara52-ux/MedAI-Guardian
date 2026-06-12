import { useState, useRef } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';
import Button from '../common/Button';

export default function ImageUploader({ onUpload, isLoading = false, accept = 'image/*' }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleFile = (f) => {
    const lowerName = f.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((ext) => lowerName.endsWith(ext));
    const hasAllowedType = allowedTypes.includes(f.type);

    setError('');
    if (!hasAllowedExtension || !hasAllowedType) {
      setFile(null);
      setPreview(null);
      setError('Upload a JPG, PNG, or WebP image.');
      return;
    }

    if (f.size > maxSize) {
      setFile(null);
      setPreview(null);
      setError('File too large. Maximum size is 5MB.');
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in">
      {error && <p className="mb-3 text-sm font-medium text-danger-600 dark:text-danger-300">{error}</p>}
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
              : 'border-gray-300 dark:border-dark-border hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-500/5'
          }`}
        >
          <div
            className={`p-4 rounded-2xl mb-4 transition-transform duration-300 ${
              dragActive
                ? 'bg-primary-100 dark:bg-primary-500/20 scale-110'
                : 'bg-gray-100 dark:bg-dark-card'
            }`}
          >
            <ImageIcon
              className={`w-8 h-8 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`}
            />
          </div>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
            {dragActive ? 'Drop your image here' : 'Drag & drop a medical image'}
          </p>
          <p className="text-sm text-gray-500 dark:text-dark-muted mb-3">
            or click to browse files
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-dark-muted">
            <span>JPG, PNG, WEBP</span>
            <span>•</span>
            <span>Max 5MB</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="glass-card p-6">
          <div className="relative mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-xl bg-gray-50 dark:bg-dark-card"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-dark-card/90 rounded-lg text-gray-500 hover:text-danger-500 shadow-md transition-colors cursor-pointer"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg">
              <ImageIcon className="w-5 h-5 text-primary-500" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            isLoading={isLoading}
            icon={Upload}
            fullWidth
          >
            Analyze Image
          </Button>
        </div>
      )}
    </div>
  );
}
