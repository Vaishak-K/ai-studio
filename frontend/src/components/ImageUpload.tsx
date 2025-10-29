"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
  restoredImageUrl?: string | null; // ADDED: For restoring from history
}

export default function ImageUpload({
  onImageSelect,
  selectedImage,
  restoredImageUrl,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ADDED: Handle restored image URL
  useEffect(() => {
    if (restoredImageUrl) {
      setPreview(`http://localhost:3001${restoredImageUrl}`);
      // Convert URL to File object
      fetchImageAsFile(restoredImageUrl);
    }
  }, [restoredImageUrl]);

  // ADDED: Fetch image from URL and convert to File
  const fetchImageAsFile = async (imageUrl: string) => {
    try {
      const response = await fetch(`http://localhost:3001${imageUrl}`);
      const blob = await response.blob();
      const filename = imageUrl.split("/").pop() || "restored-image.jpg";
      console.log("Filename:", filename);
      const file = new File([blob], filename, { type: blob.type });
      onImageSelect(file);
    } catch (error) {
      console.error("Error loading restored image:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPEG and PNG files are allowed");
      return;
    }

    onImageSelect(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Upload Image
        </label>
        {preview && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear
          </button>
        )}
      </div>

      <div
        onClick={() => !preview && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          preview
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-primary-500 cursor-pointer"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
      >
        {preview ? (
          <div className="space-y-4">
            <div className="relative w-full h-64">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Change Image
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
        aria-label="File input"
      />
    </div>
  );
}
