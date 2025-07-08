import H2 from '@/components/ui/h2';
import UserReviews from '@/components/user-reviews';
import { cn } from '@/lib/utils';
import { ProductReview } from '@/types/review';
import { HTMLProps } from 'react';

type Props = {
    reviews: ProductReview[];
    className?: HTMLProps<HTMLElement>['className'];
};
const ProductReviews = ({ reviews, className }: Props) => {
    return (
        <div itemProp="review" itemScope itemType="https://schema.org/Review" className={cn('space-y-2', className)}>
            <H2>Top Reviews</H2>
            <div className="mx-auto grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {reviews.map((review) => (
                    <UserReviews className='border-2 p-3 rounded-2xl shadow' review={review} />
                ))}
            </div>
        </div>
    );
};

export default ProductReviews;
