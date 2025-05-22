// Calcular funciones de medidas

export function OneElement(objeto){
    const mt = objeto;
    const medida = mt.medida;
    const unidad = mt.unidad;

    const promedio = mt.prices && mt.prices.length ? Number(mt.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0)) / mt.prices.length : null

    const consumirCantidad = mt.itemKit.cantidad;
    const consumirMedida = mt.itemKit.medida   

    if(unidad == 'mt2'){
        const AreaMateria = Number(Number(medida.split('X')[0]) * Number(medida.split('X')[1]))
        const precioMetroCuadrado = Number(promedio)/Number(AreaMateria);

        const AreaAConsumir = Number(Number(consumirMedida))
        const costo = Number(AreaAConsumir) * Number(precioMetroCuadrado);
        return costo
    }else if(unidad == 'mt'){
        // Obtenemos el area de la Materia Prima
        const MetrosMedida = medida;
        // Obtenemos el precio por Mt2 de la materia Prima
        const precioMetro = Number(promedio)/Number(MetrosMedida);
        const MetrosAConsumir = consumirMedida;
        const costo = Number(precioMetro) * Number(MetrosAConsumir);

        return costo; 
    }else if(unidad == 'unidad'){
        const medidaEnCantidad = medida;
        const precioCantidad = Number(promedio) / Number(medidaEnCantidad)
        const unidadesAConsumir = consumirMedida;
        const costo = precioCantidad *  unidadesAConsumir;

        return costo
    }else if(unidad == 'kg'){
        const medidaEnKg = medida;
        const precioKg = Number(promedio) / Number(medidaEnKg);

        const kgAConsumir = Number(consumirMedida);
        const costo = Number(precioKg) * Number(kgAConsumir);
        return costo

    }
}
export function getPromedio(array){
    const materia = array;
    const promedio = array.prices && array.prices.length ? Number(array.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0)) / array.prices.length : null
    // Obtenemos la Unidad
    const unidad = materia.unidad
    // Obtenemos medida de la MATERIA PRIMA
    const medida = materia.medida
    
    // OBTENEMOS MEDIDAS DEL CONSUMO
    const consumirCantidad = materia.itemKit.cantidad;
    const consumirMedida = materia.itemKit.medida

    if(unidad == 'mt2'){
        // Obtenemos el area de la Materia Prima
        const AreaMateria = Number(Number(medida.split('X')[0]) * Number(medida.split('X')[1]))
        // Obtenemos el precio por Mt2 de la materia Prima
        const precioMetroCuadrado = Number(promedio)/Number(AreaMateria);

        
        const AreaAConsumir = Number(Number(consumirMedida.split('X')[0]))

        const costo = Number(AreaAConsumir) * Number(precioMetroCuadrado);

        return costo; 
    }else if(unidad == 'mt'){
        // Obtenemos el area de la Materia Prima
        const MetrosMedida = medida;
        // Obtenemos el precio por Mt2 de la materia Prima
        const precioMetro = Number(promedio)/Number(MetrosMedida);

        
        const MetrosAConsumir = consumirMedida;

        const costo = Number(precioMetro) * Number(MetrosAConsumir);
        return costo; 

    }else if(unidad == 'unidad'){

        const medidaEnCantidad = medida;
        const precioCantidad = Number(promedio) / Number(medidaEnCantidad)
        const unidadesAConsumir = consumirMedida;
        const costo = precioCantidad *  unidadesAConsumir;
        return costo

    }else if(unidad == 'kg'){
        const medidaEnKg = medida;
        const precioKg = Number(promedio) / Number(medidaEnKg);

        const kgAConsumir = Number(consumirMedida);
        const costo = Number(precioKg) * Number(kgAConsumir);
        return costo

    }

} 

