<?php
namespace App\Http\Resources;

use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = null;
    public function toArray(Request $request): array
    {
        $data = [
            "id"=> $this->id,
            "order_id"=> $this->order_id,
            "product_id"=> $this->product_id,
            "quantity"=> $this->quantity,
            "price"=> $this->price,
            "created_at"=> $this->created_at,
            "updated_at"=> $this->updated_at,
            "product" => new ProductIndexResource($this->whenLoaded('product'))
        ];
        return $data;
    }
}
