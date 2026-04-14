// liquid-patches.js
// Performance-optimized floating background system

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dynamic Background Injection (non-homepage sections only) ---
    const targetSections = document.querySelectorAll('section:not(#home)');
    
    targetSections.forEach((sec, index) => {
        if (getComputedStyle(sec).position === 'static') {
            sec.style.position = 'relative';
        }

        const containerElem = sec.querySelector('.container') || sec.firstElementChild;
        if (containerElem && containerElem.style) {
            containerElem.style.position = 'relative';
            containerElem.style.zIndex = '10';
        }

        // Create background system — ONLY pattern + particles + streaks (static, no animation)
        const bgSystem = document.createElement('div');
        bgSystem.className = 'premium-float-system';
        bgSystem.innerHTML = `
            <div class="edu-pattern"></div>
            <div class="micro-particles"></div>
            <div class="light-streaks"></div>
        `;

        // Add patches only to Gallery, Contact, Updates (sections without manual patches)
        const secId = sec.id || '';
        if (secId === 'gallery' || secId === 'contact' || secId === 'updates') {
            if (!sec.querySelector('.premium-patch')) {
                const colors = ['c-blue', 'c-cyan', 'c-emerald', 'c-purple'];
                const p1 = document.createElement('div');
                const p2 = document.createElement('div');
                p1.className = `premium-patch ${colors[index % 4]} premium-patch-extra-1`;
                p2.className = `premium-patch ${colors[(index + 1) % 4]} premium-patch-extra-2`;
                bgSystem.appendChild(p1);
                bgSystem.appendChild(p2);
            }
        }

        sec.insertBefore(bgSystem, sec.firstChild);
    });

    // --- 2. Color assignment for pre-placed patches ---
    const colorMap = {
        'premium-patch-about-tl': 'c-emerald',
        'premium-patch-about-b': 'c-purple',
        'premium-patch-courses-tl': 'c-emerald',
        'premium-patch-courses-br': 'c-blue',
        'premium-patch-faculty-tl': 'c-cyan',
        'premium-patch-faculty-br': 'c-purple',
        'premium-patch-reviews-l': 'c-blue',
        'premium-patch-reviews-r': 'c-emerald',
        'premium-patch-home-tl': 'c-cyan',
        'premium-patch-home-br': 'c-purple',
    };

    for (const [cls, color] of Object.entries(colorMap)) {
        const el = document.querySelector('.' + cls);
        if (el) el.classList.add(color);
    }

    // --- 3. Cursor Blob (Desktop Only, optimized) ---
    const cursorBlob = document.getElementById('cursor-blob');
    let isDesktop = window.innerWidth > 768;
    let blobVisible = false;
    let animating = false;

    // Only run rAF loop while the mouse is actively inside the page
    function updateBlob() {
        if (!animating || !isDesktop || !cursorBlob) return;
        // The transform is already set in mousemove — nothing extra to do per frame
        // We just keep looping to stay ready
        requestAnimationFrame(updateBlob);
    }

    if (cursorBlob && isDesktop) {
        document.addEventListener('mousemove', (e) => {
            if (!isDesktop) return;
            cursorBlob.style.setProperty('--cx', e.clientX + 'px');
            cursorBlob.style.setProperty('--cy', e.clientY + 'px');
            
            if (!blobVisible) {
                cursorBlob.style.opacity = '1';
                blobVisible = true;
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            cursorBlob.style.opacity = '0';
            blobVisible = false;
            animating = false;
        });

        document.addEventListener('mouseenter', () => {
            if (isDesktop) {
                cursorBlob.style.opacity = '1';
                blobVisible = true;
            }
        });
    }

    // --- 4. Resize handler ---
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth > 768;
        if (!isDesktop && cursorBlob) {
            cursorBlob.style.opacity = '0';
            blobVisible = false;
        }
    }, { passive: true });

    // NOTE: Parallax mousemove on patches has been REMOVED.
    // It was updating CSS custom properties on 10+ elements every mouse frame,
    // causing heavy style recalculations and GPU repaints.
    // The cloud-drift CSS animation alone provides all the motion needed.
});
