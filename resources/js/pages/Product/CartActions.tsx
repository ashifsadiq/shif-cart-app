import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { User } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { apiGet, apiPost } from '@/lib/http';

interface CartActionProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Product data */
    product_id: Product['id'];
    /** True if product is available */
    isAvailable?: boolean;
    minQty?: number;
    /** Formattted price string (e.g. "₹1,299") */
    price?: string;
    /** Number of items already in cart (or null if none) */
    cartItem?: number;
    /** True during async operations (loading state) */
    isLoading?: boolean;
    /** Callback when Add to Cart clicked */
    onAddToCart?: (quantity: number) => void;
    /** Callback when Buy Now clicked */
    onBuyNow?: (quantity: number) => void;
    /** Tailwind className for root */
    className?: string;
    /** Button variant (Tailwind/ShadCN) */
    buttonVariant?: 'secondary' | 'destructive' | 'ghost' | 'outline' | 'default' | 'link';
    /** Logged-in user (or null) */
    user: User | null;
}

// Strict props: merge Product & CartActionProps without overlap
export const CartActions: React.FC<Omit<CartActionProps, 'product'>> = ({
    product_id,
    isAvailable = true,
    price,
    cartItem = 0,
    isLoading = false,
    onAddToCart,
    onBuyNow,
    buttonVariant = 'default',
    className,
    user,
    minQty = 1,
    ...rest
}) => {
    const hasUser = user?.user != null;
    const { post: useFormPost, data: formData } = useForm({
        product_id: product_id,
    })
    // Only expose cart actions if user is logged in
    const showCartActions = hasUser && isAvailable && !isLoading;
    const isDisabled = !isAvailable || isLoading || !hasUser;

    // Quantity state (only relevant if already in cart)
    const [quantity, setQuantity] = useState(cartItem);
    const maxQty = 10;

    // Increase/decrease quantity (enforce min/max)

    // Trigger "Add to Cart" action (if user is logged in)
    const handleAddToCart = async () => {
        try {
            const response: any = await apiPost(route('cart.add'), formData);
            const { message, item }: { message: string, item: any } = response;
            onAddToCart?.(item['quantity']);
            setQuantity(item['quantity']);
        } catch (error) {
            console.log('error', JSON.stringify(error, null, 2))
        }
    };
    const handleRemoveFromCart = async () => {
        try {
            const response: any = await apiPost(route('cart.remove'), formData);
            const { message, item }: { message: string, item: any } = response;
            onAddToCart?.(item['quantity']);
            setQuantity(item['quantity']);
        } catch (error) {
            console.log('error', JSON.stringify(error, null, 2))
        }
    };

    // Render price (with schema.org for SEO)
    const renderPriceBlock = () =>
        price && (
            <div className="flex items-center gap-1">
                <span className="text-lg font-semibold">{price}</span>
                <meta itemProp="price" content={price.replace(/\D+/g, '')} />
                <meta itemProp="priceCurrency" content="INR" />
            </div>
        );

    // Render quantity selector (only for items already in cart)
    const renderQuantitySelector = () => (
        <div className="flex items-center gap-2">
            <div className="flex w-full items-center justify-between gap-1 rounded-md border border-input p-1">
                <button
                    type="button"
                    onClick={handleRemoveFromCart}
                    disabled={quantity <= minQty || isDisabled}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full p-0 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <span className={cn("min-w-[2rem] text-center text-lg font-medium", !hasUser ? 'text-muted-foreground' : '')} aria-live="polite">
                    {quantity}
                </span>
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isDisabled}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full p-0 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
            {renderPriceBlock()}
        </div>
    );

    // Render call-to-action buttons (for new/not yet in cart)
    const renderActionButtons = () => (
        <div className="flex w-full flex-wrap gap-2">
            {showCartActions ? (
                <Button
                    type="button"
                    variant={buttonVariant}
                    size="lg"
                    disabled={isDisabled}
                    onClick={handleAddToCart}
                    className={cn('flex-1 cursor-pointer', isLoading && 'opacity-90')}
                    aria-label="Add to cart"
                >
                    <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <meta itemProp="url" content="#add-to-cart" />
                    </span>
                    {isLoading ? 'Adding...' : 'Add to Cart'}
                </Button>
            ) : (
                !hasUser ? <Button onClick={() => router.get(route('login', { redirect: window.location.pathname + window.location.search }))} variant={"destructive"} className='cursor-pointer' >Sign in to add to cart</Button>
                    :
                    <p className="text-sm text-muted-foreground">This item is unavailable.</p>
            )}
        </div>
    );
    return (
        <div
            {...rest}
            itemScope
            itemType="https://schema.org/Offer"
            className={cn('flex flex-col gap-4', className)}
        >
            {/* Show quantity selector if already in cart, otherwise show add button */}
            {quantity ? renderQuantitySelector() : renderActionButtons()}
            {/* {!hasUser && <p className="text-sm text-muted-foreground">Sign in to add to cart.</p>} */}
        </div>
    );
};

export default CartActions;
