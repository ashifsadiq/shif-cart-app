import { Link } from '@inertiajs/react';
import React from 'react';

type Product = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock_quantity: number;
    image: string;
    image_url: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
};
type Props = {
    productData: Product[];
};

const ProductComponent: React.FC<Props> = ({ productData }) => {
    return (
        <div className="grid w-full grid-cols-2 gap-0 px-1 sm:gap-6 md:grid-cols-3 md:px-4 xl:grid-cols-4">
            {productData.map((product) => (
                <Link
                    href={route('product.productShow', { slug: product.slug })}
                    key={product.id}
                    className="group bg-background relative flex flex-col justify-between overflow-hidden rounded border border-gray-200 shadow-sm transition-all hover:scale-101 hover:cursor-pointer hover:shadow-lg sm:rounded-2xl"
                >
                    <img
                        src={product.image ? `/storage/${product.image}` : product.image_url}
                        alt={product.name}
                        className="md:6 h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-102 lg:h-[400px]"
                    />

                    <div className="flex flex-col justify-between px-2 py-2 sm:px-4">
                        <h2 className="text-primary text-lg font-semibold">{product.name}</h2>
                        <p className="line-clamp-2 text-sm text-gray-500">{product.description || 'No description available.'}</p>
                    </div>
                    <div className="flex flex-col justify-between gap-y-2 px-2 py-2 sm:flex-row sm:px-4 md:items-center">
                        <div className="space-x-1">
                            <span className="text-primary text-2xl font-bold">₹{product.price ?? 'N/A'}</span>
                            <span className="text-muted-foreground text-base font-bold line-through">₹{product.price ?? 'N/A'}</span>
                        </div>
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-lg px-5 py-1 text-sm transition-colors">
                            View
                        </button>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ProductComponent;
