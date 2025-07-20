import React from 'react';
import { Link } from '@inertiajs/react';
import ReviewStar from '@/components/review-star';
import { Product } from '@/types/product';

/* ---------- Types ------------------------------------------------------- */
interface Props {
    productData: Product[];
}const ProductGrid: React.FC<Props> = ({ productData }) => {
    return (
        <section
            aria-label="Product list"
            className="grid w-full grid-cols-1 gap-x-4 gap-y-6 px-1
                 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4
                 sm:px-3 md:px-4"
        >
            {productData.map(
                ({
                    id,
                    slug,
                    image,
                    name,
                    review,
                    review_count,
                    description,
                    price,
                }) => (
                    <Link
                        key={id}
                        href={route('product.productShow', { slug })}
                        prefetch={true}
                        className="group relative flex flex-col overflow-hidden
                       rounded-lg border border-border/40 bg-background
                       shadow-sm transition
                       hover:shadow-md motion-safe:hover:scale-[1.02]
                       focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {/* ---------- Image ---------- */}
                        <img
                            src={image}
                            alt={name}
                            loading="lazy"
                            decoding="async"
                            className="h-56 w-full object-contain bg-foreground/5
                         transition-transform duration-300
                         motion-safe:group-hover:scale-105
                         lg:h-72"
                        />

                        {/* ---------- Details ---------- */}
                        <div className="flex grow flex-col gap-2 p-3 sm:p-4">
                            <h2
                                className="line-clamp-2 text-sm font-semibold text-primary
                           md:text-base"
                            >
                                {name}
                            </h2>

                            {/* Rating */}
                            <div
                                className="flex items-center gap-1 text-xs text-muted-foreground
                           md:text-sm"
                            >
                                <span>{review.toFixed(1)}</span>
                                <ReviewStar initialValue={review} />
                                <span aria-label={`${review_count} reviews`}>
                                    ({review_count})
                                </span>
                            </div>

                            {/* Description */}
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                {description || 'No description available.'}
                            </p>

                            {/* Price */}
                            <div className="mt-auto flex items-center gap-2">
                                <span className="text-lg font-semibold text-primary">
                                    ₹{price}
                                </span>
                                <span className="text-xs line-through text-muted-foreground">
                                    ₹{price}
                                </span>
                            </div>

                            {/* CTA */}
                            <div
                                className="flex items-center justify-center rounded-full
                           border border-border py-1 text-xs
                           transition-colors
                           hover:bg-accent hover:text-accent-foreground
                           md:text-sm"
                            >
                                See options
                            </div>
                        </div>
                    </Link>
                )
            )}
        </section>
    );
};

export default ProductGrid;
