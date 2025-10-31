"use client";

import { useState, useRef } from "react";
import { generationsAPI, Generation } from "@/lib/api";
import { AxiosError } from "axios";
import axios from "axios";

interface GenerateParams {
  image: File;
  prompt: string;
  style: string;
}

export const useGenerate = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Generation | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = async (
    params: GenerateParams,
    attemptNumber = 0
  ): Promise<Generation | null> => {
    setIsGenerating(true);
    setError(null);
    setRetryCount(attemptNumber);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("image", params.image);
    formData.append("prompt", params.prompt);
    formData.append("style", params.style);

    try {
      const generation = await generationsAPI.create(
        formData,
        abortControllerRef.current.signal
      );
      setResult(generation);
      setIsGenerating(false);
      setRetryCount(0);
      return generation;
    } catch (err) {
      if (axios.isCancel(err)) {
        setError("Generation cancelled");
        setIsGenerating(false);
        return null;
      }

      const axiosError = err as AxiosError<{
        error: string;
        retryable?: boolean;
      }>;
      const errorMessage =
        axiosError.response?.data?.error || "Failed to generate image";
      const isRetryable = axiosError.response?.data?.retryable || false;

      if (isRetryable && attemptNumber < 3) {
        const delay = Math.pow(2, attemptNumber) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return generate(params, attemptNumber + 1);
      }

      setError(errorMessage);
      setIsGenerating(false);
      return null;
    }
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setError("Generation cancelled");
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setError(null);
    setResult(null);
    setRetryCount(0);
  };

  return {
    generate,
    abort,
    reset,
    isGenerating,
    error,
    result,
    retryCount,
  };
};
