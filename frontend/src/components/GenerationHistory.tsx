"use client";

import { useEffect, useState } from "react";
import { generationsAPI, Generation } from "@/lib/api";
import Image from "next/image";

interface GenerationHistoryProps {
  onRestore: (generation: Generation) => void;
  refreshTrigger?: number;
}

export default function GenerationHistory({
  onRestore,
  refreshTrigger,
}: GenerationHistoryProps) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    loadGenerations();
  }, [refreshTrigger]);

  const loadGenerations = async () => {
    try {
      const data = await generationsAPI.getRecent(5);
      setGenerations(data);
    } catch (error) {
      console.error("Failed to load generations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4"
          >
            <div className="flex gap-4">
              <div className="relative w-20 h-20 rounded-lg bg-white/10 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-1/3" />
              </div>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        ))}
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-white/5 p-6 rounded-full border border-white/10">
            <svg
              className="w-12 h-12 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <p className="text-slate-400 text-sm">No generations yet</p>
        <p className="text-slate-500 text-xs mt-1">
          Create your first masterpiece! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            {generations.length} Recent
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {generations.map((gen: any, index: number) => (
          <button
            key={gen.id}
            onClick={() => onRestore(gen)}
            className="group relative w-full flex gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 rounded-xl transition-all duration-300 text-left overflow-hidden hover:scale-[1.02] animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/5 to-fuchsia-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Generated Image Thumbnail */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group-hover:border-violet-500/30 transition-colors duration-300">
              <Image
                src={`${url}${gen.image_url}`}
                alt={gen.prompt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay with restore icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white drop-shadow-lg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>

              {/* Style badge */}
              <div className="absolute top-1 right-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium text-white uppercase tracking-wide">
                {gen.style === "realistic" && "📸"}
                {gen.style === "artistic" && "🎨"}
                {gen.style === "anime" && "✨"}
                {gen.style === "sketch" && "✏️"}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <p className="font-medium text-sm text-slate-200 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-300">
                  {gen.prompt}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-slate-400 capitalize">
                    {gen.style}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-2">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDate(gen.created_at)}
              </div>
            </div>

            {/* Arrow indicator */}
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-4 h-4 text-violet-400 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
