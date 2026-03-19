"use client";
import React, { useMemo, useState } from "react";

const emailRegex =
  // Simple, pragmatic validation (not RFC-perfect).
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const isValid = useMemo(() => {
    if (!values.firstName.trim()) return false;
    if (!values.lastName.trim()) return false;
    if (!emailRegex.test(values.email.trim())) return false;
    const phone = values.phone.replace(/\s+/g, "");
    if (phone.length < 7) return false;
    if (!values.message.trim()) return false;
    return true;
  }, [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) {
      setStatus({
        type: "error",
        message:
          "Please fill out all fields with valid details before sending.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    // No backend wired yet; show a friendly success message.
    await new Promise((r) => setTimeout(r, 600));

    setSubmitting(false);
    setStatus({
      type: "success",
      message: `Thanks ${values.firstName}! Your message has been received.`,
    });
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <main className="bg-[#f9f9f7] dark:bg-gray-900 transition-all duration-500 ease-in-out min-h-screen w-full py-6 sm:py-8 md:py-12 px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 2xl:px-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Contact Us
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Have a question or want to collaborate? Send us your message.
          </p>
        </header>

        <section
          className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-md dark:shadow-gray-900 overflow-hidden"
          aria-label="Contact form"
        >
          <div className="p-5 sm:p-7 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={values.firstName}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200"
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={values.lastName}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200"
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={values.email}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={values.phone}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200"
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={values.message}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200 resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              {status.type !== "idle" && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-green-50/70 border-green-200/80 text-green-700 dark:bg-green-900/20 dark:border-green-900/40 dark:text-green-300"
                      : "bg-red-50/70 border-red-200/80 text-red-700 dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-300"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {status.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setValues({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      message: "",
                    });
                    setStatus({ type: "idle", message: "" });
                  }}
                  className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 font-semibold bg-transparent border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}