import React, { useRef, useState } from "react";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UploadIcon } from "../svg/UploadIcon";
import { UserIcon } from "../svg/UserIcon";

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

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Selecteer een afbeeldingsbestand");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Bestand moet kleiner zijn dan 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `profile-${timestamp}-${file.name}`;
      const storageRef = ref(storage, `profile-images/${filename}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      setPreviewUrl(downloadURL);
      setImageError(false);
      onUploadComplete(downloadURL);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Uploaden mislukt. Probeer het opnieuw.");
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
          <label
            htmlFor="file-upload"
            role="button"
            tabIndex={uploading ? -1 : 0}
            onKeyDown={handleLabelKeyDown}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 bg-panel text-text border-panel-line hover:bg-panel-line/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              uploading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploaden..." : "Foto uploaden"}
          </label>
          <input
            id="file-upload"
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => void handleFileSelect(e)}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div role="alert" className="text-danger text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
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
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Foto succesvol geüpload!
        </div>
      )}
    </div>
  );
};
