// ============================================================================
// 1. TAB ROUTING ENGINE (SPA Controller)
// ============================================================================
function switchTab(tabId) {
    const views = document.querySelectorAll('.tab-view');
    views.forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });

    const selectedView = document.getElementById(`tab-${tabId}`);
    if (selectedView) {
        selectedView.classList.remove('hidden');
        setTimeout(() => selectedView.classList.add('active'), 15);
    }

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        hamburgerBtn.classList.remove('open');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// 2. 2-LINE HAMBURGER TO 'X' CONTROLLER
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            mobileMenu.classList.toggle('hidden');
        });
    }

    initChart();
    initParticles();
});

// ============================================================================
// 3. COWEAR INTERACTIVE VENTILATION SANDBOX
// ============================================================================
let isVentilated = false;
function toggleVentilation() {
    const bubble = document.getElementById('ar-bubble');
    const readout = document.getElementById('ppm-readout');
    const btn = document.getElementById('vent-btn');
    
    if (!bubble || !readout || !btn) return;

    if (!isVentilated) {
        bubble.className = "w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_40px_rgba(0,255,135,0.8)] flex items-center justify-center text-center transition-all duration-700 cursor-pointer select-none";
        bubble.innerHTML = "<span class='mono text-[11px] font-extrabold text-black'>SAFE<br/>ZONE</span>";
        readout.innerText = "830 PPM [VENTILATED SAFE]";
        readout.className = "mono text-xs font-bold text-emerald-400 bg-black/70 px-3.5 py-1.5 rounded-lg border border-emerald-500/40";
        btn.innerHTML = "<i class='fa-solid fa-check mr-2 text-sm'></i><span>DESK MICRO-ZONE VENTILATED (-820 PPM)</span>";
        btn.className = "w-full py-4 bg-emerald-500 text-black font-extrabold text-xs mono rounded-xl transition-all shadow-neon-emerald flex items-center justify-center space-x-2.5";
        isVentilated = true;
    } else {
        bubble.className = "w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_0_50px_rgba(255,62,108,0.7)] flex items-center justify-center text-center transition-all duration-700 animate-pulse cursor-pointer select-none";
        bubble.innerHTML = "<span class='mono text-xs font-bold text-white drop-shadow'>CLICK TO<br/>VENTILATE</span>";
        readout.innerText = "1650 PPM [HAZARDOUS]";
        readout.className = "mono text-xs font-bold text-white bg-black/70 px-3.5 py-1.5 rounded-lg border border-white/10";
        btn.innerHTML = "<i class='fa-solid fa-fan animate-spin text-sm mr-2'></i><span>ACTIVATE TARGETED AIRFLOW FAN</span>";
        btn.className = "w-full py-4 bg-coral-500 hover:bg-coral-600 text-black font-extrabold text-xs mono rounded-xl transition-all shadow-neon-coral flex items-center justify-center space-x-2.5";
        isVentilated = false;
    }
}

// ============================================================================
// 4. POHAR RAFT CONSENSUS LEADER ELECTION SIMULATOR
// ============================================================================
function simulateRaft() {
    const nodes = document.querySelectorAll('.raft-node');
    const latencyEl = document.getElementById('latency-val');
    if (!nodes.length || !latencyEl) return;
    
    nodes.forEach(n => {
        n.className = "raft-node p-4 bg-black/80 rounded-xl border border-white/10 text-center mono text-xs transition-all duration-300";
        n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-slate-500 font-semibold'>CANDIDATE</span>";
    });

    setTimeout(() => {
        const leaderIndex = Math.floor(Math.random() * 6);
        nodes.forEach((n, idx) => {
            if (idx === leaderIndex) {
                n.className = "raft-node p-4 bg-cyan-500/20 rounded-xl border border-cyan-400 text-center mono text-xs text-white shadow-neon-cyan scale-105 transition-all duration-300";
                n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-cyan-300 font-extrabold'>CLUSTER LEADER</span>";
            } else {
                n.className = "raft-node p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-center mono text-xs text-slate-300 transition-all duration-300";
                n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-emerald-400 font-semibold'>FOLLOWER (SYNCED)</span>";
            }
        });
        const latency = (Math.random() * (33.8 - 24.1) + 24.1).toFixed(2);
        latencyEl.innerText = `${latency} µs`;
    }, 350);
}

// ============================================================================
// 5. CHART.JS EFFICACY ANALYTICS ENGINE
// ============================================================================
function initChart() {
    const chartEl = document.getElementById('efficacyChart');
    if (!chartEl) return;
    const ctxChart = chartEl.getContext('2d');
    
    new Chart(ctxChart, {
        type: 'bar',
        data: {
            labels: ['S1 Suite', 'S2 Suite', 'Office Desk', 'Home Kitchen', 'Food Diner', 'Research Lab'],
            datasets: [
                {
                    label: 'Max CO₂ (Unmitigated)',
                    data: [1203, 959, 1476, 1118, 1307, 1709],
                    backgroundColor: 'rgba(255, 62, 108, 0.85)',
                    borderColor: '#FF3E6C',
                    borderWidth: 1.5,
                    borderRadius: 8
                },
                {
                    label: 'Min CO₂ (Post-AR Mitigation)',
                    data: [724, 676, 752, 767, 729, 778],
                    backgroundColor: 'rgba(0, 255, 135, 0.85)',
                    borderColor: '#00FF87',
                    borderWidth: 1.5,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0F1626',
                    titleFont: { family: 'Inter', size: 13, weight: 'bold' },
                    bodyFont: { family: 'JetBrains Mono', size: 12 },
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderWidth: 1,
                    padding: 14
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94A3B8', font: { family: 'JetBrains Mono' } },
                    title: { display: true, text: 'CO₂ Concentration (PPM)', color: '#94A3B8', font: { weight: 'bold', size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#F8FAFC', font: { family: 'Inter', weight: '600' } }
                }
            }
        }
    });
}

// ============================================================================
// 6. BIBTEX CLIPBOARD COPIER
// ============================================================================
function copyBibtex() {
    const codeEl = document.getElementById('bibtex-code');
    const btn = document.getElementById('copy-btn');
    if (!codeEl || !btn) return;
    
    navigator.clipboard.writeText(codeEl.innerText);
    btn.innerHTML = "<i class='fa-solid fa-check mr-1.5'></i>COPIED TO CLIPBOARD!";
    btn.className = "mono text-xs text-emerald-400 font-extrabold transition-colors flex items-center";
    setTimeout(() => {
        btn.innerHTML = "<i class='fa-regular fa-copy mr-1.5'></i>COPY BIBTEX";
        btn.className = "mono text-xs text-cyan-400 hover:text-white transition-colors font-bold flex items-center";
    }, 2500);
}

// ============================================================================
// 7. AMBIENT KINETIC PARTICLE FIELD
// ============================================================================
function initParticles() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 0.5;
            this.color = Math.random() > 0.6 ? 'rgba(0, 240, 255, 0.35)' : (Math.random() > 0.3 ? 'rgba(0, 255, 135, 0.25)' : 'rgba(255, 62, 108, 0.25)');
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}
// ============================================================================
// 9. HD CINEMA FACADE CONTROLLER
// ============================================================================
function loadVideo(container, videoId) {
    // Instantly inject the autoplaying HD iframe into the container
    container.innerHTML = `<iframe class="absolute top-0 left-0 w-full h-full border-0" 
        src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1&modestbranding=1&vq=hd1080" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>`;
    
    // Remove the cursor and hover effects once playing
    container.onclick = null;
    container.classList.remove('cursor-pointer', 'group');
}