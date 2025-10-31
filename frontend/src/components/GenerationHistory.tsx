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
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Generations
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-32 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No generations yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Recent Generations
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {generations.map((gen: any) => (
          <button
            key={gen.id}
            onClick={() => onRestore(gen)}
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all text-left group"
          >
            {/* UPDATED: Show generated image thumbnail */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={`${url}${gen.image_url}`}
                alt={gen.prompt}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{gen.prompt}</p>
              <p className="text-sm text-gray-500 capitalize">{gen.style}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(gen.created_at).toLocaleString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
