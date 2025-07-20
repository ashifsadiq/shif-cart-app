import React from "react";
import { Link } from '@inertiajs/react';

type Product = { id: number; name: string; image: string; price: string; badge?: string };
type HorizontalProductListProps = { title: string; products: Product[]; onSeeAll?: () => void };

export const HorizontalProductList: React.FC<HorizontalProductListProps> = ({ title, products, onSeeAll }) => (
  <section className="py-2">
    <div className="flex justify-between items-center px-4 mb-2">
      <h2 className="font-bold text-lg">{title}</h2>
      {onSeeAll && <button className="text-primary" onClick={onSeeAll}>See All</button>}
    </div>
    <div className="flex overflow-x-auto scrollbar-hide gap-3 px-2 pb-2">
      {products.map(product => (
        <Link href={`/products/${product.id}`} key={product.id} className="min-w-[140px] bg-white shadow rounded p-2">
          <img src={product.image} alt={product.name} className="h-28 w-full object-cover rounded-md mb-1" />
          <div className="font-medium text-sm line-clamp-1">{product.name}</div>
          <div className="text-primary font-bold">{product.price}</div>
          {product.badge && <div className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{product.badge}</div>}
        </Link>
      ))}
    </div>
  </section>
);
