// --- 1. Interactive Constellation Engine ---
const canvas = document.getElementById('interactive-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: -1000, y: -1000 };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

class Node {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4; // Gentle drift
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseRadius = Math.random() * 2 + 1.5;
        this.radius = this.baseRadius;
        // Enterprise Blue Colors
        this.color = Math.random() > 0.5 ? '2, 132, 199' : '14, 165, 233'; 
        this.alpha = Math.random() * 0.3 + 0.1;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.radius = this.baseRadius + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / 12000); 
    for(let i=0; i<particleCount; i++) {
        particles.push(new Node());
    }
}

let time = 0;
function animate() {
    ctx.clearRect(0, 0, width, height);
    time += 1;
    
    // Spotlight
    if (mouse.x > -100) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 500);
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.06)');
        gradient.addColorStop(0.5, 'rgba(2, 132, 199, 0.03)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 500, 0, Math.PI * 2);
        ctx.fill();
    }

    particles.forEach(p => {
        p.update(time);
        p.draw();

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const connectDistance = 250;

        if (dist < connectDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const opacity = 1 - (dist / connectDistance);
            ctx.strokeStyle = `rgba(${p.color}, ${opacity * 0.3})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${opacity * 0.8})`;
            ctx.fill();
        }
    });

    requestAnimationFrame(animate);
}

initParticles();
animate();


// --- 2. 3D Tilt Effect ---
const cards = document.querySelectorAll('.tilt-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});


// --- 3. Magnetic Buttons ---
const magneticWraps = document.querySelectorAll('.magnetic-wrap');
magneticWraps.forEach(wrap => {
    const btn = wrap.querySelector('button');
    wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});


// --- 4. Stats Counter ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            const counters = entry.target.querySelectorAll('.count-up');
            if(counters.length > 0) {
                counters.forEach(c => {
                    if(c.innerText === '0') animateValue(c, 0, parseFloat(c.getAttribute('data-target')), 2000);
                });
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = progress * (end - start) + start;
        obj.innerHTML = (end % 1 !== 0) ? current.toFixed(1) : Math.floor(current);
        if (progress < 1) window.requestAnimationFrame(step);
        else obj.innerHTML = end;
    };
    window.requestAnimationFrame(step);
}