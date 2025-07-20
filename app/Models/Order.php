<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PLACED  = 'placed';
    protected $fillable         = [
        'user_id',
        'order_number',
        'status',
        'payment_id',
        'amount',
        'tax',
        'discount',
        'total',
        'address_id',
        'remark',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }
}
