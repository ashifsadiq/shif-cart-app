import React, { CSSProperties, MouseEvent, PointerEvent, ReactNode } from 'react'
import { Rating, RatingProps } from 'react-simple-star-rating'
const ProductRating = ({
    readonly,
    initialValue,
    allowFraction,
    size = 20,
    SVGstyle,
    fillColor,
    emptyColor,
    transition,
}: RatingProps) => {
    return (
        <Rating
            readonly
            initialValue={initialValue}
            allowFraction
            size={size}
            SVGstyle={{ display: 'inline-block' }}
            fillColor="#c45500" // Tailwind yellow-400
            emptyColor="#e5e7eb" // Tailwind gray-200
            transition
        />
    )
}

export default ProductRating
