import React from 'react';
import { cn } from '@/lib/utils';
import * as schema from 'schema-dts';
import { ProductReview } from '@/types/product';
import { Rating } from 'react-simple-star-rating';

interface UserReviewsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The review data to display */
  review: ProductReview;
  /** Optional heading level for the review title */
  titleElement?: 'h3' | 'h4' | 'h5';
}

/**
 * Professional user review card component.
 *
 * Displays user avatar, name, star rating, review title, and comment.
 * Includes schema.org structured data for SEO.
 */
const UserReviews: React.FC<UserReviewsProps> = ({
  review,
  titleElement: TitleElement = 'h3',
  className,
  ...props
}) => {
  const { user, rating, title, comment } = review;

  // Helper to render star rating with accessibility
  const renderStarRating = () => {
    return Array(5)
      .fill(null)
      .map((_, i) => (
        <Rating
          key={i}
          size={24}
          initialValue={i < rating ? 1 : 0}
          allowFraction={false}
          readonly
          iconsCount={1}
          fillColor="#c45500"
          emptyColor="#e5e7eb"
          className="!inline-block" // Force inline display
          aria-hidden="true"
        />
      ));
  };

  return (
    <div
      {...props}
      itemScope
      itemType="https://schema.org/Review"
      className={cn(
        // Base card styles
        'bg-background flex flex-col gap-1.5 rounded-lg p-4 shadow-sm transition-shadow hover:shadow',
        // Dark mode
        'dark:bg-neutral-900 dark:border dark:border-neutral-800',
        className
      )}
    >
      {/* -- User Info -- */}
      <div className="flex items-center gap-2">
        <img
          src={user.picture}
          alt={`${user.name}'s avatar`}
          width="48"
          height="48"
          className="h-12 w-12 rounded-full object-cover"
          loading="lazy"
        />
        <span>{user.name}</span>
      </div>

      {/* -- Star Rating -- */}
      <div
        className="flex items-center gap-2"
        aria-label={`Rating: ${rating} out of 5 stars`}
      >
        <div className="flex" aria-hidden="true">
          {renderStarRating()}
        </div>
        <span className="text-xs text-muted-foreground">
          <span
            id={`rating-value-${review.id}`}
            itemProp="reviewRating"
            itemScope
            itemType="https://schema.org/Rating"
          >
            <meta itemProp="worstRating" content="1" />
            <span itemProp="ratingValue">{rating}</span>
            <span aria-hidden="true">/</span>
            <span itemProp="bestRating" aria-hidden="true">
              5
            </span>
          </span>
        </span>
      </div>

      {/* -- Review Title -- */}
      {title && (
        <TitleElement
          itemProp="name"
          className="mt-1 font-semibold"
          id={`review-title-${review.id}`}
        >
          {title}
        </TitleElement>
      )}

      {/* -- Review Body -- */}
      {comment && (
        <p
          itemProp="reviewBody"
          className="mt-1 text-sm text-muted-foreground"
          aria-labelledby={`review-title-${review.id}`}
        >
          {comment}
        </p>
      )}

      {/* -- Structured Data (for JSON-LD in future) -- */}
      <meta itemProp="datePublished" content={review.date || ''} />
      <meta itemProp="author" content={user.name} />
    </div>
  );
};

export default UserReviews;
