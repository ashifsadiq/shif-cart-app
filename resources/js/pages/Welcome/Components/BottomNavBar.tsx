import React from "react";
import { Link } from '@inertiajs/react';

type BottomNavItem = { icon: React.ReactNode; label: string; href: string; active?: boolean; badgeCount?: number };
type BottomNavBarProps = { items: BottomNavItem[] };

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ items }) => (
  <nav className="fixed bottom-0 w-full bg-white border-t flex justify-between items-center px-2 py-2 md:hidden z-50">
    {items.map((item, idx) => (
      <Link key={idx} href={item.href}
        className={`flex flex-col items-center relative text-xs font-medium ${
          item.active ? "text-primary" : "text-gray-600"
        }`}>
        {item.icon}
        <span>{item.label}</span>
        {item.badgeCount! > 0 && (
          <span className="absolute top-1 right-3 bg-red-500 rounded-full w-5 h-5 flex justify-center items-center text-[10px] text-white">
            {item.badgeCount}
          </span>
        )}
      </Link>
    ))}
  </nav>
);
