// FPS Game Constants
const FOV = 60 * (Math.PI / 180); // 60 degree field of view
const WALL_HEIGHT = 100;
const MOVEMENT_SPEED = 5;
const ROTATION_SPEED = 0.05;

// Game State
let gameRunning = false;
let score = 0;
let playerHealth = 100;
let ammo = 30;
let maxAmmo = 120;

// Player State
const player = {
    x: 100,
    y: 100,
    angle: 0,
    moving: {
        forward: false,
        backward: false,
        left: false,
        right: false
    }
};

// World Map (1 = wall, 0 = empty space)
const worldMap = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
];

// Enemies
const enemies = [
    { x: 200, y: 200, health: 100, alive: true }
];

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize Game
function init() {
    // Set up event listeners
    setupControls();
    
    // Start game loop
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

// Game Loop
function gameLoop(timestamp) {
    if (!gameRunning) return;

    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update player position
    updatePlayerPosition();

    // Render 3D view
    render3DView();

    // Update HUD
    updateHUD();

    // Continue loop
    requestAnimationFrame(gameLoop);
}

function updatePlayerPosition() {
    // Calculate movement vector based on player angle
    const moveX = Math.cos(player.angle) * MOVEMENT_SPEED;
    const moveY = Math.sin(player.angle) * MOVEMENT_SPEED;

    if (player.moving.forward) {
        player.x += moveX;
        player.y += moveY;
    }
    if (player.moving.backward) {
        player.x -= moveX;
        player.y -= moveY;
    }
    if (player.moving.left) {
        player.x += moveY; // Perpendicular movement
        player.y -= moveX;
    }
    if (player.moving.right) {
        player.x -= moveY;
        player.y += moveX;
    }
}

function render3DView() {
    // Simple raycasting implementation
    const numRays = canvas.width;
    const wallWidth = canvas.width / numRays;

    for (let i = 0; i < numRays; i++) {
        const rayAngle = player.angle - FOV/2 + (i/numRays) * FOV;
        const ray = castRay(player.x, player.y, rayAngle);
        
        // Calculate wall height based on distance
        const distance = ray.distance;
        const wallHeight = (canvas.height * WALL_HEIGHT) / distance;
        
        // Draw wall slice
        const wallX = i * wallWidth;
        const wallY = (canvas.height - wallHeight) / 2;
        
        // Shade based on distance
        const shade = Math.min(1, 200 / distance);
        ctx.fillStyle = `rgb(${shade * 255}, ${shade * 100}, ${shade * 50})`;
        ctx.fillRect(wallX, wallY, wallWidth + 1, wallHeight);
    }
}

function castRay(x, y, angle) {
    // Simple raycasting implementation
    let rayX = x;
    let rayY = y;
    let distance = 0;
    let hitWall = false;
    
    while (!hitWall && distance < 100) {
        rayX += Math.cos(angle) * 2;
        rayY += Math.sin(angle) * 2;
        distance += 2;
        
        // Check if ray hit a wall
        const mapX = Math.floor(rayX / 50);
        const mapY = Math.floor(rayY / 50);
        
        if (mapX < 0 || mapX >= worldMap[0].length || 
            mapY < 0 || mapY >= worldMap.length || 
            worldMap[mapY][mapX] === 1) {
            hitWall = true;
        }
    }
    
    return { x: rayX, y: rayY, distance };
}

function updateHUD() {
    // Update ammo display
    document.getElementById('current-ammo').textContent = ammo;
    document.getElementById('total-ammo').textContent = maxAmmo;
    
    // Update health display
    document.querySelector('.health-display span').textContent = playerHealth;
    
    // Update score display
    document.querySelector('.score-display span').textContent = score;
}

// Start the game when assets are loaded
window.addEventListener('load', init);
