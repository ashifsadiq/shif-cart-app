import { User } from ".";
import { Product } from "./product";

export interface ProductReview {
    id?: number;
    user_id?: User["id"];
    product_id?: Product["id"];
    rating: number;
    title?: string;
    comment?: string;
    user: User; // or User[] if it's meant to be an array, but typically it's a single User
}
