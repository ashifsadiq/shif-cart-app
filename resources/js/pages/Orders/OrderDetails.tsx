// resources/js/Pages/Order/Show.jsx
import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';
import { cn } from '@/lib/utils';

export default function OrderShow({ order, items, items_meta }) {
    // Function to extract clean label from pagination links
    const getLinkLabel = (label) => {
        return label
            .replace('&laquo;', '«')
            .replace('&raquo;', '»')
            .replace(/(<([^>]+)>)/gi, '');
    };
    // State for current page items and pagination
    const [currentPage, setCurrentPage] = useState(items_meta.current_page || 1);
    const [loading, setLoading] = useState(false);

    // Get the order show path from Inertia.js page props (e.g., /orders/:id)
    const { url } = usePage();
    const orderShowPath = url.split('?')[0]; // Remove query params

    // Fetch items for a specific page
    const fetchItems = async (page) => {
        if (loading) return; // Prevent duplicate requests
        setLoading(true);
        try {
            await router.get(`${orderShowPath}`, { page }, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth"
                    });
                    setLoading(false)
                },
            });
        } catch (e) {
            setLoading(false);
        }
    };
    const goToPage = (page) => {
        if (page < 1 || page > items_meta.last_page || page === currentPage) return;
        setCurrentPage(page);
        fetchItems(page);
    };
    const PageButton = ({ page, isActive, label = null }) => (
        <button
            onClick={() => goToPage(page)}
            disabled={isActive || loading}
            className={cn(
                'w-10 h-10 flex items-center justify-center rounded border',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent',
            )}
            aria-current={isActive ? 'page' : undefined}
        >
            {label || page}
        </button>
    );
    // Only show pagination if there are multiple pages
    return (
        <UserLayout className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold">
                        Order <span className="text-primary">#{order.order_number}</span>
                    </h1>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span>Status: <span className="font-semibold capitalize">{order.status}</span></span>
                        <span>Items: <span className="font-semibold">{order.items_count}</span></span>
                        <span>Placed: <span>{(new Date(order.created_at)).toLocaleString()}</span></span>
                        <span>Amount: <span className="font-semibold">{order.amount}</span></span>
                    </div>
                </div>
                <Button onClick={() => router.visit('/orders')} href="/orders" variant="outline" size="sm">
                    Back to Orders
                </Button>
            </div>
            <hr className="mb-6" />
            {/* Order Items List */}
            <div className="space-y-6">
                {items.data.map(({ id, product, quantity, price }) => (
                    <div
                        key={id}
                        className="flex flex-col sm:flex-row gap-4 bg-white/80 border border-border rounded-lg p-4 shadow-sm"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-contain bg-foreground/10 rounded-lg"
                            loading="lazy"
                            width={128}
                            height={128}
                        />
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">{product.name}</h2>
                                <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                            <div className="flex items-center gap-6 mt-2">
                                <span>Qty: <span className="font-semibold">{quantity}</span></span>
                                <span>Total: <span className="font-semibold">₹{Number(price).toLocaleString()}</span></span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                {product.discount && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs">
                                        {product.discount}% OFF
                                    </span>
                                )}
                                {product.mrp && product.mrp !== product.price && (
                                    <span className="line-through text-xs text-muted-foreground">
                                        MRP: ₹{product.mrp}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex flex-wrap gap-1 justify-center">
                    {Array.from({ length: items_meta.last_page }, (_, i) => i + 1).map((page) => (
                        <PageButton
                            key={page}
                            page={page}
                            isActive={page === currentPage}
                        />
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
