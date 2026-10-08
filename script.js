/* =========================
   PROJECT DATA
========================= */

const projects = [
    {
        title: "NativoMates",
        description:
            "Desarrollo web para un emprendimiento comercial, con información del negocio, catálogo de productos y contacto directo.",
        image: "img/NM1.png",
        link: "https://nativomates.github.io/NativoMates/",
        tags: ["HTML", "CSS", "JavaScript", "GTM", "GA4"]
    },

    {
        title: "DISTRIMAT",
        description:
            "Sitio web para un distribuidor especializado en cintas adhesivas y soluciones de packaging, orientado a consultas, presupuestos y pedidos.",
        image: "img/DT1.png",
        link: "https://distrimat.github.io/distrimat/",
        tags: ["HTML", "CSS", "JavaScript", "Analytics", "GTM"]
    },

    {
        title: "Hoteleria - Base con SQL",
        description:
            "Pagina web creada con el fin de practicar bases de datos en SQL, incluye centro de reservas y un panel de administración donde se pueden gestionar las mismas.",
        image: "img/HTL.png",
        link: "https://santicz-devs.github.io/Hoteleria/#inicio",
        tags: ["Html", "CSS", "JavaScript", "SupaBase", "SQL"]
    },

    {
        title: "Buscador de Jugadores",
        description:
            "Aplicación web desarrollada en Python para explorar y filtrar jugadores de Primera Nacional según diferentes variables.",
        image: "img/SCOUT.png",
        link: "https://scoutingjugadores.streamlit.app/",
        tags: ["Python", "Pandas", "Streamlit"]
    },

    {
        title: "Página Web — Perfumería",
        description:
            "Boceto de sitio web para una perfumería, diseñado para presentar productos y facilitar consultas.",
        image: "img/PER.jpg",
        link: "https://santicz-devs.github.io/perfumeria/",
        tags: ["HTML", "CSS", "JavaScript"]
    },

    {
        title: "Santi — Portfolio",
        description:
            "Diseño y desarrollo de mi portfolio personal para presentar proyectos, experiencia y formación.",
        image: "img/PORT.png",
        link: "https://santicz-devs.github.io/PaginaPersonal/",
        tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"]
    }
];


/* =========================
   PROJECT CAROUSEL
========================= */

const projectList = document.getElementById("project-list");
const projectDots = document.getElementById("project-dots");
const projectCounter = document.getElementById("project-counter");
const projectSlider = document.getElementById("project-slider");

let currentProject = 0;

let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let previousTranslate = 0;


/* CREATE PROJECTS */

projects.forEach((project, index) => {

    const card = document.createElement("article");

    card.className = "project-card";

    card.innerHTML = `
        <img
            src="${project.image}"
            alt="${project.title}"
            class="project-card-image"
            draggable="false"
        >

        <div class="project-card-overlay">

            <span class="project-card-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>
                ${project.title}
            </h3>

            <p class="project-card-description">
                ${project.description}
            </p>

            <div class="project-card-tags">
                ${project.tags
                    .map(tag => `<span>${tag}</span>`)
                    .join("")}
            </div>

        </div>

        <a
            href="${project.link}"
            target="_blank"
            rel="noopener noreferrer"
            class="project-card-link"
            aria-label="Ver proyecto ${project.title}"
        >
            ↗
        </a>
    `;

    projectList.appendChild(card);
});


/* CREATE DOTS */

projects.forEach((_, index) => {

    const dot = document.createElement("button");

    dot.className = "project-dot";

    dot.setAttribute(
        "aria-label",
        `Ir al proyecto ${index + 1}`
    );

    dot.addEventListener("click", () => {
        goToProject(index);
    });

    projectDots.appendChild(dot);
});


const cards = document.querySelectorAll(".project-card");
const dots = document.querySelectorAll(".project-dot");


/* GET CARD WIDTH */

function getCardWidth() {

    if (!cards.length) {
        return 0;
    }

    const cardWidth = cards[0].getBoundingClientRect().width;

    const styles = window.getComputedStyle(projectList);

    const gap = parseFloat(styles.gap) || 0;

    return cardWidth + gap;
}


/* GO TO PROJECT */

function goToProject(index) {

    if (index < 0) {
        index = 0;
    }

    if (index >= projects.length) {
        index = projects.length - 1;
    }

    currentProject = index;

    const offset = getCardWidth() * index;

    currentTranslate = -offset;
    previousTranslate = currentTranslate;

    projectList.style.transform =
        `translateX(${currentTranslate}px)`;

    updateProjectUI();
}


/* UPDATE UI */

function updateProjectUI() {

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentProject
        );

    });

    projectCounter.textContent =
        `${String(currentProject + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
}


/* =========================
   DRAG / SWIPE
========================= */

function pointerDown(event) {

    isDragging = true;

    startX =
        event.type.includes("touch")
            ? event.touches[0].clientX
            : event.clientX;

    projectSlider.classList.add("dragging");

    projectList.style.transition = "none";
}


function pointerMove(event) {

    if (!isDragging) {
        return;
    }

    const currentX =
        event.type.includes("touch")
            ? event.touches[0].clientX
            : event.clientX;

    const difference = currentX - startX;

    currentTranslate =
        previousTranslate + difference;

    projectList.style.transform =
        `translateX(${currentTranslate}px)`;
}


function pointerUp() {

    if (!isDragging) {
        return;
    }

    isDragging = false;

    projectSlider.classList.remove("dragging");

    projectList.style.transition =
        "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";

    const movedBy =
        currentTranslate - previousTranslate;

    const threshold = 80;

    if (movedBy < -threshold) {
        currentProject++;
    }

    if (movedBy > threshold) {
        currentProject--;
    }

    goToProject(currentProject);
}


/* MOUSE */

projectSlider.addEventListener(
    "mousedown",
    pointerDown
);

window.addEventListener(
    "mousemove",
    pointerMove
);

window.addEventListener(
    "mouseup",
    pointerUp
);


/* TOUCH */

projectSlider.addEventListener(
    "touchstart",
    pointerDown,
    { passive: true }
);

projectSlider.addEventListener(
    "touchmove",
    pointerMove,
    { passive: true }
);

projectSlider.addEventListener(
    "touchend",
    pointerUp
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "ArrowRight") {
        goToProject(currentProject + 1);
    }

    if (event.key === "ArrowLeft") {
        goToProject(currentProject - 1);
    }

});


/* =========================
   RESIZE
========================= */

window.addEventListener("resize", () => {
    goToProject(currentProject);
});


/* INITIAL STATE */

updateProjectUI();


/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {

    nav.classList.toggle("active");

});


/* CLOSE MENU AFTER CLICK */

nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});


/* =========================
   IMAGE DRAG PREVENTION
========================= */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("dragstart", event => {
        event.preventDefault();
    });

});