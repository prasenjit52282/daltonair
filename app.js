import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
    // 1. STICKY SCROLL-REACTIVE HEADER ENGINE
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // 2. LOGO SCROLL-TO-TOP
    const logoToTop = document.getElementById('logoToTop');
    if (logoToTop) {
        logoToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. HERO ENTRANCE ANIMATION
    gsap.from(".reveal-text", { y: 40, opacity: 0, duration: 1, ease: "power4.out" });
    gsap.from(".reveal-subtext", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });

    // 4. THREE.JS 3D STUDIO SCENE FOR ENV-HEALTH
    const canvas = document.querySelector('#webgl-viewport');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // High-Contrast Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x00d2ff, 4.0);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // 5. ENV-HEALTH PROCEDURAL HARDWARE ASSEMBLY
    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // Materials
    const pearlSilverMat = new THREE.MeshStandardMaterial({ color: 0xe8ecef, roughness: 0.25, metalness: 0.6 });
    const gunmetalMat = new THREE.MeshStandardMaterial({ color: 0x4a525d, roughness: 0.4, metalness: 0.8 });
    const emeraldPcbMat = new THREE.MeshStandardMaterial({ color: 0x00c6ff, roughness: 0.3, metalness: 0.3 }); // Updated Cyan/Blue theme for Env-Health
    const goldChipMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.1, metalness: 0.95 });

    // Top Outer Casing
    const topGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.35, 64);
    const topCasing = new THREE.Mesh(topGeo, pearlSilverMat);
    topCasing.position.y = 0.6;
    deviceGroup.add(topCasing);

    // Middle PCB & Sensors
    const midAssembly = new THREE.Group();
    const pcbGeo = new THREE.BoxGeometry(2.3, 0.12, 1.6);
    const motherboard = new THREE.Mesh(pcbGeo, emeraldPcbMat);
    midAssembly.add(motherboard);

    const imuGeo = new THREE.BoxGeometry(0.55, 0.2, 0.55);
    const imuChip = new THREE.Mesh(imuGeo, goldChipMat);
    imuChip.position.set(0.4, 0.12, 0.2);
    midAssembly.add(imuChip);
    deviceGroup.add(midAssembly);

    // Mid Frame Ring
    const ringGeo = new THREE.TorusGeometry(1.35, 0.12, 16, 64);
    const acousticRing = new THREE.Mesh(ringGeo, gunmetalMat);
    acousticRing.rotation.x = Math.PI / 2;
    acousticRing.position.y = -0.3;
    deviceGroup.add(acousticRing);

    // Bottom Shell
    const botGeo = new THREE.ConeGeometry(1.45, 0.75, 64);
    const bottomCasing = new THREE.Mesh(botGeo, pearlSilverMat);
    bottomCasing.rotation.x = Math.PI;
    bottomCasing.position.y = -0.7;
    deviceGroup.add(bottomCasing);

    deviceGroup.rotation.x = 0.45;
    deviceGroup.rotation.z = -0.25;

    // 6. GSAP KINETIC SCROLL EXPLOSION
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hardware-section",
            start: "top top",
            end: "+=1600",
            pin: true,
            scrub: 1.2,
            onUpdate: () => renderer.render(scene, camera)
        }
    });

    tl.to(deviceGroup.rotation, { y: Math.PI * 2, ease: "none" }, 0)
      .to(topCasing.position, { y: 2.5, ease: "power1.inOut" }, 0)
      .to(bottomCasing.position, { y: -2.5, ease: "power1.inOut" }, 0)
      .to(acousticRing.position, { y: -1.2, ease: "power1.inOut" }, 0)
      .to(midAssembly.scale, { x: 1.35, y: 1.35, z: 1.35, ease: "power1.inOut" }, 0.1)
      .to("#cap1", { opacity: 1, y: -10, duration: 0.2 }, 0.35)
      .to("#cap2", { opacity: 1, y: -10, duration: 0.2 }, 0.55);

    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        if (!canvas) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.render(scene, camera);
    });
});