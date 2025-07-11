import UserLayout from '@/layouts/user-layout';
import { CategoryPagination, ProductPagination } from '@/types/product';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CategoryComponent from './CategoryComponent';
import HeaderCarousel from './HeaderCarousel';
import ProductsComponent from './ProductsComponent';

type Props = {
    categories: CategoryPagination;
    products: ProductPagination;
};
export default function Welcome(props: Props) {
    const { categories, products } = props;
    const [productsData, setProductsData] = useState({ ...products });
    const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
    const [isProductLoading, setIsProductLoading] = useState(!false);

    // Pagination: Categories
    const goToCategoryPage = (page: number) => {
        router.get(
            route('homepage'),
            { category_page: page, product_page: productsData.current_page as unknown as number },
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
            { category_page: categories.current_page as number, product_page: page as number },
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
            console.log(productData.data)
            // Example: if you have useState for products:
            setProductsData({ ...productData, ...productData.meta });
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
        <UserLayout title="Welcome" description="Welcome to our online store! Explore a wide range of products and categories.">
            <HeaderCarousel />
            <CategoryComponent currentCategoryId={currentCategoryId} setCurrentCategoryId={handleCategoryChange} categoryData={categories.data} />
            <ProductsComponent productData={productsData.data} />
        </UserLayout>
    );
}
