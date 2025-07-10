<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $price       = floatval($this->price);
        $mrp         = floatval($this->mrp);
        $hasDiscount = $mrp > $price;

        $data = [
            'id'             => $this->id,
            'name'           => $this->name,
            'description'    => $this->description,
            'price'          => round($price, 2),
            'category_id'    => $this->category_id,
            'slug'           => $this->slug,
            'image'          => $this->image ? asset("storage/{$this->image}") : null,
            'images'         => $this->images->map(
                fn($img) => $img->image? asset("storage/{$img->image}"):null
            ),
            'reviews'        => $this->reviews()
                ->with('user')
                ->orderBy('rating', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(13)
                ->get()
                ->map(fn($review) => [
                    'id'         => $review->id,
                    'rating'     => $review->rating,
                    'title'      => $review->title,
                    'comment'    => $review->comment,
                    'user'       => [
                        'name'    => $review->user->name,
                        'picture' => $review->user->picture
                        ? asset("storage/{$review->user->picture}")
                        : null,
                    ],
                    'created_at' => $review->created_at->toDateTimeString(),
                ]),
            'review_count'   => $this->reviews->count(),
            'average_rating' => round($this->reviews->avg('rating'), 1),
        ];

        if ($hasDiscount) {
            $discount         = (($mrp - $price) / $mrp) * 100;
            $data['mrp']      = round($mrp, 2);
            $data['discount'] = round($discount);
        }

        return $data;
    }
}
