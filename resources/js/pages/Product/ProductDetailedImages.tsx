import { cn } from '@/lib/utils';
import { memo, useRef, useState } from 'react';

type ProductDetailedImages = {
    productImages: Array<URL>;
};
const ProductDetailedImages = ({ productImages }: ProductDetailedImages) => {
    const allProductImages = Array(1)
        .fill(null)
        .flatMap(() => productImages);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const imagesContainerRef = useRef<HTMLDivElement>(null);
    const imagesThumbnailRef = useRef<Record<number, HTMLButtonElement | null>>({});
    const handleThumbnailClick = (id: number) => {
        setActiveImageIndex(id);
        const container = imagesContainerRef.current;
        const item = imagesThumbnailRef.current[id];
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
        <div className="space-y-3">
            <img itemProp="image" src={`${allProductImages[activeImageIndex]}`} alt={`Product Image `} className={cn('h-auto w-full rounded-lg object-cover')} />
            <div ref={imagesContainerRef} className="scrollbar-hide w-full overflow-x-auto">
                <div className="flex gap-x-2 whitespace-nowrap">
                    {allProductImages.map((image, index) => (
                        <button
                            onClick={() => handleThumbnailClick(index)}
                            ref={(el) => {
                                imagesThumbnailRef.current[index] = el;
                            }}
                            className={cn(
                                'bg-background flex min-w-fit shrink-0 cursor-pointer items-center justify-center rounded-lg border-2',
                                activeImageIndex === index ? 'border-primary' : 'border-muted border',
                            )}
                        >
                            <img
                                key={index}
                                src={`${image}`}
                                alt={`Product Image ${index + 1}`}
                                className={cn(
                                    'h-10 w-10 rounded-lg border-2 object-cover',
                                    activeImageIndex === index ? 'border-background' : 'border-muted border',
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(ProductDetailedImages);
