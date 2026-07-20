"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { extractHeadings } from "@/helper/helper";

/**
 * Sticky Table of Contents
 * - Parses h2/h3 headings from Contentful rich text JSON
 * - Highlights the current section using IntersectionObserver
 * - Scrollable list — no fixed height cap
 * - Smooth scroll on click with sticky-header offset
 */
export default function TableOfContents({ richTextJson }) {
  const [activeId, setActiveId] = useState("");
  const [isOpen,   setIsOpen]   = useState(true);
  const observerRef  = useRef(null);
  const headingsRef  = useRef([]);

  const headings = extractHeadings(richTextJson);

  // ── Helper: get the real sticky header height at runtime ──────
  const getHeaderOffset = useCallback(() => {
    // Measure the actual <header> element so any layout changes
    // (ticker bar visible/hidden, scroll-shrink) are accounted for.
    const header = document.querySelector("header");
    const headerH = header ? header.getBoundingClientRect().height : 64;
    return headerH + 24; // +24px breathing room so heading isn't flush with the nav
  }, []);

  // ── Active section tracking ──────────────────────────────────
  useEffect(() => {
    if (!headings.length) return;

    // Disconnect any previous observer
    observerRef.current?.disconnect();

    // Collect DOM nodes
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    if (!elements.length) return;

    // Store refs for manual scroll-position check
    headingsRef.current = elements;

    /**
     * Strategy:
     *  - Use IntersectionObserver with a top-only rootMargin to detect
     *    which headings have scrolled into the reading zone.
     *  - On scroll (fallback) we also manually find the last heading
     *    above the reading zone — this guarantees the last heading
     *    stays highlighted when the user is at the bottom of the article.
     */
    const findActiveFromScroll = () => {
      const offset = getHeaderOffset();
      const scrollY = window.scrollY + offset;
      let current = headingsRef.current[0]?.id || "";
      for (const el of headingsRef.current) {
        if (el.getBoundingClientRect().top + window.scrollY <= scrollY) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    observerRef.current = new IntersectionObserver(
      () => {
        // On any intersection change, recalculate from scroll position
        findActiveFromScroll();
      },
      {
        rootMargin: "-80px 0px -40% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observerRef.current.observe(el));

    // Also update on scroll for accuracy at bottom of page
    window.addEventListener("scroll", findActiveFromScroll, { passive: true });

    // Set initial active
    findActiveFromScroll();

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", findActiveFromScroll);
    };
  }, [headings.length, getHeaderOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Smooth scroll — measures real header height at click time ─
  const handleClick = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    // Measure the actual header height right now (may differ desktop vs mobile)
    const offset = getHeaderOffset();
    const elTop  = el.getBoundingClientRect().top + window.scrollY;
    const target = elTop - offset;

    window.scrollTo({ top: target, behavior: "smooth" });
    setActiveId(id);

    // Update URL hash without causing a native jump
    if (typeof history !== "undefined" && history.pushState) {
      history.pushState(null, "", `#${id}`);
    }
  }, [getHeaderOffset]);

  if (!headings.length) return null;

  return (
    <nav
      className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700/50 shadow-card overflow-hidden"
      aria-label="Table of contents"
    >
      {/* ── Header / Toggle ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors"
        aria-expanded={isOpen}
        aria-controls="toc-list"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary-500 rounded-full flex-shrink-0" />
          <span className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-wider">
            Table of Contents
          </span>
          <span className="text-xs text-secondary-400 dark:text-secondary-500 font-normal ml-1">
            ({headings.length})
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-secondary-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── TOC List ── */}
      <div
        id="toc-list"
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        style={isOpen ? {} : { maxHeight: 0 }}
      >
        {/* Scrollable container — max 70vh so it never overflows the sidebar */}
        <div className="overflow-y-auto max-h-[70vh] px-4 pb-4">
          <ul className="space-y-0.5" role="list">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              const isH3 = heading.level === 3;

              return (
                <li key={heading.id} role="listitem">
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={[
                      "flex items-start gap-2 py-1.5 leading-snug transition-all duration-150 rounded-r",
                      isH3 ? "pl-6 text-xs" : "pl-3 text-sm",
                      "border-l-2",
                      isActive
                        ? "border-primary-500 text-primary-600 dark:text-primary-400 font-semibold bg-primary-50/60 dark:bg-primary-900/10"
                        : "border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:border-secondary-300 dark:hover:border-secondary-500",
                    ].join(" ")}
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className={isActive ? "" : isH3 ? "pl-3.5" : "pl-0"}>
                      {heading.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
