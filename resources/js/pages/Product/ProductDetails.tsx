import PropsViewer from '@/components/PropsViewer';
import H1 from '@/components/ui/h1';
import HorizontalRule from '@/components/ui/horizontal-rule';
import Paragraph from '@/components/ui/paragraph';
import UserLayout from '@/layouts/user-layout';
import { Category, Product } from '@/types/product';
import ProductDetailedImages from './ProductDetailedImages';
import ProductDetailedPrice from './ProductDetailedPrice';
import ProductReviews from './ProductReview';
type Props = {
    category: Category | null;
    product: Product | null;
    productImages: any;
    reviews: any;
};
const appName = import.meta.env.VITE_APP_NAME;
const ProductDetails = (props: Props) => {
    const { product, category, productImages, reviews } = props;
    const allProductImages = Array(1)
        .fill(null)
        .flatMap(() => [product?.image, ...productImages.map((image: any) => image.image)]);
    return (
        <UserLayout className={'py-10'} customTitle={product ? `${product?.name} ${appName} : ${category?.name}` : 'Product Details'}>
            <div className="mx-auto grid grid-cols-1 gap-3 p-1 md:p-4 lg:grid-cols-3">
                <ProductDetailedImages productImages={allProductImages} />
                <div className="col-span-2">
                    <H1>{product?.name}</H1>
                    <Paragraph lineClampEnable>{product?.description}</Paragraph>
                    <HorizontalRule />
                    <ProductDetailedPrice mrp={product?.mrp ?? ''} price={product?.price ?? ''} />
                </div>
                <div></div>
            </div>
            <ProductReviews className='p-1 md:p-4' reviews={reviews} />
            <PropsViewer props={reviews} />
        </UserLayout>
    );
};

export default ProductDetails;
