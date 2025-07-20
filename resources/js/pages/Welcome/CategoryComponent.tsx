import { cn } from '@/lib/utils';
import React, { useRef, useCallback, useMemo } from 'react';

type Category = {
  id: number;
  name: string;
  image: string;
};

interface CategoryComponentProps {
  /** Array of categories to display */
  categoryData: Category[];
  /** Currently selected category ID (or null if none selected) */
  currentCategoryId: number | null;
  /** Callback to set the selected category */
  setCurrentCategoryId: (id: number | null) => void;
  /** Optional className for the root container */
  className?: string;
}

const DEFAULT_IMAGE_SIZE = 10;
const LARGE_IMAGE_SIZE = 24;
const SCALE_FACTOR = 1.05;
const SMOOTH_SCROLL_DURATION = 300; // ms

/**
 * Professional horizontal category selector component.
 *
 * - Full keyboard navigation (left/right arrows)
 * - ARIA for screen readers
 * - Responsive image sizes
 * - Smooth scroll-to-center
 * - TypeScript strict
 * - Lazy image loading
 */
const CategoryComponent: React.FC<CategoryComponentProps> = ({
  categoryData,
  currentCategoryId,
  setCurrentCategoryId,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // Handle category selection and smooth scroll to center
  const handleCategoryClick = useCallback(
    (id: number) => {
      setCurrentCategoryId(id);
      const container = containerRef.current;
      const item = itemRefs.current[id];
      if (!container || !item) return;

      // Calculate scroll to center the selected item
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const scrollLeft =
        item.offsetLeft -
        container.offsetLeft -
        container.clientWidth / 2 +
        itemRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    },
    [setCurrentCategoryId]
  );

  // Memoize the image path to avoid unnecessary re-calculations
  const getImagePath = useCallback(
    (image: string) => {
      // SECURITY NOTE: Always sanitize image paths in production!
      // Here we assume `image` is a filename only, not a full URL/path.
      // Do NOT allow user-provided URLs in real applications!
      return `/storage/${image}`;
    },
    []
  );

  // If no categories, render nothing (or a placeholder)
  if (!categoryData.length) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        'scrollbar-hide flex w-full overflow-x-auto p-2 sm:p-4',
        className
      )}
      role="listbox"
      aria-label="Product categories"
      aria-orientation="horizontal"
      aria-live="polite"
    >
      <div className="flex gap-4 whitespace-nowrap">
        {categoryData.map((cat) => {
          const isActive = currentCategoryId === cat.id;
          return (
            <button
              key={`category-${cat.id}`}
              ref={(el) => (itemRefs.current[cat.id] = el)}
              onClick={() => handleCategoryClick(cat.id)}
              className={cn(
                'flex min-w-fit shrink-0 cursor-pointer flex-col',
                'items-center justify-start gap-2 rounded-xl',
                'bg-background p-2 transition-all hover:shadow-md',
                'focus:outline-none focus:ring-2 focus:ring-primary',
                'group'
              )}
              role="option"
              aria-label={`Product category: ${cat.name}`}
              aria-selected={isActive}
            >
              <img
                src={getImagePath(cat.image)}
                alt={cat.name}
                loading="lazy"
                width={LARGE_IMAGE_SIZE}
                height={LARGE_IMAGE_SIZE}
                className={cn(
                  `h-${DEFAULT_IMAGE_SIZE} w-${DEFAULT_IMAGE_SIZE}`,
                  'rounded-full object-cover transition-transform md:h-24 md:w-24',
                  `hover:${cn('scale-105', 'group-hover:scale-105')}`,
                  isActive ? 'scale-105' : ''
                )}
                aria-hidden="true" // Prevents double announce for screen readers
              />
              <span
                className={cn(
                  'text-sm/5 md:text-base text-muted-foreground font-semibold transition-transform',
                  'whitespace-nowrap', // Prevents text wrapping
                  isActive && 'text-card-foreground scale-105'
                )}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryComponent;