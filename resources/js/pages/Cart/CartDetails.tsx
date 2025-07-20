import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UserLayout from '@/layouts/user-layout';
import CartActions from '../Product/CartActions';
import { Product } from '@/types/product';
import { User } from '@/types';
import { apiPost } from '@/lib/http';

type CartItem = {
  id?: Product['id'];
  product?: Product;
  quantity?: number;
};

type CartDetailsProps = {
  auth: User;
  no_of_items?: number;
  items?: { data?: CartItem[] };
  total?: number;
};

const CartDetails = ({
  auth,
  no_of_items = 0,
  items,
  total = 0,
}: CartDetailsProps) => {
  const [grandTotal, setGrandTotal] = useState(total);

  // Handle cart updates and reload only the necessary parts
  const proceedToCheckout = async () => {
    try {
      const response = await apiPost('orders')
      router.visit(route('cart.proceedOrder', { order_number: response.order_number }), {
        method: 'get',
        preserveScroll: true,
      });
      console.log('response.order_number', JSON.stringify(response.order_number, null, 2))
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  }
  const handleCartUpdate = () => {
    router.reload({
      replace: true,
      only: ['total'],
      onSuccess: (page) => {
        if (page.props.total) setGrandTotal(page.props.total);
      },
    });
  };

  // Empty cart UI
  if (!items?.data?.length) {
    return (
      <UserLayout className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Your cart is empty
          </h2>
          <Button
            variant="link"
            onClick={() => router.visit('/products')}
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Cart Items List */}
        <div className="flex-1 space-y-3">
          {items.data.map((item, index) => (
            <div
              key={item.id ?? index}
              className="flex flex-col sm:flex-row gap-3 w-full p-3 rounded-lg border border-border/40 bg-card transition-all hover:shadow-sm"
            >
              <div className="flex-shrink-0">
                <picture>
                  <source
                    srcSet={item.product?.image}
                    type="image/webp"
                  />
                  <img
                    src={item.product?.image}
                    alt={item.product?.name ?? 'Product Image'}
                    className="w-32 h-full object-contain bg-foreground/5 rounded-lg"
                    width="128"
                    height="128"
                    loading="lazy"
                  />
                </picture>
              </div>
              <div className="flex-1 flex flex-col gap-1 sm:gap-2 p-2">
                <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
                <p className="text-base font-medium">
                  Price: {item.product?.price}
                </p>
                <div className="mt-2">
                  <CartActions
                    product_id={item.product?.id}
                    isAvailable={true}
                    minQty={0}
                    user={auth}
                    cartItem={item.quantity}
                    onAddToCart={handleCartUpdate}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary (Sticky on Desktop/Tablet, Bottom on Mobile) */}
        <div
          className={cn(
            'lg:sticky top-6 h-fit',
            'w-full sm:w-96 md:w-80 xl:w-96',
            'bg-card rounded-lg p-4 border border-border/40',
            'transition-all',
            // On mobile, this is a bottom bar (fixed, but padding handled by UserLayout)
            'fixed bottom-0 left-0 right-0 z-50 shadow-lg',
            'lg:relative lg:bg-inherit lg:shadow-none lg:border-0'
          )}
        >
          <h2 className="font-bold text-lg">Order Summary</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {no_of_items} {no_of_items === 1 ? 'item' : 'items'}
          </p>
          <div className="flex justify-between font-semibold mt-4">
            <span>Total</span>
            <span>{grandTotal}</span>
          </div>
          <Button
            size="lg"
            variant="secondary"
            disabled={grandTotal == 0}
            className={cn("w-full mt-4 rounded-full", {
              'opacity-50 cursor-not-allowed': grandTotal == 0
            })}
            onClick={proceedToCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </UserLayout>
  );
};

export default CartDetails;
