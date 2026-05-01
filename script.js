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
    div.innerHTML = `
        <img src="${item.url}" alt="${item.titulo}">
        <p class="titulo-tatuaje">${item.titulo}</p>
    `;
} else if (item.tipo === 'video') {
    div.innerHTML = `
        <blockquote class="tiktok-embed" data-video-id="${item.url}" style="width: 100%; margin: 0;">
            <section></section>
        </blockquote>
        <p class="titulo-tatuaje">${item.titulo}</p>
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