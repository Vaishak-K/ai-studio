"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/studio");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-20">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🎨 AI Studio
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Transform your fashion images with the power of AI. Upload,
            customize, and generate stunning results in seconds.
          </p>

          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/signup"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold text-lg hover:bg-primary-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold mb-2">Easy Upload</h3>
            <p className="text-gray-600">
              Drag and drop your images or click to upload. Supports JPEG and
              PNG up to 10MB.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">AI Generation</h3>
            <p className="text-gray-600">
              Choose from multiple styles: realistic, artistic, anime, and
              sketch variations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="text-xl font-bold mb-2">History</h3>
            <p className="text-gray-600">
              Access your recent generations anytime. Restore and modify
              previous creations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
