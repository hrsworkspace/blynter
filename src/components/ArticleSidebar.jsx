"use client";
import Link from "next/link";
import { Mail } from "lucide-react";
import BlogCard from "./BlogCard";
import { useState } from "react";
import { FLAGS, ADS_CONFIG, CATEGORIES } from "@/config/flags";


export default function ArticleSidebar({ popularPosts = [], richTextJson }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <aside className="space-y-6" aria-label="Article sidebar">

      {/* ── AdSense: Top of sidebar ── */}
      {FLAGS.ENABLE_ADS && (
        <div className="ad-container min-h-[250px] flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADS_CONFIG.PUBLISHER_ID}
            data-ad-slot={ADS_CONFIG.SLOTS.SIDEBAR_TOP}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}

      {/* ── Newsletter ── */}
      {FLAGS.ENABLE_NEWSLETTER && (
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-primary-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary-200">Newsletter</span>
          </div>
          <h3 className="font-heading text-lg font-bold mb-1 leading-snug">
            Get the best stories in your inbox
          </h3>
          <p className="text-primary-200 text-xs mb-4 leading-relaxed">
            Weekly digest of the top personal finance tips, investing insights, and money-saving strategies. No spam.
          </p>
          {subscribed ? (
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <span className="text-sm font-semibold">🎉 You&apos;re subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/20 placeholder-primary-200 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/30 transition-all"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-white text-primary-700 rounded-xl text-sm font-bold hover:bg-primary-50 transition-colors duration-150"
              >
                Subscribe Free →
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── Popular Posts ── */}
      {popularPosts.length > 0 && (
        <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700/50 shadow-card p-5">
          <div className="section-header mb-4">
            <div className="w-1 h-5 bg-red-500 rounded-full" />
            <h3 className="section-title text-base">Popular Articles</h3>
          </div>
          <div className="space-y-4">
            {popularPosts.slice(0, 5).map((post, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-2xl font-black text-secondary-200 dark:text-secondary-600 leading-none mt-0.5 w-6 text-center shrink-0">
                  {idx + 1}
                </span>
                <BlogCard blog={post} variant="mini" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Categories ── */}
      {/* <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700/50 shadow-card p-5">
        <div className="section-header mb-4">
          <div className="w-1 h-5 bg-accent-500 rounded-full" />
          <h3 className="section-title text-base">Browse Categories</h3>
        </div>
        <ul className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <li key={cat.name}>
              <Link
                href={cat.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-secondary-700 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-150 group"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{cat.emoji}</span>
                  {cat.name}
                </span>
                <span className="text-xs bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 px-2 py-0.5 rounded-full group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  {cat.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div> */}

      {/* ── AdSense: Bottom of sidebar ── */}
      {FLAGS.ENABLE_ADS && (
        <div className="ad-container min-h-[250px] flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADS_CONFIG.PUBLISHER_ID}
            data-ad-slot={ADS_CONFIG.SLOTS.SIDEBAR_BOTTOM}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}

      {/* ── Stay Connected ── */}
      <div className="bg-secondary-900 dark:bg-secondary-950 rounded-2xl p-5 text-white">
        <h3 className="font-heading text-base font-bold mb-4 text-white">Follow Us</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Facebook", color: "hover:bg-blue-600", icon: "📘" },
            { name: "Twitter", color: "hover:bg-sky-500", icon: "🐦" },
            { name: "Instagram", color: "hover:bg-pink-600", icon: "📸" },
            { name: "RSS Feed", color: "hover:bg-orange-500", icon: "📡" },
          ].map((s) => (
            <a
              key={s.name}
              href="#"
              className={`flex items-center gap-2 px-3 py-2 bg-secondary-800 dark:bg-secondary-900 ${s.color} rounded-xl text-xs font-medium transition-colors duration-150 text-secondary-300 hover:text-white`}
            >
              <span>{s.icon}</span>
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
