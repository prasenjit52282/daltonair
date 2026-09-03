// ============================================================================
// 1. DUAL THEME TOGGLE CONTROLLER (Night / Day Switcher)
// ============================================================================
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    }
    updateChartTheme();
}

// ============================================================================
// 2. TAB ROUTING ENGINE (SPA Controller)
// ============================================================================
const VALID_TABS = ['home', 'about', 'dalton', 'powear', 'pohar', 'cinema', 'careers', 'contact'];

function tabIdToPath(tabId) {
    return tabId === 'home' ? '/' : `/${tabId}`;
}

function pathToTabId(pathname) {
    const clean = (pathname.replace(/\/+$/, '') || '/').toLowerCase();
    if (clean === '/') return 'home';
    const tabId = clean.slice(1);
    return VALID_TABS.includes(tabId) ? tabId : 'home';
}

function switchTab(tabId, updateHistory = true) {
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
    
    if (['dalton', 'powear', 'pohar'].includes(tabId)) {
        const solBtn = document.getElementById('solutions-nav-btn');
        if (solBtn) solBtn.classList.add('active');
    } else {
        navBtns.forEach(btn => {
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
                btn.classList.add('active');
            }
        });
    }

    closeDesktopDropdown();

    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (hamburgerBtn) hamburgerBtn.classList.remove('open');
    }

    if (updateHistory) {
        const path = tabIdToPath(tabId);
        if (window.location.pathname !== path) {
            window.history.pushState({ tabId }, '', path);
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', (e) => {
    const tabId = (e.state && e.state.tabId) || pathToTabId(window.location.pathname);
    switchTab(tabId, false);
});

// Scrolls to the Early Access waitlist section on the Home tab, offsetting
// for the fixed header so the section isn't hidden behind it.
function scrollToEarlyAccess() {
    const target = document.getElementById('early-access');
    if (!target) return;
    const headerOffset = 90;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
}

// ============================================================================
// 3. SOLUTIONS DROPDOWN CONTROLLERS
// ============================================================================
function toggleDesktopDropdown(e) {
    e.stopPropagation();
    const dropdown = document.querySelector('#desktop-solutions-dropdown .dropdown-menu');
    const arrow = document.getElementById('solutions-arrow');
    if (!dropdown) return;
    
    if (dropdown.classList.contains('show')) {
        closeDesktopDropdown();
    } else {
        dropdown.classList.remove('hidden');
        setTimeout(() => dropdown.classList.add('show'), 10);
        if (arrow) arrow.classList.add('rotate-180');
    }
}

function closeDesktopDropdown() {
    const dropdown = document.querySelector('#desktop-solutions-dropdown .dropdown-menu');
    const arrow = document.getElementById('solutions-arrow');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        setTimeout(() => dropdown.classList.add('hidden'), 250);
        if (arrow) arrow.classList.remove('rotate-180');
    }
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('desktop-solutions-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        closeDesktopDropdown();
    }
});

function toggleMobileSolutions() {
    const list = document.getElementById('mobile-solutions-list');
    const arrow = document.getElementById('mobile-solutions-arrow');
    if (!list) return;
    
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
        list.classList.add('flex');
        if (arrow) arrow.classList.add('rotate-180');
    } else {
        list.classList.add('hidden');
        list.classList.remove('flex');
        if (arrow) arrow.classList.remove('rotate-180');
    }
}

// ============================================================================
// 4. 2-LINE HAMBURGER TO 'X' CONTROLLER
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

    const initialTab = pathToTabId(window.location.pathname);
    if (initialTab !== 'home') {
        switchTab(initialTab, false);
    }
    window.history.replaceState({ tabId: initialTab }, '', tabIdToPath(initialTab));
});

// ============================================================================
// 5. POWEAR INTERACTIVE VENTILATION SANDBOX
// ============================================================================
let isVentilated = false;
function toggleVentilation() {
    const bubble = document.getElementById('ar-bubble');
    const readout = document.getElementById('ppm-readout');
    const btn = document.getElementById('vent-btn');
    
    if (!bubble || !readout || !btn) return;

    if (!isVentilated) {
        bubble.className = "w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_10px_28px_-8px_rgba(5,150,105,0.55)] flex items-center justify-center text-center transition-all duration-700 cursor-pointer select-none";
        bubble.innerHTML = "<span class='text-[11px] font-semibold text-white'>Safe<br/>Zone</span>";
        readout.innerText = "830 PPM — Ventilated";
        readout.className = "mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-slate-200 dark:bg-black/70 px-3.5 py-1.5 rounded-lg border border-emerald-500/40";
        btn.innerHTML = "<i class='fa-solid fa-check mr-2 text-sm'></i><span>Zone ventilated (-820 PPM)</span>";
        btn.className = "w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2.5";
        isVentilated = true;
    } else {
        bubble.className = "w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_10px_32px_-8px_rgba(225,29,72,0.55)] flex items-center justify-center text-center transition-all duration-700 animate-pulse cursor-pointer select-none";
        bubble.innerHTML = "<span class='text-xs font-semibold text-white drop-shadow'>Click to<br/>Ventilate</span>";
        readout.innerText = "1650 PPM — Hazardous";
        readout.className = "mono text-xs font-semibold text-white bg-slate-900 dark:bg-black/70 px-3.5 py-1.5 rounded-lg border border-white/10";
        btn.innerHTML = "<i class='fa-solid fa-fan animate-spin text-sm mr-2'></i><span>Activate targeted airflow fan</span>";
        btn.className = "w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2.5";
        isVentilated = false;
    }
}

// ============================================================================
// 6. POHAR RAFT CONSENSUS LEADER ELECTION SIMULATOR
// ============================================================================
function simulateRaft() {
    const nodes = document.querySelectorAll('.raft-node');
    const latencyEl = document.getElementById('latency-val');
    if (!nodes.length || !latencyEl) return;
    
    nodes.forEach(n => {
        n.className = "raft-node p-4 bg-slate-800 dark:bg-black/80 rounded-xl border border-white/10 text-center mono text-xs text-white transition-all duration-300";
        n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-slate-400 font-semibold'>Candidate</span>";
    });

    setTimeout(() => {
        const leaderIndex = Math.floor(Math.random() * 6);
        nodes.forEach((n, idx) => {
            if (idx === leaderIndex) {
                n.className = "raft-node p-4 bg-orange-600 dark:bg-orange-500/20 rounded-xl border border-orange-400 text-center mono text-xs text-white shadow-neon-orange scale-105 transition-all duration-300";
                n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-orange-200 dark:text-orange-300 font-semibold'>Cluster Leader</span>";
            } else {
                n.className = "raft-node p-4 bg-slate-800/80 dark:bg-white/[0.04] rounded-xl border border-slate-600/40 dark:border-white/10 text-center mono text-xs text-slate-200 dark:text-slate-300 transition-all duration-300";
                n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-slate-400 dark:text-slate-500 font-semibold'>Follower (Synced)</span>";
            }
        });
        const latency = (Math.random() * (33.8 - 24.1) + 24.1).toFixed(2);
        latencyEl.innerText = `${latency} µs`;
    }, 350);
}

// ============================================================================
// 7. CHART.JS EFFICACY ANALYTICS ENGINE (Theme-Adaptive)
// ============================================================================
let efficacyChartInstance = null;

function initChart() {
    const chartEl = document.getElementById('efficacyChart');
    if (!chartEl) return;
    const ctxChart = chartEl.getContext('2d');
    
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94A3B8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';

    efficacyChartInstance = new Chart(ctxChart, {
        type: 'bar',
        data: {
            labels: ['S1 Suite', 'S2 Suite', 'Office Desk', 'Home Kitchen', 'Food Diner', 'Research Lab'],
            datasets: [
                {
                    label: 'CO₂ (Before)',
                    data: [1203, 959, 1476, 1118, 1307, 1709],
                    backgroundColor: 'rgba(225, 29, 72, 0.85)',
                    borderColor: '#E11D48',
                    borderWidth: 1.5,
                    borderRadius: 8
                },
                {
                    label: 'CO₂ (After)',
                    data: [724, 676, 752, 767, 729, 778],
                    backgroundColor: 'rgba(234, 88, 12, 0.85)',
                    borderColor: '#EA580C',
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
                    backgroundColor: isDark ? '#0F1626' : '#1E293B',
                    titleFont: { family: 'Inter', size: 13, weight: 'bold' },
                    bodyFont: { family: 'Inter', size: 12 },
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    padding: 14
                }
            },
            scales: {
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Inter' } },
                    title: { display: true, text: 'CO₂ Concentration (PPM)', color: textColor, font: { weight: 'bold', size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: isDark ? '#F8FAFC' : '#0F172A', font: { family: 'Inter', weight: '600' } }
                }
            }
        }
    });
}

function updateChartTheme() {
    if (!efficacyChartInstance) return;
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94A3B8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
    
    efficacyChartInstance.options.scales.y.ticks.color = textColor;
    efficacyChartInstance.options.scales.y.title.color = textColor;
    efficacyChartInstance.options.scales.y.grid.color = gridColor;
    efficacyChartInstance.options.scales.x.ticks.color = isDark ? '#F8FAFC' : '#0F172A';
    efficacyChartInstance.options.plugins.tooltip.backgroundColor = isDark ? '#0F1626' : '#1E293B';
    efficacyChartInstance.update();
}

// ============================================================================
// 8. BIBTEX CLIPBOARD COPIER
// ============================================================================
function copyBibtex() {
    const codeEl = document.getElementById('bibtex-code');
    const btn = document.getElementById('copy-btn');
    if (!codeEl || !btn) return;
    
    navigator.clipboard.writeText(codeEl.innerText);
    btn.innerHTML = "<i class='fa-solid fa-check mr-1.5'></i>Copied!";
    btn.className = "mono text-xs text-orange-600 dark:text-orange-400 font-semibold transition-colors flex items-center";
    setTimeout(() => {
        btn.innerHTML = "<i class='fa-regular fa-copy mr-1.5'></i>Copy BibTeX";
        btn.className = "mono text-xs text-orange-700 dark:text-orange-400 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold flex items-center";
    }, 2500);
}

// ============================================================================
// 9. HD CINEMA FACADE CONTROLLER
// ============================================================================
function loadVideo(container, videoId) {
    container.innerHTML = `<iframe class="absolute top-0 left-0 w-full h-full border-0" 
        src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1&modestbranding=1&vq=hd1080" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>`;
    
    container.onclick = null;
    container.classList.remove('cursor-pointer', 'group');
}