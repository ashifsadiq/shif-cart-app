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
    public function toArray(Request $request): array
    {
        // return [
        //     'id'           => $this->id,
        //     'user_id'      => $this->user_id,
        //     'order_number' => $this->order_number,
        //     'status'       => $this->status,
        //     'payment_id'   => $this->payment_id,
        //     'amount'       => $this->amount,
        //     'tax'          => $this->tax,
        //     'discount'     => $this->discount,
        //     'total'        => $this->total,
        //     'address_id'   => $this->address_id,
        //     'remark'       => $this->remark,
        //     'created_at'   => $this->created_at,
        //     'updated_at'   => $this->updated_at,
        // ];
        return parent::toArray($request);
    }
}
