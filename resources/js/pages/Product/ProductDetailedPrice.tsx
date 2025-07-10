import React from 'react';

// The interface now explicitly declares that price and mrp are strings
interface ProductPriceDisplayProps {
    price: string; // Expect string from the server
    mrp: string; // Expect string from the server
    discount: number;
}

const ProductPriceDisplay: React.FC<ProductPriceDisplayProps> = ({ price, mrp, discount }) => {

    return (
        <div className="flex flex-col items-start font-sans">
            {/* Price and Discount Section */}
            <div className="mb-1 flex items-baseline">
                {/* Discount Percentage */}
                {/* Only show if discount is positive and mrp is greater than current price */}
                <span className="mr-2 text-2xl font-thin text-red-600 md:text-3xl">-{discount}%</span>

                {/* Current Price */}
                <span className="text-4xl font-bold md:text-5xl">
                    <span className="align-super text-2xl font-normal md:text-3xl" itemProp="priceCurrency" content="INR">
                        ₹
                    </span>
                    <span itemProp="price" content={price.toString()}>
                        {(price)}
                    </span>
                </span>
            </div>

            {/* MRP Section */}
            {/* Only show MRP if it's higher than the current price */}
            <div className="mb-1 text-sm md:text-base">
                <span>M.R.P.:</span>
                <span className="line-through">
                    <span className="font-normal">₹</span>
                    {(mrp)}
                </span>
            </div>
            {/* Tax Information */}
            <p className="text-sm md:text-base">Inclusive of all taxes</p>
        </div>
    );
};

export default ProductPriceDisplay;
