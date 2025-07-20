// resources/js/Pages/Orders/OrdersList.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button'; // Your button component (or use HTML button)
import UserLayout from '@/layouts/user-layout';

export default function OrdersList({ orders }) {
  // Defensive: support both { orders } and just "orders"
  const orderData = orders?.data ?? [];
  const meta = orders?.meta ?? {};
  const links = meta?.links ?? [];

  return (
    <UserLayout className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {orderData.length === 0 ? (
        <div className="py-32 text-center text-muted-foreground">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {orderData.map(order => (
            <Link
              key={order.id}
              href={`/orders/${order.order_number}`}
              className="block transition hover:shadow-lg border rounded-lg bg-background p-4 md:flex md:items-center md:justify-between"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-semibold text-primary">
                    #{order.order_number}
                  </span>
                  <span className={`inline-block rounded px-2 py-0.5 text-xs capitalize
                    ${order.status === 'placed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}
                  `}>
                    {order.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.items_count} item{order.items_count !== 1 && 's'}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>Total: <span className="font-semibold text-foreground">₹{Number(order.total).toLocaleString()}</span></span>
                  <span>Placed: {(new Date(order.created_at)).toLocaleString()}</span>
                  {order.address_id && (
                    <span>
                      Address: <span className="font-mono">#{order.address_id}</span>
                    </span>
                  )}
                </div>
                {order.remark && (
                  <div className="mt-1 text-xs text-foreground">Remark: {order.remark}</div>
                )}
              </div>
              {/* View details button, optional */}
              <div className="mt-2 md:mt-0 md:text-right">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {links && links.length > 1 && (
        <div className="flex justify-center gap-1 mt-4">
          {links.map((link, idx) => {
            // Remove any HTML from the label for safety
            const label = link.label.replace(/(<([^>]+)>)/gi, "");
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
                className={`px-3 py-1 rounded border text-sm
                  ${link.active ? 'bg-primary text-white border-primary' : 'border-border hover:bg-accent'}
                `}
                dangerouslySetInnerHTML={{ __html: label }}
              />
            );
          })}
        </div>
      )}
    </UserLayout>
  );
}
