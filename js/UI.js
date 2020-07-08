class UI {
    constructor() {

        // Instanciar la API
        this.api = new API();

        // Crear los markers con LayerGroup
        this.markers = new L.LayerGroup();

        // Iniciar el mapa
        this.mapa = this.inicializarMapa();

    }

    inicializarMapa() {
        // Inicializar y obtener la propiedad del mapa
        // Aca poner las coordenadas de Argentina
        const map = L.map('mapa').setView([19.390519, -99.3739778], 6);
        const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + enlaceMapa + ' Contributors',
                maxZoom: 18,
            }).addTo(map);
        return map;

    }

    mostrarEstablecimientos() {
        this.api.obtenerDatos()
            .then(datos => {
                const resultado = datos.respuestaJSON.results;
                // Ejecutar la funcion para mostrar los pines
                this.mostrarPines(resultado);

            })
    }

    mostrarPines(datos) {
        //Limpiar los markers
        //ClearLayers es una funcion de Leaflet
        this.markers.clearLayers();

        // Recorrer los establecimientos
        datos.forEach(dato => {
            //Destructuring
            const { latitude, longitude, calle, regular, premium } = dato;

            //Crear Popup (Para poder presionar los pines)
            const opcionesPopup = L.popup()
                .setContent(`<p>Calle: ${calle}</p>
                        <p><b>Regular:</b> $${regular}</p>
                        <p><b>Premium:</b> $${premium}</p>
            `);

            //Agregar el PIN
            const marker = new L.marker([
                parseFloat(latitude),
                parseFloat(longitude)
            ]).bindPopup(opcionesPopup);

            this.markers.addLayer(marker);
        });
        this.markers.addTo(this.mapa);
    }

    //Buscador
    obtenerSugerencias(busqueda) {
            this.api.obtenerDatos()
                .then(datos => {
                    //Obtener los datos
                    const resultados = datos.respuestaJSON.results;

                    //Enviar el JSON y la busqueda para el filtrado
                    this.filtrarSugerencias(resultados, busqueda);
                })
        }
        // Filta las sugerencias en base al input
    filtrarSugerencias(resultado, busqueda) {
        //Filtrar con .filter
        const filtro = resultado.filter(filtro => filtro.calle.indexOf(busqueda) !== -1);
        console.log(filtro);
        //Mostrar los pines
        this.mostrarPines(filtro);
    }
}