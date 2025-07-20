import React, { memo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react"; // For accessible modals
import { X } from "lucide-react"; // Close icon

type ProductDetailedImagesProps = {
    productImages: string[];
    className?: string;
};

const ProductDetailedImages: React.FC<ProductDetailedImagesProps> = ({
    productImages,
    className,
}) => {
    // If productImages is empty, show a placeholder
    if (!productImages.length) productImages = ["/image-placeholder.jpg"];

    // Main state
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Refs for gallery scrolling
    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const thumbnailButtons = useRef<Record<number, HTMLButtonElement | null>>({});

    // Handle thumbnail click (and scroll to center it)
    const handleThumbClick = (index: number) => {
        setActiveIndex(index);
        const container = thumbnailsRef.current;
        const button = thumbnailButtons.current[index];
        if (container && button) {
            const containerRect = container.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            const scrollLeft =
                button.offsetLeft -
                container.offsetLeft -
                container.clientWidth / 2 +
                button.clientWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    };

    // Open lightbox on main image click
    const openLightbox = () => setIsLightboxOpen(true);

    // Close lightbox
    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    // Zoom in/out
    const handleZoom = (delta: number) => {
        setZoom((prev) => Math.max(1, Math.min(5, prev + delta)));
    };

    // Pan image (while zoomed)
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || zoom <= 1) return;
        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    // Touch support
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            dragStart.current = {
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y,
            };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || e.touches.length !== 1 || zoom <= 1) return;
        setPosition({
            x: e.touches[0].clientX - dragStart.current.x,
            y: e.touches[0].clientY - dragStart.current.y,
        });
        e.preventDefault(); // Prevent scroll when zoomed
    };

    // Next/previous image in lightbox
    const nextImage = () =>
        setActiveIndex((prev) => (prev + 1) % productImages.length);
    const prevImage = () =>
        setActiveIndex(
            (prev) => (prev - 1 + productImages.length) % productImages.length
        );

    // Escape key to close lightbox
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (isLightboxOpen) {
                if (e.key === "ArrowLeft") prevImage();
                if (e.key === "ArrowRight") nextImage();
                if (e.key === "0" && e.ctrlKey) setZoom(1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isLightboxOpen]);

    return (
        <div className={cn("space-y-2 md:space-y-4", className)}>
            {/* Main Product Image (Clickable) */}
            <img
                src={productImages[activeIndex]}
                onClick={openLightbox}
                alt={`Product image ${activeIndex + 1}`}
                className={cn(
                    "h-auto w-full cursor-zoom-in rounded-lg object-cover bg-foreground/5",
                    "focus:ring-2 focus:ring-primary focus:outline-none"
                )}
                itemProp="image"
                tabIndex={0}
                aria-label="Click to view larger image"
                onKeyDown={(e) => e.key === "Enter" && openLightbox()}
            />

            {/* Thumbnails List */}
            <div
                ref={thumbnailsRef}
                className="scrollbar-hide w-full overflow-x-auto"
            >
                <div className="flex gap-2 whitespace-nowrap py-1">
                    {productImages.map((img, idx) => (
                        <button
                            key={String(idx)}
                            onClick={() => handleThumbClick(idx)}
                            ref={(el) => (thumbnailButtons.current[idx] = el)}
                            className={cn(
                                "shrink-0 cursor-pointer rounded-lg border-2 p-px",
                                "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
                                activeIndex === idx ? "border-primary" : "border-muted"
                            )}
                            aria-label={`Show image ${idx + 1}`}
                            tabIndex={0}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className={cn(
                                    "h-12 w-12 rounded-[6px] object-cover bg-foreground/5"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            <Transition.Root show={isLightboxOpen} as={React.Fragment}>
                <Dialog open={isLightboxOpen} onClose={closeLightbox} static>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div
                            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm"
                            onClick={closeLightbox}
                        />
                    </Transition.Child>
                    <Dialog.Panel className="fixed inset-0 z-[101] flex flex-col gap-3 overflow-auto p-4 md:p-6 lg:p-8">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="fixed right-4 top-4 z-10 rounded-full p-2 text-foreground hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label="Close image viewer"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Main Image */}
                        <div
                            className="relative flex h-full w-full items-center justify-center bg-background"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={() => setIsDragging(false)}
                        >
                            <img
                                src={productImages[activeIndex]}
                                alt={`Product image ${activeIndex + 1}`}
                                className={cn(
                                    "max-h-[90vh] max-w-full cursor-grab object-contain",
                                    isDragging && "cursor-grabbing"
                                )}
                                style={{
                                    transform: `scale(${zoom}) translateX(${position.x}px) translateY(${position.y}px)`,
                                    transition: isDragging ? "none" : "transform 0.2s ease",
                                }}
                            />
                        </div>

                        {/* Image Controls */}
                        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
                            {/* Thumbnails (inside modal) */}
                            <div className="flex gap-2 overflow-x-auto py-1">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        className={cn(
                                            "shrink-0 rounded-[6px] border-2 p-px",
                                            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
                                            activeIndex === idx ? "border-primary" : "border-muted"
                                        )}
                                        tabIndex={0}
                                        aria-label={`Show image ${idx + 1}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="h-12 w-12 rounded-[6px] object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Zoom & Navigation */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setZoom(Math.max(1, zoom - 0.5))}
                                    className="rounded bg-accent/20 p-2 text-foreground hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Zoom out"
                                >
                                    Zoom Out
                                </button>
                                <button
                                    onClick={() => setZoom(Math.min(5, zoom + 0.5))}
                                    className="rounded bg-accent/20 p-2 text-foreground hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Zoom in"
                                >
                                    Zoom In
                                </button>
                                <button
                                    onClick={prevImage}
                                    className="rounded bg-accent/20 p-2 text-foreground hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Previous image"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="rounded bg-accent/20 p-2 text-foreground hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Next image"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default memo(ProductDetailedImages);