<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payinfo extends Model
{
    use HasFactory;

    protected $table = 'payinfo';

    protected $guarded = [
        "id",
    ];
}
