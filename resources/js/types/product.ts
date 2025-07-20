import { User } from ".";

export interface Product {
    id?: number;
    category_id?: number;
    name?: string;
    slug?: string;
    description?: string;
    price?: string;
    mrp?: string;
    review?: number;
    review_count?: number;
    stock_quantity?: number;
    cartItem?: number;
    image?: string;
    is_featured?: boolean;
    available_from?: string;
    available_to?: string;
    discount_expires_at?: string;
    weight?: number;
    dimensions?: string;
    created_at?: string;
    updated_at?: string;
}
export interface ProductPagination {
    data: Product[];
    current_page: Number;
}
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    created_at: string;
    updated_at: string;
}
export interface CategoryPagination {
    data: Category[];
    current_page: Number;
}
export interface ProductImage {
    // ["id","product_id","image_path","position","created_at","updated_at"]
    id: number;
    product_id: number;
    image_path: string;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface ProductReview {
    id: number;
    rating: number;
    title: string;
    comment: string;
    user: User;
}