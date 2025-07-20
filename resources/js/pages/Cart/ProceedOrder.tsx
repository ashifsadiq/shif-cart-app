// ProceedOrder.tsx
import UserLayout from '@/layouts/user-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { PaginatedAddresses } from '@/types/address';
import { apiPost } from '@/lib/http';

type ProceedOrderProps = {
    address: PaginatedAddresses;
    order_id: string;
};

const ProceedOrder = ({ address, order_id }: ProceedOrderProps) => {
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const proceedOrder = () => {
        apiPost('/cart/place-order', {
            address_id: selectedAddressId,
            order_id
        }).then(response => {
            router.visit(`/orders/${order_id}`)
            console.log('response', JSON.stringify(response, null, 2))
        }).catch(error => {
            // Handle network or server error
            console.error('Error placing order:', error.response.data);
            // Optionally show an error notification
        });
    }
    if (!address.data?.length) return (
        <UserLayout className="max-w-2xl mx-auto p-4">
            <div className="bg-card rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold text-center">No Saved Addresses</h2>
                <p className="text-center text-muted-foreground">
                    You don't have any saved addresses yet.
                </p>
                <Button
                    onClick={() => router.visit('/addresses/create')}
                    className="w-full"
                >
                    Add New Address
                </Button>
            </div>
        </UserLayout>
    );

    return (
        <UserLayout className="max-w-2xl mx-auto p-4">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Select Delivery Address</h1>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit('/addresses/create')}
                    >
                        Add New Address
                    </Button>
                </div>

                <div className="space-y-4 grid grid-cols-2 gap-3">
                    {address.data.map((addr) => (
                        <div
                            key={addr.id}
                            className={`
                border rounded-lg p-4 transition-all cursor-pointer h-full
                ${selectedAddressId === addr.id
                                    ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                                    : 'border-border/40 hover:border-primary/30'
                                }
              `}
                            onClick={() => setSelectedAddressId(addr.id)}
                            aria-selected={selectedAddressId === addr.id}
                            role="radiogroup"
                        >
                            <div className="font-medium">{addr.name}</div>
                            <div className="text-sm text-muted-foreground">{addr.phone}</div>
                            <div className="mt-2 text-foreground">
                                {addr.address}
                                <br />
                                {addr.city}, {addr.state} {addr.pincode}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination controls */}
                <div className="flex items-center justify-end gap-2 text-sm">
                    {address.links.map((link, idx) => {
                        if (link.url === null) return (
                            <span key={idx} className="px-3 py-1 text-muted-foreground" dangerouslySetInnerHTML={{ __html: link.label }} />
                        );
                        return (
                            <button
                                key={idx}
                                onClick={() => router.visit(link.url as string, { preserveState: true, preserveScroll: true })}
                                className={`px-3 py-1 rounded ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>

                {/* Checkout action */}
                <div className="mt-8">
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={!selectedAddressId}
                        onClick={() => {
                            if (selectedAddressId) {
                                proceedOrder()
                                // Replace with your actual checkout logic (e.g. router.post)
                            }
                        }}
                    >
                        Deliver to this Address
                    </Button>
                </div>
            </div>
        </UserLayout>
    );
};

export default ProceedOrder;