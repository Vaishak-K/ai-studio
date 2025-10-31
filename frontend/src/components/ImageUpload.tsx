"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
  restoredImageUrl?: string | null;
}

export default function ImageUpload({
  onImageSelect,
  selectedImage,
  restoredImageUrl,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    if (selectedImage === null) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [selectedImage]);

  useEffect(() => {
    if (restoredImageUrl) {
      setPreview(`${url}${restoredImageUrl}`);
      fetchImageAsFile(restoredImageUrl);
    }
  }, [restoredImageUrl]);

  const fetchImageAsFile = async (imageUrl: string) => {
    try {
      const response = await fetch(`${url}${imageUrl}`);
      const blob = await response.blob();
      const filename = imageUrl.split("/").pop() || "restored-image.jpg";
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
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
        <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
          <span className="text-lg">🖼️</span>
          Upload Image
        </label>
        {preview && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors flex items-center gap-1 group"
          >
            <svg
              className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>
        )}
      </div>

      <div
        onClick={() => !preview && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          preview
            ? "border-green-500/30 bg-green-500/5"
            : isDragging
            ? "border-violet-500 bg-violet-500/10 scale-105"
            : "border-white/20 bg-white/5 hover:border-violet-500/50 hover:bg-white/10 cursor-pointer"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
      >
        {/* Glow effect on hover */}
        {!preview && (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}

        {preview ? (
          <div className="space-y-4 animate-fade-in-up">
            <div className="relative w-full h-80 rounded-xl overflow-hidden group">
              {/* Image glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 via-transparent to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 group"
              >
                <svg
                  className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Change Image
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-green-400">
                  Ready
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upload Icon */}
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 p-6 rounded-full border border-white/10">
                <svg
                  className={`h-12 w-12 text-violet-400 transition-transform duration-500 ${
                    isDragging ? "scale-110 rotate-12" : ""
                  }`}
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
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <p className="text-lg font-medium text-slate-200">
                {isDragging ? "Drop your image here" : "Upload your image"}
              </p>
              <p className="text-sm text-slate-400">
                Drag and drop or click to browse
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  PNG, JPG
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Max 10MB
                </div>
              </div>
            </div>
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
