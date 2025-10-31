"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/studio");
    } else {
      setIsChecking(false);
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full animate-pulse" />
          <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-violet-500 border-r-fuchsia-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div
          className={`text-center space-y-8 py-20 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium mb-6 animate-fade-in-down">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Powered by Advanced AI Technology
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent animate-gradient">
              AI Studio
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Transform your fashion images with the power of AI. Upload,
            customize, and generate{" "}
            <span className="text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text font-semibold">
              stunning results
            </span>{" "}
            in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-in-up animation-delay-400">
            <Link
              href="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started
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
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-fuchsia-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              href="/login"
              className="group px-8 py-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Sign In
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div
          className={`grid md:grid-cols-3 gap-6 mt-32 transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {[
            {
              icon: "🖼️",
              title: "Easy Upload",
              description:
                "Drag and drop your images or click to upload. Supports JPEG and PNG up to 10MB.",
              gradient: "from-blue-600/20 to-cyan-600/20",
              border: "from-blue-500/50 to-cyan-500/50",
              delay: "animation-delay-0",
            },
            {
              icon: "✨",
              title: "AI Generation",
              description:
                "Choose from multiple styles: realistic, artistic, anime, and sketch variations.",
              gradient: "from-violet-600/20 to-fuchsia-600/20",
              border: "from-violet-500/50 to-fuchsia-500/50",
              delay: "animation-delay-200",
            },
            {
              icon: "📜",
              title: "History",
              description:
                "Access your recent generations anytime. Restore and modify previous creations.",
              gradient: "from-fuchsia-600/20 to-pink-600/20",
              border: "from-fuchsia-500/50 to-pink-500/50",
              delay: "animation-delay-400",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`group feature-card ${feature.delay} relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
              />

              {/* Animated border gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.border} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`}
              />

              <div className="relative z-10">
                <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div
          className={`mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {[
            { value: "50K+", label: "Images Generated" },
            { value: "10K+", label: "Active Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "<5s", label: "Generation Time" },
          ].map((stat, index) => (
            <div key={index} className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm md:text-base group-hover:text-slate-300 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
