<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecentlyViewedProduct extends Model
{
    protected $fillable = ['user_id', 'product_id', 'viewed_at'];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
