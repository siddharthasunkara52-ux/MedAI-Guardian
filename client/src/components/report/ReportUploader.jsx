import { useState, useRef } from 'react';
import { Upload, FileText, X, File } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';
import Button from '../common/Button';

export default function ReportUploader({ onUpload, isLoading = false, accept = '.pdf,.txt,.text' }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedExtensions = ['.pdf', '.txt', '.text'];
  const allowedTypes = ['application/pdf', 'text/plain'];

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
    const hasAllowedType = allowedTypes.includes(f.type) || (f.type === '' && hasAllowedExtension);

    setError('');
    if (!hasAllowedExtension || !hasAllowedType) {
      setFile(null);
      setError('Upload a PDF or plain text report.');
      return;
    }

    if (f.size > maxSize) {
      setFile(null);
      setError('File too large. Maximum size is 10MB.');
      return;
    }
    setFile(f);
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
            <Upload
              className={`w-8 h-8 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`}
            />
          </div>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
            {dragActive ? 'Drop your file here' : 'Drag & drop your report'}
          </p>
          <p className="text-sm text-gray-500 dark:text-dark-muted mb-3">
            or click to browse files
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-dark-muted">
            <span>PDF, TXT</span>
            <span>•</span>
            <span>Max 10MB</span>
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
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-xl">
              <FileText className="w-8 h-8 text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-dark-muted">
                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-2 rounded-lg text-gray-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors cursor-pointer"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Button
            onClick={handleUpload}
            isLoading={isLoading}
            icon={File}
            fullWidth
            className="mt-4"
          >
            Analyze Report
          </Button>
        </div>
      )}
    </div>
  );
}
