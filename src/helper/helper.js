import Image from "next/image";
import Link from "next/link";

export const textToSlug = (htmlString) => {
    return htmlString.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

// Helper function to render text nodes and hyperlinks
const renderTextContent = (content, keyPrefix = '') => {
  if (!content || !Array.isArray(content)) return null;

  return content.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    
    if (node.nodeType === 'text') {
      const marks = node.marks || [];
      let text = node.value;

      // Apply marks (bold, italic, etc.)
      marks.forEach(mark => {
        if (mark.type === 'bold') {
          text = <strong key={`${key}-strong`}>{text}</strong>;
        } else if (mark.type === 'italic') {
          text = <em key={`${key}-em`}>{text}</em>;
        }
      });

      return text;
    }
    
    if (node.nodeType === 'hyperlink') {
      const href = node.data?.uri || '#';
      const linkText = node.content?.map((textNode, textIndex) => {
        if (textNode.nodeType === 'text') {
          return textNode.value;
        }
        return '';
      }).join('') || '';

      // Check if it's an external link
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      
      if (isExternal) {
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 underline decoration-underline font-medium duration-300 transition-colors"
            style={{ textDecoration: 'underline' }}
          >
            {linkText}
          </a>
        );
      } else {
        return (
          <Link
            key={key}
            href={href}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 underline decoration-underline font-medium duration-300 transition-colors"
            style={{ textDecoration: 'underline' }}
          >
            {linkText}
          </Link>
        );
      }
    }
    
    return null;
  });
};

   // Helper function to render rich text content
  export const renderRichText = (json, links = {}) => {
    if (!json || !json.content) return null;

    const assetBlocks = links?.assets?.block || [];
    const assetMap = new Map(
      assetBlocks.map((asset) => [asset?.sys?.id, asset])
    );

    const getAssetById = (assetId) => {
      if (!assetId) return null;
      return assetMap.get(assetId) || null;
    };

    return json?.content?.map((node, index) => {
      if (node.nodeType === 'paragraph') {
        return (
          <p key={index} className="mb-4 text-gray-700 dark:text-gray-200 leading-relaxed">
            {renderTextContent(node?.content, `p-${index}`)}
          </p>
        );
      }
      if (node?.nodeType === 'heading-1') {
        return (
          <h1 key={index} className="text-3xl font-bold mb-4 mt-8 text-gray-900 dark:text-gray-100">
            {renderTextContent(node.content, `h1-${index}`)}
          </h1>
        );
      }
      if (node?.nodeType === 'heading-2') {
        return (
          <h2 key={index} className="text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-gray-100">
            {renderTextContent(node?.content, `h2-${index}`)}
          </h2>
        );
      }
      if (node?.nodeType === 'heading-3') {
        return (
          <h3 key={index} className="text-xl font-bold mb-2 mt-4 text-gray-900 dark:text-gray-100">
            {renderTextContent(node.content, `h3-${index}`)}
          </h3>
        );
      }
      if (node?.nodeType === 'unordered-list') {
        return (
          <ul 
            key={index} 
            className="mb-4 space-y-2 text-gray-700 dark:text-gray-200"
            style={{ 
              listStyleType: 'disc', 
              listStylePosition: 'outside',
              paddingLeft: '1.5rem',
              marginLeft: '1rem'
            }}
          >
            {node?.content?.map((listItem, listIndex) => (
              <li 
                key={listIndex}
                style={{
                  paddingLeft: '0.5rem',
                  display: 'list-item'
                }}
              >
                {listItem?.content?.map((paragraph, pIndex) => {
                  if (paragraph?.nodeType === 'paragraph') {
                    return <span key={pIndex}>{renderTextContent(paragraph?.content, `ul-li-${listIndex}-p-${pIndex}`)}</span>;
                  }
                  return null;
                })}
              </li>
            ))}
          </ul>
        );
      }
      if (node?.nodeType === 'ordered-list') {
        return (
          <ol key={index} className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-200">
            {node?.content?.map((listItem, listIndex) => (
              <li key={listIndex}>
                {listItem?.content?.map((paragraph, pIndex) => {
                  if (paragraph?.nodeType === 'paragraph') {
                    return <span key={pIndex}>{renderTextContent(paragraph?.content, `ol-li-${listIndex}-p-${pIndex}`)}</span>;
                  }
                  return null;
                })}
              </li>
            ))}
          </ol>
        );
      }
      if (node?.nodeType === 'image') {
        return (
          <Image key={index} src={node?.file?.url} alt={node?.file?.title || "image"} width={node?.file?.width} height={node?.file?.height} />
        );
      }
      if (node?.nodeType === 'embedded-asset-block') {
        const assetId = node?.data?.target?.sys?.id;
        const asset = getAssetById(assetId);

        if (!asset?.url) {
          return null;
        }

        const imageUrl = asset?.url?.startsWith('//') ? `https:${asset.url}` : asset.url;
        const altText = asset?.description || asset?.title || 'Embedded asset';
        const width = asset?.width || 650;
        const height = asset?.height || 380;

        return (
          <div key={index} className="my-6 flex justify-center">
            <Image
              src={imageUrl}
              alt={altText || "image"}
              width={width}
              height={height}
              className="rounded-lg object-contain"
            />
          </div>
        );
      }
      if (node?.nodeType === 'embedded-entry-inline') {
        return (
          <Link key={index} href={`/${node?.target?.slug}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 duration-300 transition-colors">
            {node?.target?.title}
          </Link>
        );
      }
      return null;
    });
  };