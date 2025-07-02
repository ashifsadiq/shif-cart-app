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
        <div className="grid w-full grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {productData.map((product) => (
                <div
                    key={product.id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                    <img
                        src={product.image ? `/storage/${product.image}` : product.image_url}
                        alt={product.name}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="flex flex-col justify-between p-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description || 'No description available.'}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-primary text-base font-bold">₹{product.price?.toFixed(2) ?? 'N/A'}</span>
                            <button className="bg-primary hover:bg-primary/90 cursor-pointer rounded-lg px-5 py-1 text-sm text-white transition-colors">
                                View
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductComponent;
