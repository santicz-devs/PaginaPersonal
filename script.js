/* =========================================================
   SANTI — PORTFOLIO INTERACTIONS
   Liquid glass · navegación · carrusel · tema · scroll
========================================================= */

const projects = [
    {
        title: "NativoMates",
        description: "Desarrollo web para un emprendimiento comercial, con información del negocio, catálogo de productos y contacto directo.",
        image: "img/NM1.png",
        link: "https://nativomates.github.io/NativoMates/",
        tags: ["HTML", "CSS", "JavaScript", "GTM", "GA4"]
    },
    {
        title: "DISTRIMAT",
        description: "Sitio web para un distribuidor especializado en cintas adhesivas y soluciones de packaging, orientado a consultas, presupuestos y pedidos.",
        image: "img/DT1.png",
        link: "https://distrimat.github.io/distrimat/",
        tags: ["HTML", "CSS", "JavaScript", "Analytics", "GTM"]
    },
    {
        title: "Hotelería — Sistema de reservas",
        description: "Aplicación web para consultar disponibilidad, gestionar reservas y administrar habitaciones con una base de datos.",
        image: "img/HTL.png",
        link: "https://santicz-devs.github.io/Hoteleria/#inicio",
        tags: ["HTML", "CSS", "JavaScript", "Supabase", "SQL"]
    },
    {
        title: "Buscador de Jugadores",
        description: "Aplicación desarrollada en Python para explorar y filtrar jugadores de Primera Nacional a partir de un dataset.",
        image: "img/SCOUT.png",
        link: "https://scoutingjugadores.streamlit.app/",
        tags: ["Python", "Pandas", "Streamlit"]
    },
    {
        title: "Página Web — Perfumería",
        description: "Diseño y desarrollo de un sitio web para presentar productos y facilitar el contacto con el negocio.",
        image: "img/PER.jpg",
        link: "https://santicz-devs.github.io/perfumeria/",
        tags: ["HTML", "CSS", "JavaScript"]
    },
    {
        title: "Santi — Portfolio personal",
        description: "Diseño y desarrollo de mi portfolio para presentar proyectos, experiencia, formación y habilidades.",
        image: "img/Santi.jpg",
        link: "https://santicz-devs.github.io/PaginaPersonal/",
        tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"]
    }
];

/* Helpers */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOBILE_BREAKPOINT = 880;

const root = document.documentElement;


/* =========================================================
   LIQUID GLASS — refracción real en la barra (Chromium)
   Se genera un mapa de desplazamiento con la forma exacta de
   la barra: el fondo se curva en los bordes y se separa en
   canales RGB. En Safari/Firefox queda el cristal esmerilado.
========================================================= */

const headerInner = $("#header-inner");
const lgFilter = $("#lg-nav");
const lgMap = $("#lg-map");

const supportsRefraction = !!navigator.userAgentData?.brands?.some(
    brand => /Chromium/i.test(brand.brand)
);

function buildDisplacementMap(width, height, radius, bezel) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    const image = ctx.createImageData(width, height);
    const data = image.data;

    const cx = width / 2;
    const cy = height / 2;
    const halfX = width / 2 - radius;
    const halfY = height / 2 - radius;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const px = x + 0.5 - cx;
            const py = y + 0.5 - cy;

            // Distancia con signo a un rectángulo redondeado
            const qx = Math.abs(px) - halfX;
            const qy = Math.abs(py) - halfY;
            const ox = Math.max(qx, 0);
            const oy = Math.max(qy, 0);
            const signedDistance = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - radius;
            const edge = -signedDistance;

            let r = 128;
            let g = 128;

            if (edge >= 0 && edge < bezel) {
                const t = 1 - edge / bezel;
                const strength = t * t;

                // Normal hacia afuera de la forma
                let nx = 0;
                let ny = 0;
                if (ox > 0 || oy > 0) {
                    const length = Math.hypot(ox, oy) || 1;
                    nx = Math.sign(px) * ox / length;
                    ny = Math.sign(py) * oy / length;
                } else if (qx > qy) {
                    nx = Math.sign(px);
                } else {
                    ny = Math.sign(py);
                }

                // Se muestrea hacia adentro: el borde estira el interior como una lente convexa
                r = 128 - nx * strength * 127;
                g = 128 - ny * strength * 127;
            }

            const i = (y * width + x) * 4;
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = 128;
            data[i + 3] = 255;
        }
    }

    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL();
}

let lastGlassSize = "";

function updateGlass() {
    if (!headerInner || !lgFilter || !lgMap) return;

    const width = Math.round(headerInner.offsetWidth);
    const height = Math.round(headerInner.offsetHeight);
    const key = `${width}x${height}`;
    if (!width || !height || key === lastGlassSize) return;
    lastGlassSize = key;

    const radius = height / 2;
    const bezel = Math.min(26, height * 0.42);
    const url = buildDisplacementMap(width, height, radius, bezel);

    lgFilter.setAttribute("width", width);
    lgFilter.setAttribute("height", height);
    lgMap.setAttribute("width", width);
    lgMap.setAttribute("height", height);
    lgMap.setAttribute("href", url);
    lgMap.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);

    const scale = height < 60 ? 30 : 38;
    $("#lg-dr")?.setAttribute("scale", scale);
    $("#lg-dg")?.setAttribute("scale", scale * 0.9);
    $("#lg-db")?.setAttribute("scale", scale * 0.8);

    root.classList.add("lg-refract");
}

if (supportsRefraction && headerInner) {
    updateGlass();
    new ResizeObserver(updateGlass).observe(headerInner);
}

/* Brillo especular que sigue al cursor sobre el cristal */
if (headerInner && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    headerInner.addEventListener("pointermove", event => {
        const rect = headerInner.getBoundingClientRect();
        headerInner.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        headerInner.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }, { passive: true });

    headerInner.addEventListener("pointerleave", () => {
        headerInner.style.setProperty("--mx", "50%");
        headerInner.style.setProperty("--my", "0%");
    });
}


/* =========================================================
   NAV — píldora de cristal + sección activa
========================================================= */

const nav = $("#nav");
const navLinks = $$("a", nav);
const indicator = document.createElement("span");
indicator.className = "nav-indicator";
indicator.setAttribute("aria-hidden", "true");
nav?.prepend(indicator);

let activeLink = null;

function placeIndicator(link, instant = false) {
    if (!link || window.innerWidth <= MOBILE_BREAKPOINT) {
        indicator.classList.remove("is-visible");
        return;
    }

    if (instant) indicator.style.transition = "none";
    indicator.style.left = `${link.offsetLeft}px`;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.classList.add("is-visible");

    if (instant) {
        void indicator.offsetWidth;
        indicator.style.transition = "";
    }
}

function setActiveLink(link) {
    if (link === activeLink) return;
    activeLink = link;

    navLinks.forEach(item => {
        const isActive = item === link;
        item.classList.toggle("is-active", isActive);
        if (isActive) item.setAttribute("aria-current", "location");
        else item.removeAttribute("aria-current");
    });

    placeIndicator(link, !indicator.classList.contains("is-visible"));
}

navLinks.forEach(link => {
    link.addEventListener("pointerenter", () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) return;
        placeIndicator(link, !indicator.classList.contains("is-visible"));
    });
});

nav?.addEventListener("pointerleave", () => placeIndicator(activeLink));

/* Scroll-spy */
const spyTargets = [
    { id: "home", link: null },
    ...navLinks.map(link => ({ id: link.getAttribute("href").slice(1), link }))
];

if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const target = spyTargets.find(item => item.id === entry.target.id);
            if (target) setActiveLink(target.link);
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    spyTargets.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) spy.observe(section);
    });
}

window.addEventListener("resize", () => placeIndicator(activeLink, true));
document.fonts?.ready.then(() => placeIndicator(activeLink, true));


/* =========================================================
   MENÚ MÓVIL
========================================================= */

const menuToggle = $("#menu-toggle");

function setMenu(open) {
    nav?.classList.toggle("active", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

menuToggle?.addEventListener("click", () => setMenu(!nav.classList.contains("active")));
navLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));

document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenu(false);
});

document.addEventListener("click", event => {
    if (!nav?.classList.contains("active")) return;
    if (event.target.closest("#nav, #menu-toggle")) return;
    setMenu(false);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) setMenu(false);
});


/* =========================================================
   TEMA CLARO / OSCURO
========================================================= */

const themeToggle = $("#theme-toggle");
const themeColorMeta = $('meta[name="theme-color"]');

function applyTheme(theme) {
    const valid = theme === "dark" ? "dark" : "light";
    root.dataset.theme = valid;

    const label = valid === "dark" ? "Activar modo claro" : "Activar modo oscuro";
    themeToggle?.setAttribute("aria-label", label);
    themeToggle?.setAttribute("title", label);
    themeColorMeta?.setAttribute("content", valid === "dark" ? "#0e0f11" : "#efeee9");
}

applyTheme(root.dataset.theme);

themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("santi-portfolio-theme", next); } catch {}

    const change = () => applyTheme(next);

    if (document.startViewTransition && !prefersReducedMotion) {
        const rect = themeToggle.getBoundingClientRect();
        root.style.setProperty("--tx", `${rect.left + rect.width / 2}px`);
        root.style.setProperty("--ty", `${rect.top + rect.height / 2}px`);
        document.startViewTransition(change);
    } else {
        change();
    }
});


/* =========================================================
   CARRUSEL DE PROYECTOS
========================================================= */

const projectList = $("#project-list");
const projectDots = $("#project-dots");
const projectCounter = $("#project-counter");
const projectSlider = $("#project-slider");
const prevButton = $("#project-prev");
const nextButton = $("#project-next");

if (projectList && projectDots && projectCounter && projectSlider) {
    let currentProject = 0;
    let isDragging = false;
    let startX = 0;
    let startTime = 0;
    let currentTranslate = 0;
    let previousTranslate = 0;
    let sliderInView = false;

    const arrowIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`;

    projects.forEach((project, index) => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-card-image" draggable="false" loading="${index > 1 ? "lazy" : "eager"}">
            <div class="project-card-overlay">
                <span class="project-card-number">${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}</span>
                <h3>${project.title}</h3>
                <p class="project-card-description">${project.description}</p>
                <div class="project-card-tags">${project.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
            </div>
            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-card-link" aria-label="Ver proyecto ${project.title}">${arrowIcon}</a>
        `;
        projectList.appendChild(card);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "project-dot";
        dot.setAttribute("aria-label", `Ir al proyecto ${index + 1}: ${project.title}`);
        dot.addEventListener("click", () => goToProject(index));
        projectDots.appendChild(dot);
    });

    const cards = $$(".project-card", projectList);
    const dots = $$(".project-dot", projectDots);

    function getCardStep() {
        if (!cards.length) return 0;
        const cardWidth = cards[0].offsetWidth; // offsetWidth ignora el scale de las tarjetas inactivas
        const gap = parseFloat(getComputedStyle(projectList).columnGap) || 0;
        return cardWidth + gap;
    }

    function updateProjectUI() {
        cards.forEach((card, index) => card.classList.toggle("is-active", index === currentProject));
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentProject);
            dot.setAttribute("aria-current", index === currentProject ? "true" : "false");
        });
        projectCounter.textContent =
            `${String(currentProject + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
        if (prevButton) prevButton.disabled = currentProject === 0;
        if (nextButton) nextButton.disabled = currentProject === projects.length - 1;
    }

    function goToProject(index, instant = false) {
        currentProject = clamp(index, 0, projects.length - 1);
        currentTranslate = -(getCardStep() * currentProject);
        previousTranslate = currentTranslate;
        projectList.style.transition = instant ? "none" : "transform .8s cubic-bezier(.16, 1, .3, 1)";
        projectList.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
        updateProjectUI();
    }

    /* Arrastre con Pointer Events: el scroll vertical sigue funcionando (touch-action: pan-y) */
    projectSlider.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (event.target.closest("a, button")) return;
        isDragging = true;
        startX = event.clientX;
        startTime = performance.now();
        projectSlider.classList.add("dragging");
        projectSlider.setPointerCapture(event.pointerId);
        projectList.style.transition = "none";
    });

    projectSlider.addEventListener("pointermove", event => {
        if (!isDragging) return;
        let delta = event.clientX - startX;

        // Resistencia elástica en los extremos
        const atStart = currentProject === 0 && delta > 0;
        const atEnd = currentProject === projects.length - 1 && delta < 0;
        if (atStart || atEnd) delta *= 0.35;

        currentTranslate = previousTranslate + delta;
        projectList.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    });

    function endDrag(event) {
        if (!isDragging) return;
        isDragging = false;
        projectSlider.classList.remove("dragging");
        if (event?.pointerId !== undefined && projectSlider.hasPointerCapture(event.pointerId)) {
            projectSlider.releasePointerCapture(event.pointerId);
        }

        const movedBy = currentTranslate - previousTranslate;
        const elapsed = Math.max(performance.now() - startTime, 1);
        const velocity = Math.abs(movedBy) / elapsed;

        let target = currentProject;
        if (movedBy < -60 || (movedBy < -20 && velocity > 0.5)) target++;
        if (movedBy > 60 || (movedBy > 20 && velocity > 0.5)) target--;
        goToProject(target);
    }

    projectSlider.addEventListener("pointerup", endDrag);
    projectSlider.addEventListener("pointercancel", endDrag);

    prevButton?.addEventListener("click", () => goToProject(currentProject - 1));
    nextButton?.addEventListener("click", () => goToProject(currentProject + 1));

    /* Las flechas del teclado solo actúan cuando el carrusel está en pantalla */
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(([entry]) => {
            sliderInView = entry.isIntersecting;
        }, { threshold: 0.4 }).observe(projectSlider);
    }

    document.addEventListener("keydown", event => {
        if (!sliderInView) return;
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (event.key === "ArrowRight") goToProject(currentProject + 1);
        if (event.key === "ArrowLeft") goToProject(currentProject - 1);
    });

    window.addEventListener("resize", () => goToProject(currentProject, true));
    goToProject(0, true);
}


/* =========================================================
   ACCIONES FLOTANTES + PROGRESO DE LECTURA
========================================================= */

const progress = document.createElement("div");
progress.className = "scroll-progress";
progress.setAttribute("aria-hidden", "true");
progress.innerHTML = "<span></span>";
document.body.appendChild(progress);

const floatingActions = document.createElement("div");
floatingActions.className = "floating-actions";
floatingActions.innerHTML = `
    <a class="floating-action" href="#contacto" aria-label="Ir a contacto" title="Hablemos">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>
        </svg>
    </a>
    <button class="floating-action floating-action-top" type="button" aria-label="Volver arriba" title="Volver arriba">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m6 14 6-6 6 6"/><path d="M12 8v12"/>
        </svg>
    </button>
`;
document.body.appendChild(floatingActions);

const backToTop = $(".floating-action-top", floatingActions);
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const progressBar = $("span", progress);
const headerEl = $(".header");
let scrollTicking = false;

function updateScrollUI() {
    scrollTicking = false;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progressBar) progressBar.style.width = `${percentage}%`;

    backToTop?.classList.toggle("is-visible", window.scrollY > 500);
    headerEl?.classList.toggle("is-scrolled", window.scrollY > 30);

    // Al llegar al final, "Contacto" queda activo aunque la sección sea corta
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    if (atBottom && scrollable > 0) {
        setActiveLink(navLinks.find(link => link.getAttribute("href") === "#contacto") || null);
    }
}

function requestScrollUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollUI);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollUI();


/* =========================================================
   REVELADO AL HACER SCROLL
========================================================= */

const revealTargets = $$(".section-heading, .area-card, .project-controls, .experience-item, .about-grid, .contact-inner");
revealTargets.forEach(element => element.classList.add("js-reveal"));

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealTargets.forEach(element => revealObserver.observe(element));
} else {
    revealTargets.forEach(element => element.classList.add("is-visible"));
}

/* Evita que el navegador arrastre las imágenes como archivos */
$$("img").forEach(image => {
    image.addEventListener("dragstart", event => event.preventDefault());
});