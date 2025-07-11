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
            'price'          => number_format((float) $this->price, 2),
            'category'       => array_merge(
                $this->category ? $this->category->toArray() : [],
                [
                    'image' => $this->category && $this->category->image ? asset("storage/{$this->category->image}") : null,
                ]
            ),
            'slug'           => $this->slug,
            'image'          => $this->image ? asset("storage/{$this->image}") : asset('assets/img/no-image-available.png'),
            'images'         => $this->images->map(
                fn($img) => $img->image ? asset("storage/{$img->image}") : asset('assets/img/no-image-available.png')
            ),
            'reviews'        => $this->reviews()
                ->with('user')
                ->orderBy('rating', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(fn($review) => new CommentResource($review)),
            'review_count'   => $this->reviews->count(),
            'average_rating' => round($this->reviews->avg('rating'), 1),
        ];

        if ($hasDiscount) {
            $data['discount'] = $this->discount; // whole number (e.g., 15%)
            $data['mrp']      = number_format((float) $this->mrp, 2);
        }

        return $data;
    }
}
