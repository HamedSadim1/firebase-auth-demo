import React, { useRef, useState } from "react";
import { FirebaseError } from "firebase/app";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UploadIcon } from "../svg/UploadIcon";
import { UserIcon } from "../svg/UserIcon";
import { WarningIcon } from "../svg/WarningIcon";
import { CheckIcon } from "../svg/CheckIcon";

const getStorageErrorMessage = (error: unknown): string => {
  const code = error instanceof FirebaseError ? error.code : "";
  switch (code) {
    case "storage/quota-exceeded":
      return "Opslaglimiet bereikt. Maak ruimte vrij en probeer opnieuw.";
    case "storage/unauthorized":
      return "Je hebt geen rechten om te uploaden.";
    case "storage/canceled":
      return "Uploaden geannuleerd.";
    default:
      return "Uploaden mislukt. Probeer het opnieuw.";
  }
};

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
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 bg-panel text-text border-panel-line hover:bg-panel-line/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              uploading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploaden..." : "Foto uploaden"}
          </button>
          <input
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
