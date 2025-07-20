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
import CartActions from './CartActions';
type Props = {
    name: Product['name'];
    auth: User;
    id: Product['id'];
    description: Product['description'];
    price: Product['price'];
    category: Category;
    slug: Product['slug'];
    image: Product['image'];
    images: Array<string>;
    reviews: ProductReview[];
    review_count: number;
    average_rating: number;
    mrp: string;
    discount: number;
    cartItem: Product['cartItem']
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
        image,
        images,
        reviews,
        mrp,
        discount,
        cartItem
    } = props;
    const allProductImages: string[] = [image ?? "", ...images]
    return (
        <UserLayout itemScope itemType="https://schema.org/Product" className={'py-10'} customTitle={`${name} ${appName} : ${category?.name}`}>
            <div className="mx-auto grid grid-cols-1 gap-3 p-1 md:p-4 lg:grid-cols-3">
                <ProductDetailedImages productImages={allProductImages} />
                <div className="col-span-2 gap-4">
                    <H1 itemProp={"name"}>{name}</H1>
                    <Paragraph itemProp='description' lineClampEnable>{description}</Paragraph>
                    <HorizontalRule />
                    <ProductDetailedPrice className='gap-4' discount={discount} mrp={mrp ?? ''} price={price ?? ''} />
                    <CartActions
                        product_id={id}
                        isAvailable={true}
                        className='max-w-1/4 pt-4'
                        user={auth}
                        cartItem={cartItem}
                    />
                </div>
                <div></div>
            </div>
            <ProductReviews className='p-1 md:p-4' reviews={reviews} />
        </UserLayout>
    );
};

export default ProductDetails;
