<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $price = floatval($this->price);
        $mrp   = floatval($this->mrp);

        $hasDiscount = $mrp > $price;

        $data = [
            'id'             => $this->id,
            'name'           => $this->name,
            'description'    => $this->description,
            'price'          => round($price, 2),
            'category_id'    => $this->category_id,
            'slug'           => $this->slug,
            'image'          => $this->image ? asset("storage/{$this->image}") : null,
            'images'         => $this->images->map(fn($img) => asset(path: "storage/{$img->image}")),
            'reviews'        => new CommentResource($this->reviews),
            'review_count'   => $this->reviews->count(),
            'average_rating' => round($this->reviews->avg('rating'), 1),
        ];

        if ($hasDiscount) {
            $discount         = (($mrp - $price) / $mrp) * 100;
            $data['mrp']      = round($mrp, 2);
            $data['discount'] = round($discount); // whole number (e.g., 15%)
        }

        return $data;
    }
}
