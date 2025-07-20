import React from 'react';

// Types
import { ProductReview } from '@/types/product';

// Components
import { cn } from '@/lib/utils';
import UserReviews from '@/components/user-reviews';
import H2 from '@/components/ui/h2';

interface ProductReviewsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Array of product reviews to display */
    reviews: ProductReview[];
    /** Optional section title override (React node, not HTML title attribute) */
    sectionTitle?: React.ReactNode; // <-- Renamed to avoid conflict
    /** Maximum number of reviews to display (for pagination) */
    maxReviews?: number;
    title?: string;
}

/**
 * Professional Product Reviews component
 * 
 * Renders a grid of `UserReviews` with schema.org structured data.
 * 
 * @param reviews - Array of `ProductReview` objects
 * @param title - Optional section title (default: "Top Reviews")
 * @param maxReviews - Max reviews to display (default: all)
 * @param className - Optional Tailwind className
 * @param ...rest - All standard div HTML props (e.g., aria-label)
 * @returns React function component
 */
export const ProductReviews: React.FC<ProductReviewsProps> = ({
    reviews,
    title = 'Top Reviews',
    maxReviews,
    className,
    ...rest
}) => {
    // Early return if no reviews to display
    if (!reviews || reviews.length === 0) return null;

    // Slice to maxReviews if provided
    const displayedReviews = maxReviews
        ? reviews.slice(0, maxReviews)
        : reviews;

    return (
        <section
            aria-label={typeof title === 'string' ? title : 'Product reviews'}
            className={cn('space-y-4', className)}
            {...rest}
        >
            <H2>{title}</H2>

            <div
                role="feed"
                aria-live="polite"
                className={cn(
                    'mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                    // Optional: You might add `max-h-[400px] overflow-y-auto` if pagination is not used
                    // 'max-h-[400px] overflow-y-auto'
                )}
            >
                {displayedReviews.map((review,reviewIndex) => (
                    <article
                        key={reviewIndex.toString()} // <-- Always use a unique, stable key (e.g., database ID)
                        itemScope
                        itemType="https://schema.org/Review"
                    >
                        <UserReviews
                            key={review.id}
                            review={review}
                            // Force self-contained card layout
                            className="h-full"
                        />
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ProductReviews;