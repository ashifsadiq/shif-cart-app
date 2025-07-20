import React from "react";
import { Link } from '@inertiajs/react';
import { Product } from "@/types/product";

type ProductWithDiscount = Product & { oldPrice?: string; discount?: number; tag?: string };
type ProductGridProps = { products: ProductWithDiscount[]; showTags?: boolean; };

export const ProductGrid: React.FC<ProductGridProps> = ({ products, showTags }) => (
  <div className="grid grid-cols-2 gap-3 px-3 sm:grid-cols-4">
    {products.map(p => (
      <Link key={p.id} href={`/products/${p.id}`} className="bg-white p-2 rounded-lg shadow hover:shadow-lg transition">
        <div className="relative">
          <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded mb-1" />
          {showTags && p.tag && <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-1 rounded">{p.tag}</span>}
        </div>
        <div className="font-semibold text-base line-clamp-1">{p.name}</div>
        <div className="flex items-end gap-1">
          <span className="text-primary font-bold">{p.price}</span>
          {p.oldPrice && <span className="line-through text-xs text-gray-400">{p.oldPrice}</span>}
          {p.discount && <span className="text-xs text-green-600 ml-2">-{p.discount}%</span>}
        </div>
      </Link>
    ))}
  </div>
);
