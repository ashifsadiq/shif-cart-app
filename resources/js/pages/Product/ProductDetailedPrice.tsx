import React from 'react';

// The interface now explicitly declares that price and mrp are strings
interface ProductPriceDisplayProps {
    price: string; // Expect string from the server
    mrp: string; // Expect string from the server
}

const ProductPriceDisplay: React.FC<ProductPriceDisplayProps> = ({ price, mrp }) => {
    // --- Step 1: Convert string props to numbers internally ---
    const numericCurrentPrice = parseFloat(price);
    const numericMrp = parseFloat(mrp);

    // --- Step 2: Handle cases where conversion might fail (optional, but recommended) ---
    if (isNaN(numericCurrentPrice) || isNaN(numericMrp)) {
        console.error('ProductPriceDisplay received invalid price/MRP strings:', { currentPrice: price, mrp });
        // You might render a fallback UI, throw an error, or use default values
        return <div className="text-red-500">Error: Invalid price data. Please try again later.</div>;
    }

    // --- Step 3: Calculations using the numeric values ---
    const discount = numericMrp - numericCurrentPrice;
    // Ensure mrp is positive to avoid division by zero or negative results for percentage
    const discountPercentage = numericMrp > 0 ? ((discount / numericMrp) * 100).toFixed(0) : '0';

    // Format numbers with commas (Indian numbering system)
    const formatPrice = (price: number) => {
        return price.toLocaleString('en-IN'); // 'en-IN' for Indian currency formatting
    };

    return (
        <div className="flex flex-col items-start font-sans">
            {/* Price and Discount Section */}
            <div className="mb-1 flex items-baseline">
                {/* Discount Percentage */}
                {/* Only show if discount is positive and mrp is greater than current price */}
                {parseFloat(discountPercentage) > 0 && numericMrp > numericCurrentPrice && (
                    <span className="mr-2 text-2xl font-thin text-red-600 md:text-3xl">-{discountPercentage}%</span>
                )}

                {/* Current Price */}
                <span className="text-4xl font-bold md:text-5xl">
                    <span className="align-super text-2xl font-normal md:text-3xl">₹</span>
                    {formatPrice(numericCurrentPrice)}
                </span>
            </div>

            {/* MRP Section */}
            {/* Only show MRP if it's higher than the current price */}
            {numericMrp > numericCurrentPrice && (
                <div className="mb-1 text-sm md:text-base">
                    M.R.P.:{' '}
                    <span className="line-through">
                        <span className="font-normal">₹</span>
                        {formatPrice(numericMrp)}
                    </span>
                </div>
            )}

            {/* Tax Information */}
            <p className="text-sm md:text-base">Inclusive of all taxes</p>
        </div>
    );
};

export default ProductPriceDisplay;
