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
            'price'        => round(floatval($this->price), 2),
            'image'        => $this->image ? asset("storage/{$this->image}") : null,
            'review_count' => $this->reviews_count ?? $this->reviews()->count(),
        ];
        $hasDiscount = $mrp > $price;
                if ($hasDiscount) {
            $discount         = (($mrp - $price) / $mrp) * 100;
            $data['mrp']      = round($mrp, 2);
            $data['discount'] = round($discount); // whole number (e.g., 15%)
        }
        return $data;
    }
}
