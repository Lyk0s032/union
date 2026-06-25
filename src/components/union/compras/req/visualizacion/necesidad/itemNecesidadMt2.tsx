import React from 'react';

interface ItemNecesidadProps {
    item: {
        id: number;
        nombre: string;
        tipo: string;
        unidad: string;
        medidaOriginal: string;
        medida?: number;
        totalCantidad?: number;
        entregado?: number;
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

export default function ItemNecesidadMPMT2({
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
    // Conocer la cantidad que se necesita en piezas (láminas)
    const cantidadNecesaria2 = necesidad;
 
    // entregado llega en piezas (cantidadEntrega consolidada)
    let formatoNecesidad: string | number = entregado;
    if (item.tipo == 'materia-prima' && (item.unidad == 'mt2' || item.unidad == 'mt')) {
        if (falta <= 0.09) {
            formatoNecesidad = cantidadNecesaria2;
        } else if (entregado > 0) {
            formatoNecesidad = Number(entregado);
        } else {
            formatoNecesidad = 0;
        }
    }

    const estaComprado = falta <= 0.09 && faltaPorComprar <= 0.09;
    const faltaEntera = Math.ceil(Math.max(0, falta - 0.09));
    const necesidadFormato = falta > 0.09
        ? `(${faltaEntera}) - ${Number(formatoNecesidad).toFixed(0)} / ${cantidadNecesaria2}`
        : `(0) - ${formatoNecesidad} / ${cantidadNecesaria2}`;

    // Calcular el estado del item (piezas vs piezas; alineado con detalle por proyecto)
    const estadoItem = estaComprado ? 'comprado' : entregado <= 0 ? 'sin-comprar' : 'parcialmente-comprado';
    const estadoTexto = estaComprado ? 'Comprado' : entregado <= 0 ? 'Sin comprar' : 'Parcialmente comprado';

    const nuevoPrecio = estaComprado ? 0 : faltaPorComprar;
    
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

    return (
            <div 
                className={`itemNecesidad ${isSelected ? 'selected' : ''} estado-${estadoItem}`}
                onClick={handleClick}
                style={{ cursor: (onClick || onCtrlClick) ? 'pointer' : 'default' }}
            >
                <div className="numeroItem">
                    <h3>{item.id}</h3>
                </div>
                <div className="infoItem">
                    <h3 className="nombreItem">{item.nombre} </h3>
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
                    <span>$ {new Intl.NumberFormat('es-CO').format(nuevoPrecio)}</span>
                </div>
            </div>

    )
}
