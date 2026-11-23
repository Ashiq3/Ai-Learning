import { Fragment } from 'react';

interface InlineCodeTextProps {
  text: string;
  codeClassName?: string;
}

/**
 * Renders plain prose with inline backticked segments (`POST /v1/chat`, `gpt-4o`)
 * styled as crisp monospace chips instead of literal raw backtick characters.
 */
export function InlineCodeText({
  text,
  codeClassName = 'rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.88em] text-[#7ae8cc]',
}: InlineCodeTextProps) {
  if (!text.includes('`')) {
    return <>{text}</>;
  }

  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code key={idx} className={codeClassName}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={idx}>{part}</Fragment>;
      })}
    </>
  );
}
