<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
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
            "id"           => $this->id,
            "user_id"      => $this->user_id,
            "order_number" => $this->order_number,
            "status"       => $this->status,
            "payment_id"   => $this->payment_id,
            "amount"       => $this->amount,
            "tax"          => $this->tax,
            "discount"     => $this->discount,
            "total"        => $this->total,
            "address_id"   => $this->address_id,
            "remark"       => $this->remark,
            "created_at"   => $this->created_at,
            "updated_at"   => $this->updated_at,
            "items_count"  => $this->items_count,
            "items"        => OrderIndexResource::collection($this->whenLoaded('items')),
        ];
        return $data;
    }
}
