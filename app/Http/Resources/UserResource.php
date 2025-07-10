<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // [
        //                 'name'    => $review->user->name,
        //                 'picture' => $review->user->picture
        //                 ? asset("storage/{$review->user->picture}")
        //                 : asset('assets/img/no-user.png'),
        //             ]
        return parent::toArray($request);
    }
}
