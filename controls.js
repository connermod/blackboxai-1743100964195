// FPS Controls
function setupControls() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'KeyW': player.moving.forward = true; break;
            case 'KeyS': player.moving.backward = true; break;
            case 'KeyA': player.moving.left = true; break;
            case 'KeyD': player.moving.right = true; break;
            case 'Space': shoot(); break;
            case 'KeyR': reload(); break;
        }
    });

    window.addEventListener('keyup', (e) => {
        switch(e.code) {
            case 'KeyW': player.moving.forward = false; break;
            case 'KeyS': player.moving.backward = false; break;
            case 'KeyA': player.moving.left = false; break;
            case 'KeyD': player.moving.right = false; break;
        }
    });

    // Mouse controls
    canvas.addEventListener('click', () => {
        if (ammo > 0) {
            shoot();
        } else {
            reload();
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement === canvas) {
            player.angle += e.movementX * 0.002;
        }
    });

    // Lock pointer when canvas is clicked
    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });
}

function shoot() {
    if (ammo <= 0) {
        reload();
        return;
    }

    ammo--;
    updateHUD();

    // Check if shot hit an enemy
    const ray = castRay(player.x, player.y, player.angle);
    enemies.forEach(enemy => {
        if (enemy.alive) {
            const dist = Math.sqrt(
                Math.pow(enemy.x - ray.x, 2) + 
                Math.pow(enemy.y - ray.y, 2)
            );
            if (dist < 20) { // Hit detection radius
                enemy.health -= 25;
                if (enemy.health <= 0) {
                    enemy.alive = false;
                    score += 100;
                }
            }
        }
    });
}

function reload() {
    if (maxAmmo <= 0) return;
    
    const needed = 30 - ammo;
    const available = Math.min(needed, maxAmmo);
    ammo += available;
    maxAmmo -= available;
    updateHUD();
}
