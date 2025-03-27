class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 100;
        this.alive = true;
        this.size = 20;
        this.speed = 1.5;
    }

    update(playerX, playerY) {
        if (!this.alive) return;

        // Simple AI - move toward player
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 50) { // Only move if not too close
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }

    draw(ctx, playerX, playerY, playerAngle) {
        if (!this.alive) return;

        // Simple 3D projection
        const relX = this.x - playerX;
        const relY = this.y - playerY;
        
        // Rotate based on player view
        const rotX = relX * Math.cos(-playerAngle) - relY * Math.sin(-playerAngle);
        const rotY = relX * Math.sin(-playerAngle) + relY * Math.cos(-playerAngle);
        
        if (rotY <= 0) return; // Behind player
        
        // Project to screen
        const scale = 100 / rotY;
        const projX = (rotX * scale) + (ctx.canvas.width / 2);
        const projY = (ctx.canvas.height / 2) - (this.size * scale);
        const projSize = this.size * scale;
        
        // Draw enemy
        ctx.fillStyle = this.alive ? 'red' : 'gray';
        ctx.fillRect(projX - projSize/2, projY, projSize, projSize);
        
        // Draw health bar
        if (this.alive) {
            const healthWidth = projSize * (this.health / 100);
            ctx.fillStyle = 'red';
            ctx.fillRect(projX - projSize/2, projY - 10, projSize, 5);
            ctx.fillStyle = 'green';
            ctx.fillRect(projX - projSize/2, projY - 10, healthWidth, 5);
        }
    }
}

// Weapon class
class Weapon {
    constructor(name, damage, ammo, maxAmmo, fireRate) {
        this.name = name;
        this.damage = damage;
        this.ammo = ammo;
        this.maxAmmo = maxAmmo;
        this.fireRate = fireRate;
        this.lastFired = 0;
    }

    canFire() {
        return this.ammo > 0 && Date.now() - this.lastFired > 1000/this.fireRate;
    }

    fire() {
        if (this.canFire()) {
            this.ammo--;
            this.lastFired = Date.now();
            return true;
        }
        return false;
    }

    reload(availableAmmo) {
        const needed = this.maxAmmo - this.ammo;
        const taken = Math.min(needed, availableAmmo);
        this.ammo += taken;
        return taken;
    }
}
