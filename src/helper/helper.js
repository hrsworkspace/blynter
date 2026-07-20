import Image from "next/image";
import Link from "next/link";

/* ─── URL helpers ───────────────────────────────────── */
export const textToSlug = (htmlString) => {
  return String(htmlString || "")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

/* ─── Reading time ──────────────────────────────────── */
export const estimateReadingTime = (json) => {
  try {
    if (!json?.content) return 1;
    const extractText = (nodes) => {
      if (!Array.isArray(nodes)) return "";
      return nodes
        .map((node) => {
          if (node.nodeType === "text") return node.value || "";
          if (node.content) return extractText(node.content);
          return "";
        })
        .join(" ");
    };
    const text = extractText(json.content);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(wordCount / 200));
  } catch {
    return 1;
  }
};

/* ─── Date formatter ────────────────────────────────── */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/* ─── Category color map ────────────────────────────── */
export const getCategoryColor = (category) => {
  const map = {
    sports:        { bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-300" },
    cricket:       { bg: "bg-green-100 dark:bg-green-900/30",  text: "text-green-700 dark:text-green-300" },
    football:      { bg: "bg-orange-100 dark:bg-orange-900/30",text: "text-orange-700 dark:text-orange-300" },
    entertainment: { bg: "bg-purple-100 dark:bg-purple-900/30",text: "text-purple-700 dark:text-purple-300" },
    bollywood:     { bg: "bg-pink-100 dark:bg-pink-900/30",    text: "text-pink-700 dark:text-pink-300" },
    hollywood:     { bg: "bg-red-100 dark:bg-red-900/30",      text: "text-red-700 dark:text-red-300" },
  };
  const key = String(category || "").toLowerCase();
  return map[key] || { bg: "bg-primary-100 dark:bg-primary-900/30", text: "text-primary-700 dark:text-primary-300" };
};

/* ─── Extract plain text from rich text JSON ────────── */
export const extractPlainText = (json, maxLength = 200) => {
  try {
    if (!json?.content) return "";
    const extractText = (nodes) => {
      if (!Array.isArray(nodes)) return "";
      return nodes
        .map((node) => {
          if (node.nodeType === "text") return node.value || "";
          if (node.content) return extractText(node.content);
          return "";
        })
        .join(" ");
    };
    const text = extractText(json.content).trim();
    return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + "…" : text;
  } catch {
    return "";
  }
};

/* ─── Rich text helpers ─────────────────────────────── */
const renderTextContent = (content, keyPrefix = "") => {
  if (!content || !Array.isArray(content)) return null;

  return content.map((node, index) => {
    const key = `${keyPrefix}-${index}`;

    if (node.nodeType === "text") {
      const marks = node.marks || [];
      let text = node.value;
      marks.forEach((mark) => {
        if (mark.type === "bold")   text = <strong key={`${key}-strong`}>{text}</strong>;
        if (mark.type === "italic") text = <em key={`${key}-em`}>{text}</em>;
        if (mark.type === "underline") text = <u key={`${key}-u`}>{text}</u>;
      });
      return text;
    }

    if (node.nodeType === "hyperlink") {
      const href = node.data?.uri || "#";
      const linkText = node.content?.map((n) => (n.nodeType === "text" ? n.value : "")).join("") || "";
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      if (isExternal) {
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 underline underline-offset-2 font-medium transition-colors duration-200"
          >
            {linkText}
          </a>
        );
      }
      return (
        <Link
          key={key}
          href={href}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 underline underline-offset-2 font-medium transition-colors duration-200"
        >
          {linkText}
        </Link>
      );
    }
    return null;
  });
};

// Slugify heading text for anchor IDs
// Tracks seen IDs within a render to avoid duplicates
let _seenIds = new Map();

const headingId = (content) => {
  const text = (Array.isArray(content) ? content : [])
    .map((n) => (n.nodeType === "text" ? n.value : ""))
    .join("")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  if (!text) return "heading";
  // Deduplicate: if we've seen this id before, append -2, -3, ...
  const count = (_seenIds.get(text) || 0) + 1;
  _seenIds.set(text, count);
  return count === 1 ? text : `${text}-${count}`;
};

export const renderRichText = (json, links = {}) => {
  if (!json || !json.content) return null;
  // Reset deduplication map for each fresh render
  _seenIds = new Map();

  const assetBlocks = links?.assets?.block || [];
  const assetMap = new Map(assetBlocks.map((asset) => [asset?.sys?.id, asset]));
  const getAssetById = (id) => (id ? assetMap.get(id) || null : null);

  return json.content.map((node, index) => {
    if (node.nodeType === "paragraph") {
      const hasVisibleContent = node.content?.some((child) => {
        if (child.nodeType === "text") return Boolean(child.value?.trim());
        if (child.nodeType === "hyperlink") return true;
        return false;
      });
      if (!hasVisibleContent) return null;
      return (
        <p key={index} className="mb-6 text-secondary-700 dark:text-secondary-300 leading-relaxed text-[1.0625rem]">
          {renderTextContent(node.content, `p-${index}`)}
        </p>
      );
    }

    if (node.nodeType === "heading-1") {
      const id = headingId(node.content);
      return (
        <h1 key={index} id={id} className="font-heading text-3xl font-bold mb-4 mt-8 text-secondary-900 dark:text-white scroll-mt-24">
          {renderTextContent(node.content, `h1-${index}`)}
        </h1>
      );
    }

    if (node.nodeType === "heading-2") {
      const id = headingId(node.content);
      return (
        <h2 key={index} id={id} className="font-heading text-2xl font-bold mb-3 mt-10 text-secondary-900 dark:text-white scroll-mt-24 pb-2 border-b border-secondary-100 dark:border-secondary-800">
          {renderTextContent(node.content, `h2-${index}`)}
        </h2>
      );
    }

    if (node.nodeType === "heading-3") {
      const id = headingId(node.content);
      return (
        <h3 key={index} id={id} className="font-heading text-xl font-semibold mb-2 mt-8 text-secondary-900 dark:text-white scroll-mt-24">
          {renderTextContent(node.content, `h3-${index}`)}
        </h3>
      );
    }

    if (node.nodeType === "heading-4") {
      const id = headingId(node.content);
      return (
        <h4 key={index} id={id} className="font-heading text-lg font-semibold mb-2 mt-6 text-secondary-900 dark:text-white scroll-mt-24">
          {renderTextContent(node.content, `h4-${index}`)}
        </h4>
      );
    }

    if (node.nodeType === "unordered-list") {
      return (
        <ul key={index} className="mb-6 space-y-2 text-secondary-700 dark:text-secondary-300 pl-6" style={{ listStyleType: "disc" }}>
          {node.content?.map((listItem, li) => (
            <li key={li} className="leading-relaxed">
              {listItem.content?.map((para, pi) =>
                para.nodeType === "paragraph" ? (
                  <span key={pi}>{renderTextContent(para.content, `ul-${li}-${pi}`)}</span>
                ) : null
              )}
            </li>
          ))}
        </ul>
      );
    }

    if (node.nodeType === "ordered-list") {
      return (
        <ol key={index} className="mb-6 space-y-2 text-secondary-700 dark:text-secondary-300 pl-6 list-decimal">
          {node.content?.map((listItem, li) => (
            <li key={li} className="leading-relaxed">
              {listItem.content?.map((para, pi) =>
                para.nodeType === "paragraph" ? (
                  <span key={pi}>{renderTextContent(para.content, `ol-${li}-${pi}`)}</span>
                ) : null
              )}
            </li>
          ))}
        </ol>
      );
    }

    if (node.nodeType === "blockquote") {
      return (
        <blockquote key={index} className="my-8 pl-5 border-l-4 border-primary-500 bg-primary-50 dark:bg-secondary-800 rounded-r-xl py-4 pr-4">
          <p className="text-primary-800 dark:text-primary-200 font-medium italic text-lg leading-relaxed">
            {node.content?.map((child, ci) =>
              child.nodeType === "paragraph" ? (
                <span key={ci}>{renderTextContent(child.content, `bq-${ci}`)}</span>
              ) : null
            )}
          </p>
        </blockquote>
      );
    }

    if (node.nodeType === "hr") {
      return <hr key={index} className="my-8 border-secondary-200 dark:border-secondary-700" />;
    }

    if (node.nodeType === "embedded-asset-block") {
      const assetId = node?.data?.target?.sys?.id;
      const asset = getAssetById(assetId);
      if (!asset?.url) return null;
      const imageUrl = asset.url.startsWith("//") ? `https:${asset.url}` : asset.url;
      const altText = asset.description || asset.title || "Article image";
      const width = asset.width || 768;
      const height = asset.height || 432;
      return (
        <figure key={index} className="my-8">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={altText}
              width={width}
              height={height}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
          {altText && (
            <figcaption className="mt-2 text-center text-sm text-secondary-500 dark:text-secondary-400 italic">
              {altText}
            </figcaption>
          )}
        </figure>
      );
    }

    if (node.nodeType === "embedded-entry-inline") {
      return (
        <Link
          key={index}
          href={`/${node?.target?.slug || ""}`}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 underline underline-offset-2 font-medium transition-colors duration-200"
        >
          {node?.target?.title}
        </Link>
      );
    }

    return null;
  });
};

/* ─── Extract TOC headings from rich text ───────────── */
export const extractHeadings = (json) => {
  if (!json?.content) return [];
  const headings = [];
  const seenIds = new Map();

  json.content.forEach((node) => {
    if (["heading-2", "heading-3", "heading-4"].includes(node.nodeType)) {
      const text = (node.content || [])
        .map((n) => (n.nodeType === "text" ? n.value : ""))
        .join("")
        .trim();

      if (!text) return;

      // Must use EXACTLY the same slug logic as headingId() above
      let id = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      if (!id) id = "heading";

      // Deduplicate: same logic as _seenIds in headingId()
      const count = (seenIds.get(id) || 0) + 1;
      seenIds.set(id, count);
      const finalId = count === 1 ? id : `${id}-${count}`;

      const levelMap = { "heading-2": 2, "heading-3": 3, "heading-4": 4 };

      headings.push({
        level: levelMap[node.nodeType] || 2,
        text,
        id: finalId,
      });
    }
  });

  return headings;
};