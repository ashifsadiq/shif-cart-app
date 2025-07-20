import React from 'react';
import { cn } from '@/lib/utils'; // if using utility for theming/classes

export interface ProductPriceDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Current selling price (formatted as a string, e.g., "2,999") */
  price: string;
  /** Manufacturer's Suggested Retail Price (formatted as a string, e.g., "3,999") */
  mrp: string;
  /** Discount percentage (integer, e.g., 25 for 25% off) */
  discount: number;
  /** Include tax disclaimer? Should match legal requirements in your region */
  showTaxDisclaimer?: boolean;
  /** Discount label, e.g., "OFF" or "%" */
  discountLabel?: string;
  /** Custom currency symbol (defaults to ₹) */
  currencySymbol?: string;
  /** Vertical or horizontal layout */
  layout?: 'vertical' | 'horizontal';
}

/**
 * Modern, accessible product price display component
 *
 * Features:
 * - Automatic MRP/price/discount logic
 * - Full accessibility (labels, screen reader support)
 * - Semantic markup for SEO
 * - Themed via Tailwind classes
 * - Customizable currency, discount label, and layout
 * - TypeScript strongly typed
 */
export const ProductPriceDisplay: React.FC<ProductPriceDisplayProps> = ({
  price,
  mrp,
  discount,
  className,
  layout = 'vertical',
  currencySymbol = '₹',
  discountLabel = '%',
  showTaxDisclaimer = true,
  ...rest
}) => {
  // Type safety and null checks
  price = price ?? 'N/A';
  mrp = mrp ?? 'N/A';

  const shouldShowDiscount = discount > 0 && +price.replace(/\D+/g, '') < +mrp.replace(/\D+/g, '');
  const shouldShowMrp = +price.replace(/\D+/g, '') < +mrp.replace(/\D+/g, '');
  const finalDiscountLabel = shouldShowDiscount ? `${discount}${discountLabel}` : null;

  return (
    <div
      className={cn(
        // Base styles
        'flex flex-col items-start font-sans',
        // Layout options
        { 'gap-1': layout === 'vertical', 'gap-2': layout === 'horizontal' },
        className
      )}
      {...rest}
    >
      {/* -- Price & Discount -- */}
      <div className="flex flex-wrap items-baseline gap-2">
        {finalDiscountLabel && (
          <span
            className={cn(
              'inline-flex items-center justify-center rounded bg-red-100 px-2 py-1',
              'text-xl font-medium leading-none text-red-600',
              'dark:bg-red-900/20 dark:text-red-400 sm:text-2xl md:text-3xl'
            )}
            aria-label={`Discount: ${discount}%`}
          >
            -{finalDiscountLabel}
          </span>
        )}

        <span
          className="flex items-baseline gap-1 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-5xl"
          aria-live="polite"
          aria-label={`Current Price: ${currencySymbol}${price}`}
        >
          <span
            className="text-2xl font-normal leading-none text-gray-500 dark:text-gray-400 md:text-3xl"
            itemProp="priceCurrency"
            content={currencySymbol}
            aria-hidden="true"
          >
            {currencySymbol}
          </span>
          <span
            className="price-amount"
            itemProp="price"
            content={price.toString()}
          >
            {price}
          </span>
        </span>
      </div>

      {/* -- MRP (if relevant) -- */}
      {shouldShowMrp && (
        <div
          className="text-base text-gray-500 dark:text-gray-400"
          aria-label={`M.R.P.: ${currencySymbol}${mrp}`}
        >
          M.R.P.:{' '}
          <span className="line-through">
            <span className="font-normal" aria-hidden="true">
              {currencySymbol}
            </span>
            {mrp}
          </span>
        </div>
      )}

      {/* -- Tax disclaimer -- */}
      {showTaxDisclaimer && (
        <div className="text-base text-gray-500 dark:text-gray-400">
          Inclusive of all taxes
        </div>
      )}
    </div>
  );
};

export default ProductPriceDisplay;
