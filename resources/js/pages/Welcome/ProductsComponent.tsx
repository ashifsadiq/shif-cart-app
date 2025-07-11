import ReviewStart from '@/components/review-star';
import { Product } from '@/types/product';
import { Link } from '@inertiajs/react';
import React from 'react';
type Props = {
    productData: Product[];
};

const ProductComponent: React.FC<Props> = ({ productData }) => {
    return (
        <div className="grid w-full grid-cols-1 gap-0 px-1 sm:gap-6 md:grid-cols-3 md:px-4 xl:grid-cols-4">
            {productData.map((product) => (
                <Link
                    href={route('product.productShow', { slug: product.slug })}
                    key={product.id}
                    className="group bg-background relative flex md:flex-col justify-between overflow-hidden rounded border border-gray-200 shadow-sm transition-all hover:scale-101 hover:cursor-pointer hover:shadow-lg sm:rounded-2xl md:pb-3"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="md:6 h-56 w-[40%] md:w-full object-contain transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-102 lg:h-[400px] foreground dark:bg-foreground"
                    />
                    <div className="flex flex-col justify-around px-2 md:px-4">
                        <h2 className="text-primary text-sm md:text-lg font-semibold">{product.name}</h2>
                        <div className="flex items-center gap-0.5 text-sm text-muted-foreground">
                            <span>{product.review}</span>
                            <div className="flex items-center">
                                <ReviewStart initialValue={product.review} />
                            </div>
                            <span>({product.review_count})</span>
                        </div>
                        <p className="line-clamp-2 text-sm text-gray-500">{product.description || 'No description available.'}</p>
                        <div className="gap-y-2 pb-2 sm:flex-row md:items-center">
                            <div className="space-x-1">
                                <span className="text-primary text-xl md:text-2xl font-semibold">₹{product.price ?? 'N/A'}</span>
                                <span className="text-muted-foreground text-sm md:text-base line-through">₹{product.price ?? 'N/A'}</span>
                            </div>
                        </div>
                        <div className="flex justify-center items-center border border-card-foreground py-1 rounded-full">
                            <span className="text-sm md:text-base">See Options</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ProductComponent;
