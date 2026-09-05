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
const VALID_TABS = ['home', 'about', 'research', 'careers', 'contact'];

function tabIdToPath(tabId) {
    return tabId === 'home' ? '/' : `/${tabId}`;
}

function pathToTabId(pathname) {
    const clean = (pathname.replace(/\/+$/, '') || '/').toLowerCase();
    if (clean === '/') return 'home';
    const tabId = clean.slice(1);
    return VALID_TABS.includes(tabId) ? tabId : 'home';
}

function switchTab(tabId, updateHistory = true, scrollTop = true) {
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
    navBtns.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });

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

    if (scrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', (e) => {
    const tabId = (e.state && e.state.tabId) || pathToTabId(window.location.pathname);
    const hasChapterHash = tabId === 'research' && !!window.location.hash;
    switchTab(tabId, false, !hasChapterHash);
    if (hasChapterHash) setTimeout(scrollToChapterFromHash, 60);
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
// 3. RESEARCH TAB CHAPTER SCROLLER, HASH ROUTING & STICKY TIMELINE SCROLLSPY
// ============================================================================
// Scrolling to a chapter (on load, on a hash change, or on a jump click)
// briefly suppresses the scrollspy observer below: its callback fires async,
// on the next frame, and would otherwise race an explicit scroll and stomp
// the chapter it just set with whatever was intersecting a moment earlier.
let scrollSpySuppressedUntil = 0;
function suppressScrollSpy(ms = 700) {
    scrollSpySuppressedUntil = Date.now() + ms;
}

// Scrolls to a chapter anchor inside the Research tab. Each chapter carries
// a scroll-mt-28 class so the fixed header never covers its heading.
function scrollToResearchChapter(chapterId) {
    const target = document.getElementById(chapterId);
    if (!target) return;
    suppressScrollSpy();
    // Instant, not smooth: a smooth scroll started right after a tab switch
    // gets fought (and reset to the top) by images inside the tab still
    // loading and shifting layout underneath the animation.
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    const hash = chapterId.replace('chapter-', '');
    setActiveChapter(hash);
    updateChapterHash(chapterId, true);
}

// Highlights the sticky timeline entry (or entries) tied to the given chapter
// hash (e.g. "dalton"), used both on explicit jump clicks and on scroll. Also
// drives the mobile progress bar: segments up to and including the current
// chapter fill in, like a stepper, and the label above it updates to match.
const MOBILE_CHAPTER_ORDER = ['dalton', 'dynamics', 'cowear', 'pohar', 'today'];
const MOBILE_CHAPTER_LABELS = {
    dalton: 'Chapter 01 &middot; DALTON',
    dynamics: 'Chapter 02 &middot; Pollution Dynamics',
    cowear: 'Chapter 03 &middot; CoWear',
    pohar: 'Chapter 04 &middot; PoHAR',
    today: 'PoWear Today'
};

// The paper and patent milestones that land inside each chapter, mirrored
// from the desktop sidebar timeline, shown as small pills on mobile so the
// bar surfaces what was actually achieved, not just which chapter it is.
const MOBILE_CHAPTER_MILESTONES = {
    dalton: [
        { date: 'Sep 2024', title: 'DALTON Dataset', venue: 'NeurIPS 2024, D&amp;B Track' },
        { date: 'Jan 2025', title: 'DALTON System', venue: 'IN, Application No 202531006180' }
    ],
    dynamics: [
        { date: 'Sep 2024', title: 'Pollution Dynamics', venue: 'ACM JCSS 2024' }
    ],
    cowear: [
        { date: 'Jan 2025', title: 'CoWear Wearable', venue: 'IN, Application No 202531001296' },
        { date: 'Apr 2026', title: 'CoWear AR Study', venue: 'ACM CHI 2026' }
    ],
    pohar: [
        { date: 'May 2026', title: 'PoHAR AI', venue: 'IEEE DCOSS IoT 2026' }
    ],
    today: [
        { date: 'Aug 2026', title: 'PoWear Today', venue: 'IN, Application No 202631101632' }
    ]
};

function setActiveChapter(hash) {
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.toggle('active', item.dataset.chapter === hash);
    });

    const activeIndex = MOBILE_CHAPTER_ORDER.indexOf(hash);
    document.querySelectorAll('.mobile-timeline-item').forEach(item => {
        const itemIndex = MOBILE_CHAPTER_ORDER.indexOf(item.dataset.chapter);
        item.classList.toggle('filled', activeIndex >= 0 && itemIndex <= activeIndex);
        item.classList.toggle('current', item.dataset.chapter === hash);
    });

    const label = document.getElementById('mobile-chapter-label');
    if (label && MOBILE_CHAPTER_LABELS[hash]) {
        label.innerHTML = MOBILE_CHAPTER_LABELS[hash];
    }

    const pills = document.getElementById('mobile-milestone-pills');
    if (pills) {
        const milestones = MOBILE_CHAPTER_MILESTONES[hash] || [];
        pills.innerHTML = milestones.map(m => `
            <span class="inline-flex flex-col text-left text-[10px] font-semibold text-orange-700 dark:text-orange-300 bg-orange-500/10 px-2 py-1 rounded-lg leading-tight">
                <span><span class="mono">${m.date}</span> ${m.title}</span>
                <span class="mono text-[9px] font-normal text-orange-600/70 dark:text-orange-300/70">${m.venue}</span>
            </span>
        `).join('');
    }
}

// Writes /research#<chapter> into the URL. Explicit jumps (click) push a new
// history entry; passive scroll updates replace it so scrolling never floods
// the browser's back/forward history.
function updateChapterHash(chapterId, push) {
    const hash = chapterId.replace('chapter-', '');
    const path = `/research#${hash}`;
    if (window.location.pathname + window.location.hash === path) return;
    const state = { tabId: 'research', chapter: hash };
    if (push) {
        window.history.pushState(state, '', path);
    } else {
        window.history.replaceState(state, '', path);
    }
}

// Reads the current #hash and scrolls to the matching chapter. Used on page
// load and on back/forward navigation when the URL already carries a hash.
function scrollToChapterFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const target = document.getElementById(`chapter-${hash}`);
    if (!target) return;
    suppressScrollSpy();
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    setActiveChapter(hash);
}

// Watches the four chapter sections plus the closing synthesis panel, and
// keeps the sticky timeline (and the URL hash) in sync with whichever one is
// currently in view.
function initResearchScrollSpy() {
    const ids = ['chapter-dalton', 'chapter-dynamics', 'chapter-cowear', 'chapter-pohar', 'chapter-today'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        if (Date.now() < scrollSpySuppressedUntil) return;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveChapter(entry.target.id.replace('chapter-', ''));
                updateChapterHash(entry.target.id, false);
            }
        });
    }, { rootMargin: '-96px 0px -70% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
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
    initResearchScrollSpy();

    const initialTab = pathToTabId(window.location.pathname);
    const hasChapterHash = initialTab === 'research' && !!window.location.hash;
    if (initialTab !== 'home') {
        switchTab(initialTab, false, !hasChapterHash);
    }
    window.history.replaceState({ tabId: initialTab }, '', tabIdToPath(initialTab) + window.location.hash);

    if (hasChapterHash) setTimeout(scrollToChapterFromHash, 60);
});

// ============================================================================
// 5. POHAR RAFT CONSENSUS LEADER ELECTION SIMULATOR
// ============================================================================
let raftRound = 1;

function simulateRaft() {
    const nodes = document.querySelectorAll('.raft-node');
    const roundEl = document.getElementById('round-val');
    if (!nodes.length || !roundEl) return;

    nodes.forEach(n => {
        n.className = "raft-node p-4 bg-slate-100 dark:bg-white/[0.04] rounded-xl border border-slate-200 dark:border-white/10 text-center mono text-xs text-slate-700 dark:text-slate-300 transition-all duration-300";
        n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-slate-500 dark:text-slate-400 font-semibold'>Candidate</span>";
    });

    setTimeout(() => {
        const leaderIndex = Math.floor(Math.random() * 6);
        nodes.forEach((n, idx) => {
            if (idx === leaderIndex) {
                n.className = "raft-node p-4 bg-orange-600 dark:bg-orange-500 rounded-xl border border-orange-400 dark:border-orange-300 text-center mono text-xs text-white shadow-neon-orange scale-105 transition-all duration-300";
                n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-orange-50 font-semibold'>Cluster Leader</span>";
            } else {
                n.className = "raft-node p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 text-center mono text-xs text-slate-600 dark:text-slate-300 transition-all duration-300";
                n.innerHTML = n.id.replace('node-', 'ESP32-0') + "<br/><span class='text-[10px] text-slate-400 dark:text-slate-500 font-semibold'>Follower (Synced)</span>";
            }
        });
        raftRound += 1;
        roundEl.innerText = raftRound;
    }, 350);
}

// ============================================================================
// 6. CHART.JS EFFICACY ANALYTICS ENGINE (Theme-Adaptive)
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
// 7. BIBTEX CLIPBOARD COPIER
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
// 8. INLINE VIDEO PLAYER (Research Tab)
// ============================================================================
function loadVideo(container, videoId) {
    container.innerHTML = `<iframe class="absolute top-0 left-0 w-full h-full border-0" 
        src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1&modestbranding=1&vq=hd1080" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>`;
    
    container.onclick = null;
    container.classList.remove('cursor-pointer', 'group');
}