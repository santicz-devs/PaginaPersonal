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
            "Analyitcs",
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

        // --------------------------------------
        // IMAGEN
        // --------------------------------------

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


        // --------------------------------------
        // TAGS
        // --------------------------------------

        let tagsHTML = "";

        project.tags.forEach(tag => {

            tagsHTML += `
                <span class="project-tag">
                    ${tag}
                </span>
            `;

        });


        // --------------------------------------
        // LINK
        // --------------------------------------

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


        // --------------------------------------
        // TARJETA
        // --------------------------------------

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


        // Agregar proyecto
        projectList.innerHTML += projectHTML;

    });

}


// ==========================================
// EJECUTAR
// ==========================================

renderProjects();