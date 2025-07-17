<?php
namespace App\Http\Controllers;

use App\Models\Addresses;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function userAddress(Request $request)
    {
        return Addresses::where('user_id', auth()->user()->id)->paginate();
    }
}
