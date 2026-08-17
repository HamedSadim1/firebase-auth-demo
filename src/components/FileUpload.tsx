import React, { useRef, useState } from "react";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getStorageErrorMessage } from "../lib/errors";
import { STORAGE_UPLOAD_PATH } from "../lib/config";
import { focusRing } from "../lib/styles";
import {
  FILE_NOT_IMAGE,
  FILE_TOO_LARGE,
  IMAGE_INPUT_ACCEPT,
  IMAGE_MIME_PREFIX,
  MAX_FILE_SIZE_BYTES,
  UPLOAD_FILENAME_PREFIX,
} from "../lib/constants";
import { UploadIcon, UserIcon, WarningIcon, CheckIcon } from "../svg/index";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentPhotoUrl?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  currentPhotoUrl,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith(IMAGE_MIME_PREFIX)) {
      setError(FILE_NOT_IMAGE);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(FILE_TOO_LARGE);
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${UPLOAD_FILENAME_PREFIX}-${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${STORAGE_UPLOAD_PATH}/${filename}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      setPreviewUrl(downloadURL);
      setImageError(false);
      onUploadComplete(downloadURL);
    } catch (error) {
      console.error("Upload error:", error);
      setError(getStorageErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Current/Preview Image */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-panel-line flex items-center justify-center bg-panel">
            {(previewUrl ?? currentPhotoUrl) && !imageError ? (
              <img
                src={previewUrl ?? currentPhotoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <UserIcon className="w-8 h-8 text-muted" />
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 bg-panel text-text border-panel-line hover:bg-panel-line/30 ${focusRing} ${
              uploading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploaden..." : "Foto uploaden"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_INPUT_ACCEPT}
            onChange={(e) => void handleFileSelect(e)}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div role="alert" className="text-danger text-sm flex items-center">
          <WarningIcon className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {previewUrl && !uploading && (
        <div
          role="status"
          aria-live="polite"
          className="text-teal text-sm flex items-center"
        >
          <CheckIcon className="w-4 h-4 mr-1" />
          Foto succesvol geüpload!
        </div>
      )}
    </div>
  );
};
