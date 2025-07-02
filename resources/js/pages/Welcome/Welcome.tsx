import PropsPagination from '@/components/ui/propsPagination';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import CategoryComponent from './CategoryComponent';
import ProductsComponent from './ProductsComponent';
import SkeletonLoader from './SkeletonLoader';

export default function Welcome(props: SharedData) {
    const { categories, products } = usePage<SharedData>().props;
    const [productsData, setProductsData] = useState({ ...products });
    const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
    const [isProductLoading, setIsProductLoading] = useState(!false);

    // Pagination: Categories
    const goToCategoryPage = (page: number) => {
        router.get(
            route('homepage'),
            { category_page: page, product_page: productsData.current_page },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };
    

    // Pagination: Products
    const goToProductPage = (page: number) => {
        router.get(
            route('homepage'),
            { category_page: categories.current_page, product_page: page },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    // Optional handler: if you plan to filter products by selected category

    const handleCategoryChange = async (categoryId: number | null) => {
        setCurrentCategoryId(categoryId);

        try {
            const response = await axios.get(route('products.index'), {
                params: {
                    category_id: categoryId,
                },
            });

            // Update your local product data here
            const productData = response.data;
            // Example: if you have useState for products:
            setProductsData({ ...productData, ...productData.meta });

            console.table(productData);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        console.table(products);
        // Future logic for when currentCategoryId changes
    }, []);
    // Object.keys
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <Navbar />
                <CategoryComponent currentCategoryId={currentCategoryId} setCurrentCategoryId={handleCategoryChange} categoryData={categories.data} />
                <PropsPagination links={categories.links} onPageChange={goToCategoryPage} />
                <ProductsComponent productData={productsData.data} />
                <PropsPagination links={productsData.links} onPageChange={goToProductPage} />
            </div>
        </>
    );
}
