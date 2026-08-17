import React, { useState } from "react";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UploadIcon } from "../svg/UploadIcon";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentPhotoUrl?: string;
  isDarkMode: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  currentPhotoUrl,
  isDarkMode,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
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
      onUploadComplete(downloadURL);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Current/Preview Image */}
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <img
              src={previewUrl || currentPhotoUrl || ""}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to user icon if image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Upload Button */}
        <div>
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 ${
              isDarkMode
                ? "text-gray-200 bg-gray-700 hover:bg-gray-600"
                : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
            } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Photo"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm flex items-center">
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
        <div className="text-green-600 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Photo uploaded successfully!
        </div>
      )}
    </div>
  );
};
