<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductIndexResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $price = floatval($this->price);
        $mrp   = floatval($this->mrp);

        $data = [
            'id'           => $this->id,
            'name'         => $this->name,
            'description'  => $this->description,
            'slug'         => $this->slug,
            'price'        => number_format((float) $this->price, 2),
            'image'        => $this->image ? asset("storage/{$this->image}") : null,
            'review'       => round($this->reviews()->avg('rating'), 1),
            'review_count' => $this->reviews_count ?? $this->reviews()->count(),
        ];
        $hasDiscount = $mrp > $price;
        if ($hasDiscount) {
            $data['discount'] = $this->discount; // whole number (e.g., 15%)
            $data['mrp']      = number_format((float) $this->mrp, 2);
        }
        return $data;
    }
}
