import React from 'react';

interface ItemNecesidadProps {
    item: {
        id: number;
        nombre: string;
        tipo: string;
        unidad: string;
        medidaOriginal: string;
        medida?: number;
    };
    medConsumo: number;
    necesidad: number;
    entregado: number;
    falta: number;
    precioUnitario: number;
    totalPromedio: number;
    faltaPorComprar: number;
    onClick?: () => void;
    isSelected?: boolean;
    onCtrlClick?: (e: React.MouseEvent) => void;
    onShiftClick?: (e: React.MouseEvent) => void;
    index?: number;
}

export default function ItemNecesidad({
    item,
    medConsumo,
    necesidad,
    entregado,
    falta,
    precioUnitario,
    totalPromedio,
    faltaPorComprar,
    onClick,
    isSelected = false,
    onCtrlClick,
    onShiftClick,
    index
}: ItemNecesidadProps) {

    // FORMATEO PARA DATOS MATERIA PRIMA

    // Formatear la unidad para mostrar
    const unidadFormato = item.unidad === 'mt2' ? 'mt2' : 
                          item.unidad === 'ml' ? 'ml' : 
                          item.unidad === 'kg' ? 'kg' : 'unidad';

    const medidaFormateada =
        item.unidad == 'kg' ? (item.medida ? item.medida / item.medida : 1) :
        item.unidad === 'mt2' && item.medida
            ? item.medida
            : (item.medida || 1);
                        
    // Formatear Med. Consumo con unidad
    const medConsumoFormato = item.unidad == 'mt2' && item.tipo == 'producto-terminado' ? `${medConsumo.toFixed(2)}` : `${medConsumo.toFixed(2)} ${item.unidad}`;
    // Conocer la cantidad que se necesita en mt2
    const cantidadNecesaria2 =  necesidad;
    // Formatear necesidad
    // Para materia-prima con mt2/mt: convertir entregado (mt2) a piezas entregadas
    let formatoNecesidad: string | number = entregado;
    if (item.tipo == 'materia-prima' && (item.unidad == 'mt2' || item.unidad == 'mt')) {
        if (item.medida && item.medida > 0) {
            const piezasEntregadas = Number(entregado) / Number(item.medida);
            // Si ya está comprado (faltaPorComprar <= 0.09), mostrar 1 pieza
            // Convertir a número para asegurar comparación correcta
            const faltaPorComprarNum = Number(faltaPorComprar);
            if (faltaPorComprarNum <= 0.09) {
                formatoNecesidad = 1;
            } else if (entregado >= item.medida) {
                // Si entregado es mayor o igual a medida, mostrar 1 pieza completa
                formatoNecesidad = 1;
            } else if (entregado > 0) {
                // Si hay entregado pero es menor a medida, mostrar la fracción (mínimo 2 decimales)
                formatoNecesidad = Number(piezasEntregadas.toFixed(2));
            } else {
                // Si no hay entregado, mostrar 0
                formatoNecesidad = 0;
            }
        }
    }
    // Formatear Necesidad con formato (entregado) - falta / necesidad
    const necesidadFormato = `(${falta}) - ${formatoNecesidad} / ${item.unidad == 'mt2' ? cantidadNecesaria2 :necesidad}`;
 

    // FORMATEO PARA DATOS PRODUCTO TERMINADO
    const necesidadFormatoProductoTerminado = `(${falta}) -  ${formatoNecesidad} / ${necesidad}`;

    // Calcular el estado del item
    const estadoItem = faltaPorComprar <= 0.09 ? 'comprado' : entregado <= 0 ? 'sin-comprar' : 'parcialmente-comprado';
    const estadoTexto = faltaPorComprar <= 0.09 ? 'Comprado' : entregado <= 0 ? 'Sin comprar' : 'Parcialmente comprado';

    const handleClick = (e: React.MouseEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            onCtrlClick?.(e);
        } else if (e.shiftKey && onShiftClick) {
            e.preventDefault();
            e.stopPropagation();
            onShiftClick(e);
        } else {
            onClick?.();
        }
    };

    console.log('item', item)
    return (
        item.tipo == 'materia-prima' ? 
            <div 
                className={`itemNecesidad ${isSelected ? 'selected' : ''} estado-${estadoItem}`}
                onClick={handleClick}
                style={{ cursor: (onClick || onCtrlClick) ? 'pointer' : 'default' }}
            >
                <div className="numeroItem">
                    <h3>{item.id}</h3>
                </div>
                <div className="infoItem">
                    <h3 className="nombreItem">{item.nombre}</h3>
                    <div className="detallesItem">
                        <span className="medidaOriginal">{medidaFormateada} {item.unidad}</span>
                        <span className="estado">{estadoTexto}</span>
                    </div>
                </div>
                <div className="colMedConsumo">
                    <span>{medConsumoFormato}</span>
                </div>
                <div className="colNecesidad">
                    <span>{necesidadFormato} </span>
                </div>
                <div className="colPrecio">
                    <span>$ {new Intl.NumberFormat('es-CO').format(precioUnitario)}</span>
                </div>
                <div className="colTotal">
                    <span>$ {new Intl.NumberFormat('es-CO').format(totalPromedio)}</span>
                </div>
                <div className="colTotal">
                    <span>$ {new Intl.NumberFormat('es-CO').format(faltaPorComprar)}</span>
                </div>
            </div>
        :

        <div 
            className={`itemNecesidad ${isSelected ? 'selected' : ''} estado-${estadoItem}`}
            onClick={handleClick}
            style={{ cursor: (onClick || onCtrlClick) ? 'pointer' : 'default' }}
        >
            <div className="numeroItem">
                <h3>{item.id}</h3>
            </div>
            <div className="infoItem">
                <h3 className="nombreItem">{item.nombre}</h3>
                <div className="detallesItem">
                    <span className="medidaOriginal">{medidaFormateada} {item.unidad}</span>
                    <span className="estado">{estadoTexto}</span>
                    </div>
            </div>
            <div className="colMedConsumo">
                <span>{medConsumoFormato}</span>
            </div>
            <div className="colNecesidad">
                <span>{necesidadFormatoProductoTerminado}</span>
            </div>
            <div className="colPrecio">
                <span>$ {new Intl.NumberFormat('es-CO').format(precioUnitario)}</span>
            </div>
            <div className="colTotal">
                <span>$ {new Intl.NumberFormat('es-CO').format(totalPromedio)}</span>
            </div>
            <div className="colTotal">
                <span>$ {new Intl.NumberFormat('es-CO').format(faltaPorComprar)}</span>
            </div>
        </div>
    )
}
