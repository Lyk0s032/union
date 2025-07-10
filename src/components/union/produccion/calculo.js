// Calcular funciones de medidas

export function OneElement(objeto) { // 'objeto' es el 'item' completo que le pasas
    
    // --- 1. VALIDACIÓN DE SEGURIDAD ---
    // Si el 'item' no existe, o no tiene 'materium' o 'prices', retornamos 0.
    if (!objeto || !objeto.materium || !objeto.materium.prices || objeto.materium.prices.length === 0) {
        return 0;
    }

    // --- 2. ACCESO CORRECTO A LOS DATOS ---
    const mt = objeto.materium; // 'mt' ahora es el objeto materium anidado
    const medida = mt.medida;
    const unidad = mt.unidad;
    const promedio = Number(mt.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0)) / mt.prices.length;

    // Los datos del consumo se leen directamente del 'objeto' (el item)
    const consumirCantidad = objeto.cantidad;
    const consumirMedida = objeto.medida;

    // --- 3. LÓGICA DE CÁLCULO (la misma que antes, ahora con los datos correctos) ---
    if (unidad == 'mt2') {
        const AreaMateria = Number(medida.split('X')[0]) * Number(medida.split('X')[1]);
        if (AreaMateria === 0) return 0;
        const precioMetroCuadrado = promedio / AreaMateria;
        const AreaAConsumir = Number(consumirMedida);
        const costo = AreaAConsumir * precioMetroCuadrado;
        return costo;

    } else if (unidad == 'mt') {
        if (Number(medida) === 0) return 0;
        const precioMetro = promedio / Number(medida);
        const MetrosAConsumir = Number(consumirMedida);
        const costo = precioMetro * MetrosAConsumir;
        return costo;

    } else if (unidad == 'unidad') {
        if (Number(medida) === 0) return 0;

            // 1. Calculamos el precio por cada unidad individual.
            const precioPorUnidad = promedio / Number(medida);

            // 2. Convertimos la cantidad que se va a consumir a un número.
            const cantidadDeUnidades = Number(consumirMedida);

            // 3. Verificamos que la conversión fue exitosa.
            if (isNaN(cantidadDeUnidades)) {
                console.error("Error: 'consumirCantidad' no es un número válido. Valor:", consumirCantidad);
                return 0; // Retornamos 0 para evitar errores.
            }

            // 4. Realizamos la multiplicación final.
            const costoTotal = precioPorUnidad * cantidadDeUnidades;

            // --- Logs de depuración para confirmar ---
            console.log('Precio por unidad:', precioPorUnidad);
            console.log('Cantidad de unidades:', cantidadDeUnidades);
            console.log('Costo total calculado:', costoTotal);

            return costoTotal;

    } else if (unidad == 'kg') {
        if (Number(medida) === 0) return 0;
        const precioKg = promedio / Number(medida);
        const kgAConsumir = Number(consumirMedida);
        const costo = precioKg * kgAConsumir;
        return costo;
    }
    console.log('no sé')
    return 0; // Si no es ninguna unidad, retorna 0
}

// En calculo.js
export function getPromedio(array) { // 'array' es el objeto 'item' completo
    
    // --- VALIDACIÓN DE SEGURIDAD ---
    if (!array || !array.materium || !array.materium.prices || array.materium.prices.length === 0) {
        return 0;
    }

    // --- EXTRACCIÓN DE DATOS ---
    const materia = array.materium;
    const promedio = Number(materia.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0)) / materia.prices.length;
    
    const unidad = materia.unidad;
    const medidaMateria = materia.medida; // Medida de la materia prima (ej: "1.22X2.44")
    const consumirMedida = array.medida;  // Medida del consumo (ej: "1")

    // --- LÓGICA DE CÁLCULO CORREGIDA ---
    if (unidad == 'mt2') {
        // Para la MEDIDA DE LA MATERIA PRIMA, sí separamos por 'X'
        const AreaMateria = Number(medidaMateria.split('X')[0]) * Number(medidaMateria.split('X')[1]);

        if (AreaMateria === 0) return 0;

        const precioMetroCuadrado = promedio / AreaMateria;

        // Para la MEDIDA DEL CONSUMO, usamos el valor directamente
        const AreaAConsumir = Number(consumirMedida); 
        
        const costo = AreaAConsumir * precioMetroCuadrado;
        return costo;

    } else if (unidad == 'mt') {
        if (Number(medidaMateria) === 0) return 0;
        const precioMetro = promedio / Number(medidaMateria);
        const MetrosAConsumir = Number(consumirMedida);
        const costo = precioMetro * MetrosAConsumir;
        return costo; 

    } else if (unidad == 'unidad') {
        if (Number(medidaMateria) === 0) return 0;
        const precioUnidad = promedio / Number(medidaMateria);
        const unidadesAConsumir = Number(consumirMedida);
        const costo = precioUnidad * unidadesAConsumir;
        return costo;

    } else if (unidad == 'kg') {
        if (Number(medidaMateria) === 0) return 0;
        const precioKg = promedio / Number(medidaMateria);
        const kgAConsumir = Number(consumirMedida);
        const costo = precioKg * kgAConsumir;
        return costo;
    }

    return 0;
}

