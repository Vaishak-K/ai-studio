"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGenerate } from "@/hooks/useGenerate";
import ImageUpload from "@/components/ImageUpload";
import GenerationHistory from "@/components/GenerationHistory";

const STYLES = ["realistic", "artistic", "anime", "sketch"] as const;

const STYLE_EMOJIS = {
  realistic: "📸",
  artistic: "🎨",
  anime: "✨",
  sketch: "✏️",
};

export default function StudioPage() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { generate, abort, isGenerating, error, result, retryCount } =
    useGenerate();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<(typeof STYLES)[number]>("realistic");
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated) {
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !prompt) return;

    const result = await generate({ image: selectedImage, prompt, style });
    if (result) {
      setPrompt("");
      setStyle("realistic");
      setSelectedImage(null);
      setRefreshHistory((prev) => prev + 1);
      setRestoredImageUrl(null);
    }
  };

  const handleRestore = (generation: any) => {
    setPrompt(generation.prompt);
    setStyle(generation.style as (typeof STYLES)[number]);
    setRestoredImageUrl(generation.original_image_url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full animate-pulse" />
            <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-violet-500 border-r-fuchsia-500 mx-auto" />
          </div>
          <p className="text-slate-400 mt-6 text-lg">Loading Studio...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className={`flex justify-between items-center transition-all duration-1000 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur opacity-50" />
                <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-600 p-2 rounded-xl">
                  <span className="text-2xl">🎨</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  AI Studio
                </h1>
                <p className="text-xs text-slate-400">Create amazing AI art</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="group px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 group-hover:rotate-12 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <form onSubmit={handleGenerate} className="space-y-6">
                  <ImageUpload
                    onImageSelect={setSelectedImage}
                    selectedImage={selectedImage}
                    restoredImageUrl={restoredImageUrl}
                  />

                  {/* Prompt */}
                  <div>
                    <label
                      htmlFor="prompt"
                      className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"
                    >
                      <span className="text-lg">💬</span>
                      Your Prompt
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur opacity-0 group-hover/input:opacity-20 transition-opacity duration-500" />
                      <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        required
                        rows={4}
                        maxLength={500}
                        disabled={isGenerating}
                        className="relative w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-slate-500 outline-none"
                        placeholder="Describe your vision in detail... e.g., 'A futuristic city at sunset with flying cars'"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-slate-500">
                        Be specific for better results
                      </p>
                      <p className="text-xs text-slate-400">
                        {prompt.length}/500
                      </p>
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <span className="text-lg">🎭</span>
                      Choose Style
                    </label>

                    {/* Hidden select for E2E tests */}
                    <select
                      id="style"
                      value={style}
                      onChange={(e) =>
                        setStyle(e.target.value as (typeof STYLES)[number])
                      }
                      disabled={isGenerating}
                      className="sr-only"
                      aria-label="Style selection"
                    >
                      {STYLES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    {/* Visual button selection */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {STYLES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStyle(s)}
                          disabled={isGenerating}
                          data-testid={`style-${s}`}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                            style === s
                              ? "border-violet-500 bg-violet-500/10"
                              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-3xl mb-2">{STYLE_EMOJIS[s]}</div>
                          <div className="text-sm font-medium capitalize">
                            {s}
                          </div>
                          {style === s && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-slide-in">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-red-400 font-medium text-sm">
                            {error}
                          </p>
                          {retryCount > 0 && (
                            <p className="text-red-400/70 text-xs mt-1">
                              Retry attempt {retryCount}/3
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {result && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 animate-slide-in">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
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
                        </div>
                        <span className="text-green-400 font-medium text-sm">
                          Generation completed successfully! ✨
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isGenerating || !selectedImage || !prompt}
                      className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isGenerating ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Generating Magic...
                          </>
                        ) : (
                          <>
                            <span className="text-lg">✨</span>
                            Generate
                            <svg
                              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-fuchsia-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    {isGenerating && (
                      <button
                        type="button"
                        onClick={abort}
                        className="px-6 py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Abort
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">📜</span>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                      History
                    </h2>
                  </div>
                  <GenerationHistory
                    onRestore={handleRestore}
                    refreshTrigger={refreshHistory}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
