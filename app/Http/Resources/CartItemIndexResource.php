<?php
namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemIndexResource extends JsonResource
{
    public static $wrap = null;
public function toArray(Request $request): array
{
    return [
        'id'         => $this->id,
        'product' => new ProductIndexResource(Product::find($this->product_id)),
        'quantity'   => $this->quantity,
    ];
    //  return parent::toArray($request);
}

}
