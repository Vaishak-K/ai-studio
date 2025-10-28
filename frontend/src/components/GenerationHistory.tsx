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
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all text-left"
          >
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={`http://localhost:3001${gen.image_url}`}
                alt={gen.prompt}
                fill
                className="object-cover rounded-lg"
              />
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
