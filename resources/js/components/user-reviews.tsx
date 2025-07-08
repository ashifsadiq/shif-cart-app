import { cn } from '@/lib/utils';
import { ProductReview } from '@/types/review';
import { HTMLProps } from 'react';
import { Rating } from 'react-simple-star-rating';

type Props = {
    review: ProductReview;
    className?: HTMLProps<HTMLElement>['className'];
};

const UserReviews = (props: Props) => {
    const { review, className } = props;
    const { user } = review;

    return (
        <div className={cn(className)}>
            {/* user */}
            <div className="flex flex-row items-center gap-x-2">
                <img src={user.picture} className="w-12 rounded-full object-fill" alt={user.name} />
                <span className="text-sm">{user.name}</span>
            </div>

            {/* rating */}
            <div className="mt-1 flex flex-row items-center">
                {Array(5)
                    .fill(null)
                    .map((_, i) => (
                        <Rating key={i} size={30} fillColor="#c45500" initialValue={i + 1 <= review.rating ? 1 : 0} readonly iconsCount={1} />
                    ))}
                <meta itemProp="worstRating" content="1"/>
                <span className="text-sm text-gray-600"><span itemProp="ratingValue">{review.rating}</span>/<span itemProp="bestRating">5</span></span>
            </div>

            {/* optional: title/comment */}
            {review.title && (
                <p itemProp="name" className="mt-2 font-semibold">
                    {review.title}
                </p>
            )}
            {review.comment && (
                <p itemProp="reviewBody" className="text-muted-foreground mt-1 text-sm">
                    {review.comment}
                </p>
            )}
        </div>
    );
};

export default UserReviews;
