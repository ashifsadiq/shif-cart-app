// resources/js/Pages/Order/Show.jsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';

export default function OrderShow({ order, items, items_meta }) {
    return (
        <UserLayout className="max-w-4xl mx-auto px-4 py-8">
            {/* Order Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold">
                        Order <span className="text-primary">#{order.order_number}</span>
                    </h1>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span>Status: <span className="font-semibold capitalize">{order.status}</span></span>
                        <span>Items: <span className="font-semibold">{order.items_count}</span></span>
                        <span>Placed: <span>{(new Date(order.created_at)).toLocaleString()}</span></span>
                    </div>
                </div>
                <Button onClick={()=>router.visit('/orders')} href="/orders" variant="outline" size="sm">
                    Back to Orders
                </Button>
            </div>

            <hr className="mb-6" />

            {/* Order Items List */}
            <div className="space-y-6">
                {items.data.map(({ id, product, quantity, price }) => (
                    <div
                        className="flex flex-col sm:flex-row gap-4 bg-white/80 border border-border rounded-lg p-4 shadow-sm"
                        key={id}
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
            </div>

            {/* Pagination */}
            {items.links && items.links.length > 1 && (
                <div className="mt-8 flex justify-center">
                    {items.links.map((link, idx) => {
                        // Remove HTML from label, simple rendering
                        const label = link.label.replace(/(<([^>]+)>)/gi, '');
                        if (!link.url) {
                            return (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded text-muted-foreground"
                                    aria-disabled="true"
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            );
                        }
                        return (
                            <Link
                                key={idx}
                                href={link.url}
                                preserveScroll
                                className={`px-3 py-1 rounded border ${link.active
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'border-border hover:bg-accent'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })}
                </div>
            )}
        </UserLayout>
    );
}
