import React from "react";

type Category = { id: number; name: string; image: string };
type CategoryGridProps = { categories: Category[]; onSelect: (id: number) => void };

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelect }) => (
  <section className="px-4 py-2">
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="flex flex-col items-center p-2 bg-white rounded hover:shadow"
        >
          <img src={cat.image} alt={cat.name} className="h-14 w-14 object-cover rounded-full mb-1" />
          <span className="text-xs font-medium text-gray-700">{cat.name}</span>
        </button>
      ))}
    </div>
  </section>
);
