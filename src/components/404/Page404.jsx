"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Page404 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-light_blue dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      {/* Animated Background Elements */}
      <div
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 153, 255, 0.3), transparent 50%)`,
        }}
      />



      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* Animated 404 Number */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1
            className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] xl:text-[16rem] font-bold leading-none select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span
              className={`inline-block transition-all duration-300 ${
                isHovered
                  ? "text-light_blue dark:text-blue-400  rotate-6"
                  : "text-gray-800 dark:text-gray-200"
              }`}
              style={{
                textShadow: isHovered
                  ? "0 0 30px rgba(0, 153, 255, 0.5)"
                  : "none",
              }}
            >
              4
            </span>
            <span
              className={`inline-block transition-all duration-300 delay-75 ${
                isHovered
                  ? "text-dark_blue dark:text-blue-500  -rotate-6"
                  : "text-gray-800 dark:text-gray-200"
              }`}
              style={{
                textShadow: isHovered
                  ? "0 0 30px rgba(0, 0, 255, 0.5)"
                  : "none",
              }}
            >
              0
            </span>
            <span
              className={`inline-block transition-all duration-300 delay-150 ${
                isHovered
                  ? "text-light_blue dark:text-blue-400 rotate-6"
                  : "text-gray-800 dark:text-gray-200"
              }`}
              style={{
                textShadow: isHovered
                  ? "0 0 30px rgba(0, 153, 255, 0.5)"
                  : "none",
              }}
            >
              4
            </span>
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 sm:mb-10 md:mb-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 animate-fade-in">
            Oops! Page Not Found
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have taken off to another
            destination. Don&apos;t worry, we&apos;ll help you get back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10">
          <Link
            href="/"
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-light_blue hover:bg-dark_blue dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform  hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-600/50 active:scale-95 w-full sm:w-auto min-w-[200px] text-center"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 transition-transform duration-300 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-light_blue to-dark_blue rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* <Link
            href="/"
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-light_blue dark:border-blue-600 text-light_blue dark:text-blue-400 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform  hover:bg-light_blue hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-600/30 active:scale-95 w-full sm:w-auto min-w-[200px] text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 transition-transform duration-300 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Blog
            </span>
          </Link> */}
        </div>

        {/* Quick Links */}
        <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-gray-300 dark:border-gray-700">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-4">
            Quick Links:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-light_blue dark:hover:text-blue-500 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Home
            </Link>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <Link
              href="/"
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-light_blue dark:hover:text-blue-500 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Blog
            </Link>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <Link
              href="/"
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-light_blue dark:hover:text-blue-500 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              About
            </Link>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <Link
              href="/"
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-light_blue dark:hover:text-blue-500 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Back Button (Mobile Friendly) */}
        <div className="mt-6 sm:mt-8">
          <button
            onClick={() => window.history.back()}
            className="text-sm sm:text-base text-gray-500 dark:text-gray-500 hover:text-light_blue dark:hover:text-blue-400 transition-colors duration-200 flex items-center justify-center gap-2 mx-auto group"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>

   
    </div>
  );
};

export default Page404;
