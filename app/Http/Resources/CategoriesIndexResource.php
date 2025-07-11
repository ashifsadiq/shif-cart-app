<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoriesIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"          => $this->id,
            "name"        => $this->name,
            "slug"        => $this->slug,
            "description" => $this->description,
            "image"       => $this->image ? asset("storage/{$this->image}") : asset('assets/img/no-image-available.png'),
            "created_at"  => $this->created_at,
            "updated_at"  => $this->updated_at,
        ];
    }
}
