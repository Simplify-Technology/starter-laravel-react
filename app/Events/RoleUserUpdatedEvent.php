<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RoleUserUpdatedEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public User $user)
    {
        //
    }

    public function broadcastOn(): Channel
    {
        return new Channel('users.roles');
    }

    public function broadcastWith(): array
    {
        return ['id' => $this->user->id, 'role' => $this->user->roles->first()->name];
    }
}
