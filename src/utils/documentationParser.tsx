import { type ReactNode } from 'react';

/**
 * Parser simples de markdown para documentação.
 * Suporta negrito (**texto**), código (`trecho`) e links [rótulo](url).
 */
export const parseDocumentationInline = (text: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const matched = match[0];

    if (matched.startsWith('**') && matched.endsWith('**')) {
      parts.push(
        <strong
          key={`bold-${keyCounter++}`}
          className='font-semibold text-gray-900'
        >
          {matched.slice(2, -2)}
        </strong>
      );
    } else if (matched.startsWith('`') && matched.endsWith('`')) {
      parts.push(
        <code
          key={`code-${keyCounter++}`}
          className='px-1.5 py-0.5 rounded text-sm font-mono bg-gray-100 text-gray-800'
        >
          {matched.slice(1, -1)}
        </code>
      );
    } else if (matched.startsWith('[')) {
      const linkMatch = matched.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        parts.push(
          <a
            key={`link-${keyCounter++}`}
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-700 underline underline-offset-2'
          >
            {label}
          </a>
        );
      } else {
        parts.push(matched);
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};
