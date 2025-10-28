"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGenerate } from "@/hooks/useGenerate";
import ImageUpload from "@/components/ImageUpload";
import GenerationHistory from "@/components/GenerationHistory";
import { Generation } from "@/lib/api";

const STYLES = ["realistic", "artistic", "anime", "sketch"] as const;

export default function StudioPage() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { generate, abort, isGenerating, error, result, retryCount } =
    useGenerate();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<(typeof STYLES)[number]>("realistic");
  const [refreshHistory, setRefreshHistory] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !prompt) return;

    const result = await generate({ image: selectedImage, prompt, style });
    if (result) {
      setRefreshHistory((prev) => prev + 1);
    }
  };

  const handleRestore = (generation: Generation) => {
    setPrompt(generation.prompt);
    setStyle(generation.style as (typeof STYLES)[number]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">🎨 AI Studio</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <form onSubmit={handleGenerate} className="space-y-6">
                <ImageUpload
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                />

                <div>
                  <label
                    htmlFor="prompt"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Describe what you want to generate..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {prompt.length}/500
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="style"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Style
                  </label>
                  <select
                    id="style"
                    value={style}
                    onChange={(e) =>
                      setStyle(e.target.value as (typeof STYLES)[number])
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent capitalize"
                  >
                    {STYLES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">{error}</p>
                      {retryCount > 0 && (
                        <p className="text-sm mt-1">
                          Retry attempt {retryCount}/3
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {result && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    ✓ Generation completed successfully!
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isGenerating || !selectedImage || !prompt}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Generating...
                      </>
                    ) : (
                      "✨ Generate"
                    )}
                  </button>

                  {isGenerating && (
                    <button
                      type="button"
                      onClick={abort}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Abort
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <GenerationHistory
                onRestore={handleRestore}
                refreshTrigger={refreshHistory}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
