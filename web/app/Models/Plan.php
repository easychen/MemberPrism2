<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Content;

class Plan extends Model
{
    use HasFactory;

    protected $guarded = [
        "id",
    ];

    public function contents()
    {
        return $this->belongsToMany(Content::class,'content_plans','plans_id' , 'content_id');
    }
}
