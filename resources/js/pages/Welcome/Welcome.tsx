import PropsPagination from '@/components/ui/propsPagination';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import CategoryComponent from './CategoryComponent';
import ProductsComponent from './ProductsComponent';
import { useState } from 'react';
export default function Welcome(props: SharedData) {
    const pageProps = usePage<SharedData>().props;
    const categories = pageProps.categories;
    const products = pageProps.products;

    const [currentCategoryId, setCurrentCategoryId] = useState(null)

    const goToCategoryPage = (page: Number) => {
        router.get(
            route('homepage'),
            { category_page: page, product_page: products.current_page },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const goToProductPage = (page: Number) => {
        router.get(
            route('homepage'),
            { category_page: categories.current_page, product_page: page },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };
    // return JSON.stringify(Object.keys(products.data[0]))
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <Navbar />
                <CategoryComponent currentCategoryId={currentCategoryId}  setCurrentCategoryId={setCurrentCategoryId} categoryData={categories.data} />
                <PropsPagination links={categories.links} />
                <ProductsComponent productData={products.data} />
                <PropsPagination links={products.links} />
            </div>
        </>
    );
}
