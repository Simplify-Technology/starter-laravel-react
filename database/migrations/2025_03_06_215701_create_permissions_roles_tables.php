<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('roles', function(Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('label')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function(Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('label')->nullable();
            $table->timestamps();
        });

        Schema::create('permission_role', function(Blueprint $table): void {
            $table->foreignId('role_id')->constrained();
            $table->foreignId('permission_id')->constrained();
            $table->primary(['role_id', 'permission_id']);
        });

        // Relacionamento entre usuários e roles
        Schema::create('role_user', function(Blueprint $table): void {
            $table->foreignId('user_id')->constrained();
            $table->foreignId('role_id')->constrained();
            $table->primary(['user_id', 'role_id']);
        });

        Schema::create('permission_user', function(Blueprint $table): void {
            $table->foreignId('user_id')->constrained();
            $table->foreignId('permission_id')->constrained();
            $table->primary(['user_id', 'permission_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permission_user');
    }
};
