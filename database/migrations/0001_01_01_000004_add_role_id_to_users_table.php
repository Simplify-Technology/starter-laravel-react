<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::table('users', function(Blueprint $table): void {
            $table->foreignId('role_id')->after('is_active')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function(Blueprint $table): void {
            $table->dropColumn('role_id');
        });
    }
};
