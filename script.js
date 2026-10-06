// ==========================================
// PROYECTOS
// ==========================================

const projects = [

    {
        title: "NativoMates",

        description:
            "NativoMates es un proyecto de desarrollo web orientado a la creación de una presencia digital para un emprendimiento comercial. El proyecto aborda el diseño y desarrollo de una interfaz web responsive, estructurada para presentar información del negocio, exhibir sus productos y facilitar el contacto directo con potenciales clientes.",

        tags: [
            "HTML",
            "CSS",
            "JavaScript",
            "GTM",
            "GA4"
        ],

        image: "img/NM1.png",

        link: "https://nativomates.github.io/NativoMates/"
    },


    {
        title: "DISTRIMAT",

        description:
            "Desarrollo de una página web para una distribuidora especializada en cintas adhesivas y soluciones de embalaje. El proyecto presenta productos, cobertura y modalidades de atención, con foco en facilitar consultas, cotizaciones y pedidos de comercios y empresas de Capital Federal.",

        tags: [
            "HTML",
            "CSS",
            "JavaScript",
            "Analytics",
            "Google Tag Manager"
        ],

        image: "img/DT1.png",

        link: "https://distrimat.github.io/distrimat/"
    },


    {
        title: "Buscador de Jugadores",

        description:
            "Aplicación web desarrollada en Python para explorar y filtrar jugadores de Primera Nacional según equipo, posición, edad y valor de mercado.",

        tags: [
            "Python",
            "Pandas",
            "Streamlit"
        ],

        image: "img/SCOUT.png",

        link: "https://scoutingjugadores.streamlit.app/"
    },


    {
        title: "Página Web - Perfumería",

        description:
            "Página web creada como boceto para una perfumería, con catálogo de productos y posibilidad de realizar consultas.",

        tags: [
            "HTML",
            "CSS",
            "JavaScript"
        ],

        image: "img/PER.jpg",

        link: "https://santicz-devs.github.io/perfumeria/"
    }

];


// ==========================================
// CONTENEDOR DE PROYECTOS
// ==========================================

const projectList = document.getElementById("project-list");


// ==========================================
// GENERAR PROYECTOS
// ==========================================

function renderProjects() {

    if (!projectList) {
        console.error("No se encontró #project-list");
        return;
    }

    projectList.innerHTML = "";

    projects.forEach(project => {

        // ==================================
        // IMAGEN
        // ==================================

        let imageHTML = "";

        if (project.image) {

            imageHTML = `
                <div class="project-image">

                    <img
                        src="${project.image}"
                        alt="${project.title}"
                    >

                </div>
            `;

        } else {

            imageHTML = `
                <div class="project-image">

                    <div class="project-image-empty">
                        IMAGEN DEL PROYECTO
                    </div>

                </div>
            `;

        }


        // ==================================
        // TAGS
        // ==================================

        let tagsHTML = "";

        project.tags.forEach(tag => {

            tagsHTML += `
                <span class="project-tag">
                    ${tag}
                </span>
            `;

        });


        // ==================================
        // LINK
        // ==================================

        let linkHTML = "";

        if (project.link) {

            linkHTML = `
                <a
                    href="${project.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >
                    Ver proyecto ↗
                </a>
            `;

        }


        // ==================================
        // TARJETA
        // ==================================

        const projectHTML = `

            <article class="project-card">

                ${imageHTML}

                <div class="project-content">

                    <div class="project-tags">
                        ${tagsHTML}
                    </div>

                    <h3>
                        ${project.title}
                    </h3>

                    <p>
                        ${project.description}
                    </p>

                    ${linkHTML}

                </div>

            </article>

        `;


        projectList.innerHTML += projectHTML;

    });

}


// ==========================================
// EJECUTAR PROYECTOS
// ==========================================

renderProjects();


// ==========================================
// TIMELINE
// ==========================================

const timeline = document.querySelector(".timeline");


if (timeline) {

    // ======================================
    // SCROLL CON RUEDA DEL MOUSE
    // ======================================

    timeline.addEventListener(
        "wheel",
        function (event) {

            /*
             * Si el usuario mueve la rueda
             * verticalmente, transformamos
             * ese movimiento en horizontal.
             */

            if (
                Math.abs(event.deltaY) >
                Math.abs(event.deltaX)
            ) {

                event.preventDefault();

                timeline.scrollLeft += event.deltaY;

            }

        },
        {
            passive: false
        }
    );


    // ======================================
    // MOVIMIENTO INICIAL
    // ======================================

    let timelineStarted = false;


    const timelineObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting &&
                        !timelineStarted
                    ) {

                        timelineStarted = true;


                        /*
                         * Pequeño desplazamiento
                         * automático para indicar
                         * que la timeline continúa.
                         */

                        setTimeout(() => {

                            timeline.scrollTo({
                                left: 120,
                                behavior: "smooth"
                            });

                        }, 500);

                    }

                });

            },
            {
                threshold: 0.4
            }
        );


    timelineObserver.observe(timeline);

}


// ==========================================
// DRAG CON MOUSE
// ==========================================

if (timeline) {

    let isDragging = false;

    let startX;

    let scrollLeft;


    timeline.addEventListener(
        "mousedown",
        (event) => {

            isDragging = true;

            timeline.style.cursor = "grabbing";

            startX = event.pageX - timeline.offsetLeft;

            scrollLeft = timeline.scrollLeft;

        }
    );


    timeline.addEventListener(
        "mouseleave",
        () => {

            isDragging = false;

            timeline.style.cursor = "default";

        }
    );


    timeline.addEventListener(
        "mouseup",
        () => {

            isDragging = false;

            timeline.style.cursor = "default";

        }
    );


    timeline.addEventListener(
        "mousemove",
        (event) => {

            if (!isDragging) {
                return;
            }

            event.preventDefault();


            const x =
                event.pageX -
                timeline.offsetLeft;


            const walk =
                (x - startX) * 1.5;


            timeline.scrollLeft =
                scrollLeft - walk;

        }
    );

}


// ==========================================
// BOTONES / NAVEGACIÓN
// ==========================================

const navLinks =
    document.querySelectorAll(".nav-links a");


navLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            /*
             * Cierra cualquier estado
             * activo que pudiera existir.
             */

            document.body.classList.remove(
                "menu-open"
            );

        }
    );

});