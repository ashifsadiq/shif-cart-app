import PropsViewer from '@/components/PropsViewer';
import H1 from '@/components/ui/h1';
import HorizontalRule from '@/components/ui/horizontal-rule';
import Paragraph from '@/components/ui/paragraph';
import UserLayout from '@/layouts/user-layout';
import { Category, Product, ProductReview } from '@/types/product';
import ProductDetailedImages from './ProductDetailedImages';
import ProductDetailedPrice from './ProductDetailedPrice';
import ProductReviews from './ProductReview';
import { User } from '@/types';
type Props = {
    name: Product['name'];
    auth: User;
    id: Product['id'];
    description: Product['description'];
    price: Product['price'];
    category: Category;
    slug: Product['slug'];
    image: Product['image'];
    images: Array<URL>;
    reviews: ProductReview[];
    review_count: number;
    average_rating: number;
    mrp: string;
    discount: number;
};
const appName = import.meta.env.VITE_APP_NAME;
const ProductDetails = (props: Props) => {
    const {
        name,
        auth,
        id,
        description,
        price,
        category,
        slug,
        image,
        images,
        reviews,
        review_count,
        average_rating,
        mrp,
        discount,
    } = props;
    const allProductImages = [image, ...images]
    return (
        <UserLayout itemScope itemType="https://schema.org/Product" className={'py-10'} customTitle={`${name} ${appName} : ${category?.name}`}>
            <div className="mx-auto grid grid-cols-1 gap-3 p-1 md:p-4 lg:grid-cols-3">
                <ProductDetailedImages productImages={allProductImages} />
                <div className="col-span-2">
                    <H1 itemProp={"name"}>{name}</H1>
                    <Paragraph itemProp='description' lineClampEnable>{description}</Paragraph>
                    <HorizontalRule />
                    <ProductDetailedPrice discount={discount} mrp={mrp ?? ''} price={price ?? ''} />
                </div>
                <div></div>
            </div>
            <ProductReviews className='p-1 md:p-4' reviews={reviews} />
        </UserLayout>
    );
};

export default ProductDetails;
