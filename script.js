// Función para cargar cualquier sección en la pantalla principal
async function cargarSeccion(archivoJson, elementoBoton) {
    const contenedor = document.getElementById('galeria-dinamica');
    
    // 1. Efecto visual: Cambiar el botón activo
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if(elementoBoton) elementoBoton.classList.add('active');

    // 2. Limpiar la galería antes de cargar lo nuevo
    contenedor.innerHTML = '<p style=\"text-align:center; width:100%;\">Cargando arte...</p>';

    try {
        const respuesta = await fetch(archivoJson);
        const datos = await respuesta.json();
        
        contenedor.innerHTML = ''; // Borramos el mensaje de cargando

        // En tus JSON los datos vienen dentro de un array (ej. "trabajos" o similar)
        // Buscamos dinámicamente el array interno sin importar cómo se llame
        const items = Array.isArray(datos) ? datos : Object.values(datos)[0];

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            
            // Al hacer click sobre la tarjeta de la galería se abre el modal grande
            div.onclick = () => abrirModal(item); 

            // Construcción visual de las miniaturas en la cuadrícula principal
            if (item.tipo === 'imagen') {
                div.innerHTML = `
                    <img src="${item.url}" alt="${item.titulo || 'Arte'}">
                    <p class="titulo-tatuaje">${item.titulo || ''}</p>
                `;
            } else if (item.tipo === 'video') {
                // Si la miniatura es un video .mp4 local, ponemos una vista previa corta
                if (item.url.includes('.mp4') || item.url.includes('resources/')) {
                    div.innerHTML = `
                        <video src="${item.url}" muted loop playsinline style="width:100%; height:100%; object-fit:cover; display:block;"></video>
                        <p class="titulo-tatuaje">${item.titulo || ''}</p>
                    `;
                    // Pequeño truco para que el video de miniatura intente reproducirse en silencio al pasar el mouse
                    div.onmouseenter = () => div.querySelector('video').play().catch(()=>{});
                    div.onmouseleave = () => div.querySelector('video').pause();
                } else {
                    // Si es de TikTok, mantenemos la estructura blockquote para la miniatura
                    div.innerHTML = `
                        <blockquote class="tiktok-embed" data-video-id="${item.url}" style="width: 100%; margin: 0;">
                            <section></section>
                        </blockquote>
                        <p class="titulo-tatuaje">${item.titulo || ''}</p>
                    `;
                }
            }
            contenedor.appendChild(div);
        });

        // Decirle a TikTok que procese los nuevos bloques inyectados en la cuadrícula
        const scriptTiktok = document.createElement('script');
        scriptTiktok.src = "https://www.tiktok.com/embed.js";
        document.body.appendChild(scriptTiktok);

    } catch (error) {
        console.error("Error cargando el JSON:", error);
        contenedor.innerHTML = '<p style="text-align:center; width:100%;">Próximamente...</p>';
    }
}

// Cargar la primera sección por defecto al entrar a la página
document.addEventListener("DOMContentLoaded", () => {
    cargarSeccion('work.json', document.querySelector('.tab-button'));
});


// --- LÓGICA DEL MODAL TIPO TARJETA (DETALLES) ---
function abrirModal(item) {
    const modal = document.getElementById('modal-galeria');
    const modalBody = document.getElementById('modal-body');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const botonCerrar = document.querySelector('.modal .close');

    // 1. Mostrar el contenedor del modal
    modal.style.display = "block";
    
    // 2. Colocar el título
    modalTitulo.innerText = item.titulo || "ナチェル | Nacherino";
    
    // 3. Colocar la descripción scrolleable si existe
    if (item.descripcion) {
        modalDescripcion.innerText = item.descripcion;
        modalDescripcion.style.display = "block";
    } else {
        modalDescripcion.innerText = "";
        modalDescripcion.style.display = "none";
    }

    // 4. Asignar evento de cierre al botón X
    if (botonCerrar) botonCerrar.onclick = cerrarModal;

    // 5. Renderizar el contenido multimedia correcto dentro del modal
    if (item.tipo === 'imagen') {
        modalBody.innerHTML = `<img src="${item.url}" alt="${item.titulo || 'ナチェル | Nacherino'}" style="width:100%; max-height:75vh; object-fit:contain; display:block;">`;
    } else if (item.tipo === 'video') {
        // DETECCIÓN INTELIGENTE: ¿Es un archivo local .mp4?
        if (item.url.includes('.mp4') || item.url.includes('resources/')) {
            modalBody.innerHTML = `
                <video src="${item.url}" controls autoplay loop muted playsinline style="width:100%; max-height:75vh; display:block; object-fit:contain;">
                    Tu navegador no soporta la reproducción de este video.
                </video>
            `;
        } else {
            // Si no contiene .mp4, asumimos que es el ID numérico de TikTok
            modalBody.innerHTML = `
                <blockquote class="tiktok-embed" data-video-id="${item.url}" style="width: 100%; margin: 0;">
                    <section></section>
                </blockquote>
            `;
            // Forzar renderizado del widget de TikTok en tiempo real
            const s = document.createElement('script');
            s.src = "https://www.tiktok.com/embed.js";
            document.body.appendChild(s);
        }
    }
}

function cerrarModal() {
    document.getElementById('modal-galeria').style.display = "none";
    document.getElementById('modal-body').innerHTML = ""; // Limpia por completo para callar el audio del .mp4 o TikTok
    document.getElementById('modal-titulo').innerText = "";
    document.getElementById('modal-descripcion').innerText = "";
    
    // Reiniciar la posición del scroll del texto para que inicie arriba la próxima vez
    const wrapper = document.getElementById('modal-descripcion-wrapper');
    if (wrapper) wrapper.scrollTop = 0;
}


// --- BOTÓN FLOTANTE (FAB) DE REDES SOCIALES ---
function toggleFab() {
    const container = document.querySelector('.fab-container');
    const icon = document.getElementById('fab-icon');
    
    container.classList.toggle('active');
    
    if (container.classList.contains('active')) {
        icon.innerText = '🎰'; 
    } else {
        icon.innerText = '🎰';
    }
}

// --- MENÚ HAMBURGUESA (MÓVIL) ---
function toggleMenu() {
    const tabsMenu = document.getElementById('tabsMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    tabsMenu.classList.toggle('mobile-open');
    menuToggle.classList.toggle('active');
}

function seleccionarTab(archivoJson, elementoBoton) {
    cargarSeccion(archivoJson, elementoBoton);
    
    const tabsMenu = document.getElementById('tabsMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (tabsMenu.classList.contains('mobile-open')) {
        tabsMenu.classList.remove('mobile-open');
        menuToggle.classList.remove('active');
    }
}