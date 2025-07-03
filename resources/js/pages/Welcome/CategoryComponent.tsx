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
        <div ref={containerRef} className="scrollbar-hide w-full overflow-x-auto p-2 sm:p-6">
            <div className="flex gap-4 whitespace-nowrap">
                {categoryData.map((cat) => {
                    const isCurrentCategoryId = currentCategoryId === cat.id;
                    const scale = 'scale-102';
                    const activeScale = 'scale-105';
                    const imageWidth = 'w-10';
                    return (
                        <button
                            key={cat.id}
                            ref={(el) => {
                                itemRefs.current[cat.id] = el;
                            }}
                            onClick={() => handleClick(cat.id)}
                            className={cn(
                                'bg-background flex min-w-fit shrink-0 cursor-pointer flex-row items-center justify-between gap-x-2 rounded-xl transition-all sm:flex-col group',
                            )}
                        >
                            <img
                                src={`/storage/${cat.image}`}
                                alt={cat.name}
                                className={cn(
                                    `h-10 ${imageWidth} rounded-full object-cover transition-transform md:mb-2 md:h-24 md:w-24 group-hover:${activeScale}`,
                                    isCurrentCategoryId ? activeScale : '',
                                )}
                            />
                            <h2
                                className={cn(
                                    `text-muted-foreground text-base font-semibold transition-transform`,
                                    isCurrentCategoryId ? 'text-card-foreground' : '',
                                    isCurrentCategoryId ? activeScale : '',
                                )}
                            >
                                {cat.name}
                            </h2>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryComponent;
