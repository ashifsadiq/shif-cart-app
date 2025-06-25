import PropsPagination from '@/components/ui/propsPagination';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Navbar from './Components/Navbar';

export default function Welcome(props: SharedData) {
    const { categories, products } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <Navbar />
                <div className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-3 xl:grid-cols-4">
                    {categories.data.map((cat) => (
                        <div key={cat.id} className="rounded border p-4">
                            <img src={`/storage/${cat.image}`} alt={cat.name} className="mb-2 h-24 w-full object-cover" />
                            <h2 className="text-xl font-bold">{cat.name}</h2>
                        </div>
                    ))}
                </div>
                <PropsPagination links={categories.links} />
                <div className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-3 xl:grid-cols-4">
                    {products.data.map((cat) => (
                        <div key={cat.id} className="rounded border p-4">
                            <img src={`${cat.image_url}`} alt={cat.name} className="mb-2 h-24 w-full object-cover" />
                            <h2 className="text-xl font-bold">{cat.name}</h2>
                        </div>
                    ))}
                </div>
                <PropsPagination links={products.meta.links} />
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse justify-center lg:max-w-4xl lg:flex-row">
                        <h1 className="mb-1 text-7xl font-medium">Let's get started</h1>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
