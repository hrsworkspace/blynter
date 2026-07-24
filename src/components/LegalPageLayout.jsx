'use client';

import { renderRichText } from '@/helper/helper';
import React, { useMemo } from 'react';

/** Avoid two <h1>s: page title uses h1, first document heading becomes h2. */
function demoteHeadingOnes(json) {
  if (!json?.content) return json;
  return {
    ...json,
    content: json.content.map((node) =>
      node?.nodeType === 'heading-1'
        ? { ...node, nodeType: 'heading-2' }
        : node
    ),
  };
}

export default function LegalPageLayout({ data, defaultTitle, defaultSubtitle }) {
  const title = data?.pageName || defaultTitle;
  const richJson = data?.description?.json;

  const documentJson = useMemo(
    () => (richJson ? demoteHeadingOnes(richJson) : null),
    [richJson]
  );

  const hasBody = Boolean(documentJson?.content?.length);

  return (
    <main className="bg-[#f9f9f7] dark:bg-gray-900 transition-all duration-500 ease-in-out min-h-screen w-full py-6 sm:py-8 md:py-12 px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 2xl:px-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {defaultSubtitle && (
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl">
              {defaultSubtitle}
            </p>
          )}
        </header>

        <article
          className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-md dark:shadow-gray-900 overflow-hidden"
          aria-label={`${title} content`}
        >
          <div className="p-5 sm:p-7 lg:p-8">
            {hasBody ? (
              <section className="prose prose-lg max-w-none dark:prose-invert">
                <div className="text-gray-800 dark:text-gray-200 [&_p]:whitespace-pre-line [&_h2:first-child]:mt-0">
                  {renderRichText(documentJson)}
                </div>
              </section>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No content is available right now. Please try again later.
              </p>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
