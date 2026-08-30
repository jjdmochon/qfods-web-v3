import React from 'react';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content into lines
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableRows: string[][] = [];
  let listItems: React.ReactNode[] = [];
  let isNumberedList = false;
  let keyIndex = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${keyIndex++}`} style={{ paddingLeft: '1.4rem', margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${keyIndex++}`} style={{ paddingLeft: '1.4rem', margin: '0.75rem 0', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {listItems}
          </ul>
        );
      }
      listItems = [];
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      const headerRow = tableRows[0] || [];
      const bodyRows = tableRows.slice(1);

      elements.push(
        <div key={`table-wrapper-${keyIndex++}`} style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'var(--surface-alt)', borderBottom: '2px solid var(--border-color)' }}>
                {headerRow.map((cell, cIdx) => (
                  <th key={`th-${cIdx}`} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-title)' }}>
                    {renderInlineFormatted(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr key={`tr-${rIdx}`} style={{ borderBottom: '1px solid var(--border-color)', background: rIdx % 2 === 0 ? 'var(--surface)' : 'var(--surface-alt)' }}>
                  {row.map((cell, cIdx) => (
                    <td key={`td-${rIdx}-${cIdx}`} style={{ padding: '8px 12px', color: 'var(--text-main)' }}>
                      {renderInlineFormatted(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for Markdown table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      const cells = trimmed.slice(1, -1).split('|');
      // If separator row (like |:---|:---|), ignore it
      if (cells.every(c => c.trim().replace(/[-:]/g, '') === '')) {
        continue;
      }
      inTable = true;
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Check for empty line
    if (!trimmed) {
      flushList();
      continue;
    }

    // Check for Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      elements.push(
        <hr key={`hr-${keyIndex++}`} style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
      );
      continue;
    }

    // Check for Exam Notes / Tips Callout box
    if (trimmed.startsWith('###') && (trimmed.includes('EXAMEN') || trimmed.includes('NOTAS PARA EL EXAMEN') || trimmed.includes('CONSEJOS'))) {
      flushList();
      elements.push(
        <div key={`exam-alert-${keyIndex++}`} style={{
          background: 'rgba(245, 158, 11, 0.12)',
          borderLeft: '4px solid #f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          margin: '1.25rem 0',
          color: 'var(--text-main)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#b45309', fontSize: '1rem', marginBottom: '4px' }}>
            <span>📝</span> {trimmed.replace(/^#+\s*/, '')}
          </div>
        </div>
      );
      continue;
    }

    // Headers
    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${keyIndex++}`} style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-title)', marginTop: '1.2rem', marginBottom: '0.4rem' }}>
          {renderInlineFormatted(trimmed.slice(5))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${keyIndex++}`} style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-title)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          {renderInlineFormatted(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${keyIndex++}`} style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-title)', marginTop: '1.8rem', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
          {renderInlineFormatted(trimmed.slice(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${keyIndex++}`} style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-title)', marginTop: '1rem', marginBottom: '0.75rem' }}>
          {renderInlineFormatted(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // Lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      isNumberedList = false;
      listItems.push(
        <li key={`li-${keyIndex++}`} style={{ lineHeight: 1.6 }}>
          {renderInlineFormatted(trimmed.slice(2))}
        </li>
      );
      continue;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      isNumberedList = true;
      listItems.push(
        <li key={`li-${keyIndex++}`} style={{ lineHeight: 1.6 }}>
          {renderInlineFormatted(numMatch[2])}
        </li>
      );
      continue;
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p key={`p-${keyIndex++}`} style={{ margin: '0.65rem 0', lineHeight: 1.65, fontSize: '0.92rem', color: 'var(--text-main)' }}>
        {renderInlineFormatted(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();

  return (
    <div className={`academic-markdown-view ${className}`} style={{ lineHeight: 1.65 }}>
      {elements}
    </div>
  );
};

// Inline Markdown parser (bold, italic, code, highlighted terms)
function renderInlineFormatted(text: string): React.ReactNode {
  if (!text) return '';

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyCounter = 0;

  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/;

  while (remaining) {
    const match = remaining.match(regex);
    if (!match || match.index === undefined) {
      parts.push(remaining);
      break;
    }

    if (match.index > 0) {
      parts.push(remaining.slice(0, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      parts.push(
        <strong key={`b-${keyCounter++}`} style={{ color: 'var(--text-title)', fontWeight: 700 }}>
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      parts.push(
        <code key={`c-${keyCounter++}`} style={{
          background: 'var(--surface-alt)',
          border: '1px solid var(--border-color)',
          borderRadius: '3px',
          padding: '1px 5px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.84em',
          color: 'var(--navy-ink)'
        }}>
          {matchedStr.slice(1, -1)}
        </code>
      );
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      parts.push(
        <em key={`i-${keyCounter++}`} style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
          {matchedStr.slice(1, -1)}
        </em>
      );
    }

    remaining = remaining.slice(match.index + matchedStr.length);
  }

  return <>{parts}</>;
}
