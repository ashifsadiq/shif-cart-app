<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    // Product.php
    public function cartItem()
    {
        $userId = auth('sanctum')->check()
        ? auth('sanctum')->id()
        : (auth('web')->id() ?? null);

        return $this->hasOne(CartItem::class)->where('user_id', $userId);
    }
}
