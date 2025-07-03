import { Link, usePage } from '@inertiajs/react';
type AuthProps = {
    user?: {
        // Add more user fields as needed
        id?: number;
        name?: string;
        [key: string]: any;
    } | null;
};

const Navbar = () => {
    const { auth } = usePage().props as unknown as { auth: AuthProps };
    return (
        <header className="w-full bg-red-400 p-2 text-sm not-has-[nav]:hidden">
            <nav className="flex items-center justify-between gap-4">
                <div>
                    <Link
                        href={route('home')}
                        className="flex items-center gap-2"
                    >
                        <img
                            src="https://bit.ly/4l6V3md"
                            alt="ShifCart Logo"
                            className="h-8 w-auto rounded-full"
                        />
                        <span className="font-extrabold text-3xl">{import.meta.env.VITE_APP_NAME}</span>
                    </Link>
                </div>
                <div>
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
