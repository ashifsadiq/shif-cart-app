import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
type Category = {
    id: number;
    name: string;
    image: string;
};

type Props = {
    categoryData: Category[];
    currentCategoryId: number | null;
    setCurrentCategoryId: (id: number | null) => void;
};

const CategoryComponent: React.FC<Props> = ({ categoryData, currentCategoryId, setCurrentCategoryId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Record<number, HTMLButtonElement | null>>({});

    const handleClick = (id: number) => {
        setCurrentCategoryId(id);

        const container = containerRef.current;
        const item = itemRefs.current[id];

        if (container && item) {
            const containerRect = container.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            const scrollLeft = item.offsetLeft - container.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div ref={containerRef} className="scrollbar-hide w-full overflow-x-auto px-4 py-4">
            <div className="flex gap-4 whitespace-nowrap">
                {categoryData.map((cat) => (
                    <button
                        key={cat.id}
                        ref={(el) => { itemRefs.current[cat.id] = el; }}
                        onClick={() => handleClick(cat.id)}
                        className={cn(
                            'min-w-[200px] shrink-0 cursor-pointer rounded-xl border-2 bg-transparent p-4 shadow transition-all hover:shadow-lg dark:bg-[#FDFDFC]',
                            currentCategoryId === cat.id ? 'border-primary dark:border-muted-foreground border-2' : '',
                        )}
                    >
                        <img src={`/storage/${cat.image}`} alt={cat.name} className="mb-2 h-24 w-full rounded object-cover" />
                        <h2 className="text-lg font-semibold">
                            {cat.name} - {cat.id}
                        </h2>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryComponent;
