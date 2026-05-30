// Responsive Navigation Bar
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Interactive Dot Matrix Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const spacing = 35; // Spacing between dots
let mouse = { x: -1000, y: -1000, radius: 150 };

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}

class Particle {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = 2.5; // Size of dots
        this.friction = 0.85; // Air friction to stop indefinitely sliding
        this.springFactor = 0.05; // Spring force returning to original pos
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Interaction with mouse pointer
        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            
            let directionX = forceDirectionX * force * -7;
            let directionY = forceDirectionY * force * -7;

            this.vx += directionX;
            this.vy += directionY;
        }

        // Return to base position logic (inertia/spring)
        let dxBase = this.baseX - this.x;
        let dyBase = this.baseY - this.y;
        
        this.vx += dxBase * this.springFactor;
        this.vy += dyBase * this.springFactor;

        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Update dot position
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        // Light violet dots matching theme
        ctx.fillStyle = 'rgba(192, 132, 252, 0.2)'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    let rows = Math.floor(height / spacing);
    let cols = Math.floor(width / spacing);
    
    // Position grid at the center of the screen
    let offsetX = (width - cols * spacing) / 2;
    let offsetY = (height - rows * spacing) / 2;

    for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
            particles.push(new Particle(offsetX + i * spacing, offsetY + j * spacing));
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
        p.update();
        p.draw();
    }
    requestAnimationFrame(animate);
}

// Event Listeners for Interaction
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});
window.addEventListener('mouseleave', () => {
    // Move mouse out of canvas on leave
    mouse.x = -1000;
    mouse.y = -1000;
});
window.addEventListener('click', (e) => {
    // Generate a burst/scatter wave effect originating from the mouse click
    for (let p of particles) {
        let dx = e.x - p.x;
        let dy = e.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) { // burst radius parameter
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            // Push strongly outwards
            p.vx -= forceDirectionX * 30;
            p.vy -= forceDirectionY * 30;
        }
    }
});

// Setup Initial Frame
resize();
animate();