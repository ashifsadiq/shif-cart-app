import AdminProductComponent from '@/components/admin/AdminProductComponent';
import PropsPagination from '@/components/ui/propsPagination';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type ProductsProps = {
    products: {
        data: Array<any>;
        links?: any;
        meta?: any;
    };
};

const Products = (props: ProductsProps) => {
    const { data, links, meta } = props.products;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: route('products'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-3 xl:grid-cols-4">
                    {data.map((product) => (
                        <AdminProductComponent key={product.id} product={product} />
                    ))}
                </div>
                <PropsPagination meta={meta} />
            </div>
        </AppLayout>
    );
};

export default Products;
