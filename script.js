// Función para cargar los datos del JSON
async function cargarGaleria() {
    try {
        const respuesta = await fetch('galeria.json');
        const datos = await respuesta.json();
        const contenedor = document.getElementById('galeria-dinamica');

        datos.trabajos.forEach(item => {
            const div = document.createElement('div');
            div.className = 'grid-item';

            if (item.tipo === 'imagen') {
                // Renderiza imagen local optimizada
                div.innerHTML = `
                    <img src="${item.url}" alt="${item.titulo}" loading="lazy">
                    <p class="titulo-tatuaje">${item.titulo}</p>
                `;
            } else if (item.tipo === 'video') {
                // Renderiza video de TikTok (usando su sistema de embed)
                div.innerHTML = `
                    <blockquote class="tiktok-embed" data-video-id="${item.url}" style="max-width: 605px;min-width: 325px;">
                        <section></section>
                    </blockquote>
                `;
            }
            contenedor.appendChild(div);
        });

        // Carga el script de TikTok para que los videos se vean bien
        const scriptTikTok = document.createElement('script');
        scriptTikTok.src = "https://www.tiktok.com/embed.js";
        document.body.appendChild(scriptTikTok);

    } catch (error) {
        console.error('Error al cargar la galería:', error);
    }
}

// Iniciar la carga
cargarGaleria();