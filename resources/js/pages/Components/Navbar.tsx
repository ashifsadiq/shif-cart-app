import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X, Search, User, ShoppingCart, Home, Info, Mail, Settings, ChevronDown } from 'lucide-react';

type AuthProps = {
    user?: {
        id?: number;
        name?: string;
        email?: string;
        avatar?: string;
        [key: string]: any;
    } | null;
};

type NavbarProps = {
    cartItems?: number;
};

const Navbar = ({ cartItems = 0 }: NavbarProps) => {
    const { auth } = usePage().props as unknown as { auth: AuthProps };
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navbar background
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isUserMenuOpen && !(event.target as Element).closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
            if (isSearchOpen && !(event.target as Element).closest('.search-container')) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen, isSearchOpen]);

    // FIX: Proper mobile menu toggle function
    const toggleMobileMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    // FIX: Search toggle function with event handling
    const toggleSearch = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSearchOpen(prev => !prev);
    };

    // FIX: User menu toggle function with event handling
    const toggleUserMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsUserMenuOpen(prev => !prev);
    };

    // FIX: Close mobile menu when nav link is clicked
    const handleNavLinkClick = () => {
        setIsOpen(false);
    };

    const navigationLinks = [
        { href: route('home'), label: 'Home', icon: Home },
        { href: route('home'), label: 'Products' },
        { href: route('home'), label: 'Services' },
        { href: route('home'), label: 'About', icon: Info },
        { href: route('home'), label: 'Contact', icon: Mail },
    ];

    return (
        <>
            {/* Navbar */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/20'
                : 'bg-white shadow-sm'
                }`}>
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                href={route('home')}
                                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                            >
                                <img
                                    src="https://bit.ly/4l6V3md"
                                    alt={`${import.meta.env.VITE_APP_NAME} Logo`}
                                    className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover ring-2 ring-red-400/20"
                                />
                                <span className="font-bold text-xl lg:text-2xl text-gray-900">
                                    {import.meta.env.VITE_APP_NAME}
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
                            {navigationLinks.map((link, linkIndex) => (
                                <Link
                                    key={linkIndex.toString()}
                                    href={link.href}
                                    className="flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 group"
                                >
                                    {link.icon && (
                                        <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    )}
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2 lg:space-x-4">

                            {/* Search Button - FIX: Added proper event handling */}
                            <div className="search-container relative">
                                <button
                                    onClick={toggleSearch}
                                    className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                                    aria-label="Search"
                                >
                                    <Search className="w-5 h-5" />
                                </button>

                                {/* Search Dropdown */}
                                {isSearchOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="mt-3 text-sm text-gray-500">
                                            Try searching for products, services, or help topics
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cart Button (if user is logged in) - FIX: Added event handling */}
                            {auth.user && (
                                <Link
                                    href={route('cart.get')}
                                    className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                                    aria-label="Shopping Cart"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                            {cartItems > 9 ? '9+' : cartItems}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* User Menu - FIX: Added proper event handling */}
                            {auth.user ? (
                                <div className="user-menu-container relative">
                                    <button
                                        onClick={toggleUserMenu}
                                        className="flex items-center space-x-2 p-1.5 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                                        aria-label="User menu"
                                    >
                                        {auth.user.avatar ? (
                                            <img
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-red-400/20"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <span className="hidden lg:block font-medium text-sm">
                                            {auth.user.name}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* User Dropdown */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-medium text-gray-900">{auth.user.name}</p>
                                                <p className="text-sm text-gray-500">{auth.user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    href={route('dashboard')}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                >
                                                    <User className="w-4 h-4 mr-3" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href={route('home')}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                >
                                                    <Settings className="w-4 h-4 mr-3" />
                                                    Settings
                                                </Link>
                                            </div>
                                            <div className="border-t border-gray-100 py-1">
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                >
                                                    Sign out
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href={route('login', { redirect: window.location.pathname + window.location.search })}
                                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="hidden lg:flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button - FIX: Added proper event handling */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                                aria-label="Toggle menu"
                                type="button"
                            >
                                {isOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay - FIX: Added proper click handling */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                >
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                </div>
            )}

            {/* Mobile Menu - FIX: Improved state management and click handling */}
            <div className={`fixed top-16 left-0 right-0 z-50 md:hidden transform transition-all duration-300 ease-in-out ${isOpen
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : '-translate-y-full opacity-0 pointer-events-none'
                }`}>
                <div className="bg-white border-b border-gray-200 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                        {navigationLinks.map((link, linkIndex) => (
                            <Link
                                key={linkIndex.toString()}
                                href={link.href}
                                onClick={handleNavLinkClick}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                            >
                                {link.icon && <link.icon className="w-5 h-5" />}
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}

                        {/* Mobile Search */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* Mobile Auth Actions - FIX: Added proper event handling */}
                        {!auth.user && (
                            <div className="pt-4 border-t border-gray-100 space-y-2">
                                <Link
                                    href={route('login', { redirect: window.location.pathname + window.location.search })}
                                    onClick={handleNavLinkClick}
                                    className="block w-full px-4 py-3 text-center text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={route('register')}
                                    onClick={handleNavLinkClick}
                                    className="block w-full px-4 py-3 text-center bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-200"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}

                        {/* Mobile User Actions - if logged in */}
                        {auth.user && (
                            <div className="pt-4 border-t border-gray-100 space-y-2">
                                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        {auth.user.avatar ? (
                                            <img
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center text-white font-medium">
                                                {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{auth.user.name}</p>
                                            <p className="text-sm text-gray-500">{auth.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={route('dashboard')}
                                    onClick={handleNavLinkClick}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href={route('home')}
                                    onClick={handleNavLinkClick}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Cart {cartItems > 0 && `(${cartItems})`}</span>
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    onClick={handleNavLinkClick}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <span>Sign out</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <div className="h-16 lg:h-20" />
        </>
    );
};

export default Navbar;