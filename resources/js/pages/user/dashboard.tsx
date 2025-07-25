import UserLayout from "@/layouts/user-layout";
import { Link } from "@inertiajs/react";
import { CircleUser, ShoppingCart, Container, CreditCard, Home } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils"; // If you use a custom cn() utility

// Generic type for your quick link
interface QuickLink {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  // For light mode
  bgLight: string;
  iconLight: string;
  ringLight: string;
  // For dark mode
  bgDark: string;
  iconDark: string;
  ringDark: string;
}

const Dashboard = () => {
  const quickLinks: QuickLink[] = [
    {
      title: "Home",
      icon: Home,
      href: route("home"),
      bgLight: "bg-blue-100",
      iconLight: "text-blue-600",
      ringLight: "ring-blue-200",
      bgDark: "bg-blue-900/20",
      iconDark: "text-blue-400",
      ringDark: "ring-blue-400/30",
    },
    {
      title: "Profile Settings",
      icon: CircleUser,
      href: route("profile.edit"),
      bgLight: "bg-emerald-100",
      iconLight: "text-emerald-600",
      ringLight: "ring-emerald-200",
      bgDark: "bg-emerald-900/20",
      iconDark: "text-emerald-400",
      ringDark: "ring-emerald-400/30",
    },
    {
      title: "Cart",
      icon: ShoppingCart,
      href: route("cart.get"),
      bgLight: "bg-purple-100",
      iconLight: "text-purple-600",
      ringLight: "ring-purple-200",
      bgDark: "bg-purple-900/20",
      iconDark: "text-purple-400",
      ringDark: "ring-purple-400/30",
    },
    {
      title: "Orders",
      icon: Container,
      href: route("orders.index"),
      bgLight: "bg-yellow-100",
      iconLight: "text-yellow-600",
      ringLight: "ring-yellow-200",
      bgDark: "bg-yellow-900/20",
      iconDark: "text-yellow-400",
      ringDark: "ring-yellow-400/30",
    },
    {
      title: "Payment Methods",
      icon: CreditCard,
      href: route("orders.index"), // fix: was orders.index
      bgLight: "bg-rose-100",
      iconLight: "text-rose-600",
      ringLight: "ring-rose-200",
      bgDark: "bg-rose-900/20",
      iconDark: "text-rose-400",
      ringDark: "ring-rose-400/30",
    },
  ];

  return (
    <UserLayout className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-primary dark:text-primary-300 mb-6 md:mb-8">
        My Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {quickLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={cn(
              "group flex flex-col justify-center items-center p-6 text-center rounded-xl cursor-pointer",
              "transition-all duration-200 hover:shadow-md dark:hover:shadow-none",
              // Light mode
              link.bgLight,
              `hover:ring-1 hover:${link.ringLight} focus:outline-none focus:ring-2 focus:${link.ringLight}`,
              // Dark mode
              `dark:${link.bgDark} dark:hover:ring-1 dark:hover:${link.ringDark} dark:focus:ring-2 dark:focus:${link.ringDark}`
            )}
          >
            <link.icon
              className={cn(
                "w-8 h-8 mb-3 transition-transform group-hover:scale-110",
                // Light mode
                link.iconLight,
                // Dark mode
                `dark:${link.iconDark}`
              )}
              strokeWidth={1.5}
            />
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">
              {link.title}
            </h2>
          </Link>
        ))}
      </div>
    </UserLayout>
  );
};

export default Dashboard;
