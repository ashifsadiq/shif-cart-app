import React from "react";
import { Link } from '@inertiajs/react';

export type HeaderProps = {
  cartCount: number;
  notificationCount: number;
};

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  notificationCount,
}) => (
  <header className="flex items-center justify-between bg-primary px-4 py-2 fixed w-full top-0 z-50 shadow">
    <span className="text-xl font-bold text-white">ShopName</span>
    <div className="flex items-center gap-4">
      <button className="relative">
        <span className="material-icons text-white">shopping_cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 rounded-full text-xs w-5 h-5 text-white flex items-center justify-center">{cartCount}</span>
        )}
      </button>
      <button className="relative">
        <span className="material-icons text-white">notifications</span>
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 rounded-full text-xs w-5 h-5 text-white flex items-center justify-center">{notificationCount}</span>
        )}
      </button>
      <Link href="/profile">
        <img src="https://i.pravatar.cc/40?img=1" alt="Profile" className="w-8 h-8 rounded-full" />
      </Link>
    </div>
  </header>
);