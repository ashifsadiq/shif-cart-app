import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for className merging

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  maxNumberOfLines?: number;
  lineClampEnable?: boolean;
  showToggleAlways?: boolean; // Optional: always show toggle button regardless of overflow
}

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  style,
  className,
  maxNumberOfLines = 3,
  lineClampEnable = false,
  showToggleAlways = false,
  ...props
}) => {
  // Handle cases where children might be null/undefined
  if (!children) return null;

  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(true);
  const [showToggle, setShowToggle] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [lineHeight, setLineHeight] = useState(20); // Default line height fallback

  // Measure content height and line height
  useEffect(() => {
    const p = paragraphRef.current;
    if (!p || !lineClampEnable) return;

    const computedStyle = window.getComputedStyle(p);
    const lh = parseFloat(computedStyle.lineHeight) || 20;
    setLineHeight(lh);
    const height = p.scrollHeight;
    setContentHeight(height);
    
    const maxHeight = lh * maxNumberOfLines;
    if (height > maxHeight || showToggleAlways) {
      setShowToggle(true);
    } else {
      setShowToggle(false);
    }
  }, [children, maxNumberOfLines, lineClampEnable, showToggleAlways]);

  const handleToggle = () => {
    setIsClamped(prev => !prev);
  };

  const maxHeight = lineHeight * maxNumberOfLines;

  return (
    <div className="relative">
      <p
        ref={paragraphRef}
        style={{
          ...style,
          display: '-webkit-box',
          WebkitLineClamp: lineClampEnable && isClamped ? maxNumberOfLines : undefined,
          WebkitBoxOrient: 'vertical',
          overflow: lineClampEnable && isClamped ? 'hidden' : undefined,
          transition: 'max-height 0.3s ease, -webkit-line-clamp 0.3s ease',
        }}
        aria-expanded={lineClampEnable ? String(!isClamped) : undefined}
        aria-label={typeof children === 'string' ? children : undefined}
        className={cn(
          'text-[15px] md:text-[17px] lg:text-[19px]',
          lineClampEnable && isClamped ? 'line-clamp' : '',
          className
        )}
        {...props}
      >
        {children}
      </p>
      {lineClampEnable && showToggle && (
        <button
          aria-label={isClamped ? 'See more' : 'See less'}
          className="mt-2 inline-block text-sm text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
          onClick={handleToggle}
        >
          {isClamped ? 'See more' : 'See less'}
        </button>
      )}
    </div>
  );
};

export default Paragraph;
