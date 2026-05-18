const SELECTORS = {
    cube: '.tech-cube',
    tiltCards: '.tilt-card, .focus-item, .certificate-card, .service-card',
    revealSections: '.reveal-section'
};

const CUBE_SETTINGS = {
    initialRotateX: -18,
    initialRotateY: 0,
    dragSpeed: 0.7,
    resumeDelay: 1200,
    spinAnimation: 'cubeSpin 12s linear infinite'
};

function setupDraggableCube() {
    const cube = document.querySelector(SELECTORS.cube);
    if (!cube) return;

    const state = {
        dragging: false,
        startX: 0,
        startY: 0,
        rotateX: CUBE_SETTINGS.initialRotateX,
        rotateY: CUBE_SETTINGS.initialRotateY
    };

    const render = () => {
        cube.style.transform = `rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg)`;
    };

    const startDrag = (event) => {
        state.dragging = true;
        state.startX = event.clientX;
        state.startY = event.clientY;
        cube.classList.add('is-dragging');
        cube.setPointerCapture?.(event.pointerId);
    };

    const drag = (event) => {
        if (!state.dragging) return;

        const deltaX = event.clientX - state.startX;
        const deltaY = event.clientY - state.startY;
        state.startX = event.clientX;
        state.startY = event.clientY;
        state.rotateY += deltaX * CUBE_SETTINGS.dragSpeed;
        state.rotateX -= deltaY * CUBE_SETTINGS.dragSpeed;
        render();
    };

    const stopDrag = (event) => {
        if (!state.dragging) return;

        state.dragging = false;
        cube.classList.remove('is-dragging');
        cube.style.animation = 'none';
        render();

        window.setTimeout(() => {
            cube.style.animation = CUBE_SETTINGS.spinAnimation;
        }, CUBE_SETTINGS.resumeDelay);

        cube.releasePointerCapture?.(event.pointerId);
    };

    cube.addEventListener('pointerdown', startDrag);
    cube.addEventListener('pointermove', drag);
    cube.addEventListener('pointerup', stopDrag);
    cube.addEventListener('pointercancel', stopDrag);
}

function setupTiltCards() {
    const cards = document.querySelectorAll(SELECTORS.tiltCards);

    cards.forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = ((y / rect.height) - 0.5) * -10;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function setupScrollReveal() {
    const sections = document.querySelectorAll(SELECTORS.revealSections);
    if (!sections.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.16 });

    sections.forEach((section) => revealObserver.observe(section));
}

document.addEventListener('DOMContentLoaded', () => {
    setupDraggableCube();
    setupTiltCards();
    setupScrollReveal();
});
