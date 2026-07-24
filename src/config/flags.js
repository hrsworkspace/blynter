/**
 * ─────────────────────────────────────────────────────────────
 * BLYNTER — FEATURE FLAGS & SITE CONFIG
 * ─────────────────────────────────────────────────────────────
 *
 * Central control file for toggling site-wide features.
 * Change a flag here → it applies across the entire project.
 *
 * Usage:
 *   import { FLAGS, ADS_CONFIG, SITE } from "@/config/flags";
 *   if (FLAGS.ENABLE_ADS) { ... }
 * ─────────────────────────────────────────────────────────────
 */

// ── Ads ──────────────────────────────────────────────────────
export const FLAGS = {
  /** Master switch — false disables ALL ad units site-wide */
  ENABLE_ADS: false,

  /** Show newsletter signup forms (header, homepage, sidebar, footer) */
  ENABLE_NEWSLETTER: true,

  /** Show reading progress bar at top of page */
  ENABLE_READING_PROGRESS: true,

  /** Show Table of Contents on article pages */
  ENABLE_TOC: true,

  /** Show trending news ticker in header top bar */
  ENABLE_TICKER: true,

  /** Enable dark mode toggle */
  ENABLE_DARK_MODE: true,

  /** Show "Popular This Week" sidebar on homepage */
  ENABLE_POPULAR_SIDEBAR: true,

  /** Show related articles section at bottom of article page */
  ENABLE_RELATED_ARTICLES: true,

  /** Show author bio card on article pages */
  ENABLE_AUTHOR_BIO: true,

  /** Show social share buttons on article pages */
  ENABLE_SOCIAL_SHARE: true,

  /** Show FAQ section on article pages */
  ENABLE_FAQ: true,
};

// ── Ad Slot IDs ───────────────────────────────────────────────
export const ADS_CONFIG = {
  /** Your AdSense publisher ID */
  PUBLISHER_ID: "ca-pub-2234384779164146",

  /** Individual ad slot IDs — replace with real slot IDs from AdSense dashboard */
  SLOTS: {
    HOMEPAGE_MID: "homepage-mid",
    HOMEPAGE_SIDEBAR: "homepage-sidebar",
    HOMEPAGE_BOTTOM: "homepage-bottom",
    ARTICLE_TOP: "article-top",
    ARTICLE_MID: "article-mid",
    ARTICLE_BOTTOM: "article-bottom",
    SIDEBAR_TOP: "sidebar-top",
    SIDEBAR_BOTTOM: "sidebar-bottom",
  },
};

// ── Site Info ─────────────────────────────────────────────────
export const SITE = {
  NAME: "Blynter",
  TAGLINE: "Sports Stories, Movie Reviews & Entertainment",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com",
  TWITTER: "@blynter",
  PUBLISHER_ID: ADS_CONFIG.PUBLISHER_ID,
};

// ── Categories ────────────────────────────────────────────────
export const CATEGORIES = [
  { name: "Cricket", href: "/sports/cricket", emoji: "🏏", count: "48" },
  { name: "Finanace", href: "/finance", emoji: "⚽", count: "36" },
  // { name: "Bollywood", href: "/entertainment/bollywood", emoji: "🎭", count: "52" },
  // { name: "Hollywood", href: "/entertainment/hollywood", emoji: "⭐", count: "44" },
  // { name: "Sports", href: "/sports", emoji: "🏆", count: "84" },
  // { name: "Entertainment", href: "/entertainment", emoji: "🎬", count: "96" },
];
