import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState, HTMLProps } from 'react';

type ParagraphProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: HTMLProps<HTMLElement>['className'];
  maxNumberOfLines?: number;
  lineClampEnable?: boolean;
};

const Paragraph = ({
  children,
  style,
  className,
  maxNumberOfLines = 3,
  lineClampEnable=false,
  ...props
}: ParagraphProps) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(true);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    const p = paragraphRef.current;
    if (!p || !maxNumberOfLines) return;

    const fullHeight = p.scrollHeight;
    const lineHeight = parseInt(window.getComputedStyle(p).lineHeight || '20', 10);
    const maxHeight = lineHeight * maxNumberOfLines;

    if (fullHeight > maxHeight) {
      setShowToggle(true);
    }
  }, [children, maxNumberOfLines]);

  return (
    <div>
      <p
        ref={paragraphRef}
        style={{
          ...style,
          display: '-webkit-box',
          WebkitLineClamp: isClamped ? maxNumberOfLines : undefined,
          WebkitBoxOrient: 'vertical',
          overflow: isClamped ? 'hidden' : undefined,
        }}
        {...props}
        className={cn(
          'text-[15px] md:text-[17px] lg:text-[19px]',
          lineClampEnable && isClamped ? 'line-clamp' : '',
          className
        )}
      >
        {children}
      </p>
      {lineClampEnable && showToggle && (
        <button
          className="text-blue-500 mt-1 text-sm underline"
          onClick={() => setIsClamped(!isClamped)}
        >
          {isClamped ? 'See more' : 'See less'}
        </button>
      )}
    </div>
  );
};

export default Paragraph;
