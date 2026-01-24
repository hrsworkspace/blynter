"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeProvider";
import { motion, useScroll } from "motion/react";
import { HiOutlineMoon } from "react-icons/hi";
import { LuSun } from "react-icons/lu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const themeDropdownDesktopRef = useRef(null);
  const themeDropdownMobileRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  console.log("theme", theme);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Calculate scroll progress
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const progress = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const desktopContains = themeDropdownDesktopRef.current?.contains(
        event.target
      );
      const mobileContains = themeDropdownMobileRef.current?.contains(
        event.target
      );

      if (isThemeDropdownOpen && !desktopContains && !mobileContains) {
        setIsThemeDropdownOpen(false);
      }
    };

    if (isThemeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isThemeDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getThemeIcon = () => {
    if (theme === "light") {
      return <LuSun size={20} className="text-orange-400" />;
    } else if (theme === "dark") {
      return (
        <HiOutlineMoon size={20} className="text-gray-700 dark:text-gray-400" />
      );
    } else {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-light_blue/70 dark:bg-gray-950/70 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20"
          : "bg-light_blue dark:bg-gray-950"
      }`}>
      <nav
        className="w-full mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
              onClick={closeMenu}
              aria-label="Home">
              {/* Blog */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex md:items-center md:space-x-8 list-none">
            <li>
              <Link
                href="/"
                className="text-gray hover:text-blue-600 dark:hover:text-blue-500 font-medium transition-colors duration-200 px-3 py-2">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-gray hover:text-blue-600 dark:hover:text-blue-500 font-medium transition-colors duration-200 px-3 py-2">
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-gray hover:text-blue-600 dark:hover:text-blue-500 font-medium transition-colors duration-200 px-3 py-2">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-gray hover:text-blue-600 dark:hover:text-blue-500 font-medium transition-colors duration-200 px-3 py-2">
                Contact
              </Link>
            </li>

            {/* Theme Toggle */}
            <li className="relative" ref={themeDropdownDesktopRef}>
              <button
                onClick={() => {
                  if (theme === "light") {
                    setTheme("dark");
                  } else {
                    setTheme("light");
                  }
                }}
                className={`flex items-center justify-center p-2 rounded-full border-2 border-orange-400 dark:border-blue-600 transition-colors duration-200 ${
                  theme === "light"
                    ? "text-orange-400 bg-orange-50 hover:bg-orange-100"
                    : "text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label="Theme selector">
                {getThemeIcon()}
              </button>

              {/* {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => {
                        setTheme("light");
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                        theme === "light"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-500"
                          : "text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      } transition-colors duration-200`}
                      role="menuitem">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span>Light</span>
                      {theme === "light" && (
                        <svg
                          className="w-4 h-4 ml-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTheme("dark");
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                        theme === "dark"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-500"
                          : "text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      } transition-colors duration-200`}
                      role="menuitem">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                      <span>Dark</span>
                      {theme === "dark" && (
                        <svg
                          className="w-4 h-4 ml-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTheme("system");
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                        theme === "system"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-500"
                          : "text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      } transition-colors duration-200`}
                      role="menuitem">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>System</span>
                      {theme === "system" && (
                        <svg
                          className="w-4 h-4 ml-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )} */}
            </li>
          </ul>

          {/* Mobile menu button and theme selector */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme button for mobile */}
            <div className="relative" ref={themeDropdownMobileRef}>
              <button
                onClick={() => {
                  if (theme === "light") {
                    setTheme("dark");
                  } else {
                    setTheme("light");
                  }
                }}
                className={`inline-flex items-center rounded-full justify-center p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                  theme === "light"
                    ? "text-orange-400 bg-orange-50 hover:bg-orange-100"
                    : "text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label="Theme selector">
                {getThemeIcon()}
              </button>

              {/* {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => {
                        setTheme("light");
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                        theme === "light"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-500"
                          : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } transition-colors duration-200`}
                      role="menuitem">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span>Light</span>
                      {theme === "light" && (
                        <svg
                          className="w-4 h-4 ml-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTheme("dark");
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                        theme === "dark"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-500"
                          : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } transition-colors duration-200`}
                      role="menuitem">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                      <span>Dark</span>
                      {theme === "dark" && (
                        <svg
                          className="w-4 h-4 ml-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTheme("system");
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                        theme === "system"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-500"
                          : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } transition-colors duration-200`}
                      role="menuitem">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>System</span>
                      {theme === "system" && (
                        <svg
                          className="w-4 h-4 ml-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )} */}
            </div>

            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              aria-controls="mobile-menu">
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <section
          id="mobile-menu"
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
          aria-label="Mobile navigation menu">
          <ul className="px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 list-none">
            <li>
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200"
                onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200"
                onClick={closeMenu}>
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200"
                onClick={closeMenu}>
                About
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors duration-200"
                onClick={closeMenu}>
                Contact
              </Link>
            </li>
          </ul>
        </section>
      </nav>

      {/* Scroll Progress Bar */}
      {/* <div 
        className="absolute bottom-0 left-0 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 transition-all duration-150 ease-out"
        style={{ 
          width: `${scrollProgress}%`,
          boxShadow: scrollProgress > 0 ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
        }}
      /> */}
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          // top: 0,
          borderRadius: 50,
          left: 0,
          right: 0,
          height: 5,
          originX: 0,
          backgroundColor: "#ff0088",
        }}
      />
    </header>
  );
}
