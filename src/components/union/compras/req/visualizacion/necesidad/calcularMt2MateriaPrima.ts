import { ItemNecesidad } from '../types';

export interface Mt2MateriaPrimaCalculo {
    medConsumo: number;
    /** Piezas (láminas) necesarias — ceil del total mt2 seleccionado / medida */
    necesidad: number;
    /** Piezas (láminas) equivalentes ya repartidas según mt2 entregado */
    entregado: number;
    /** Piezas (láminas) que faltan por comprar/repartir */
    falta: number;
}

function piezasNecesariasDesdeMt2(cantidadMt2: number, medida: number): number {
    if (medida <= 0 || cantidadMt2 <= 0) return 0;
    return Math.ceil(cantidadMt2 / medida);
}

function lineaCoincideConItem(linea: any, item: ItemNecesidad, medida: number): boolean {
    const matId = linea.materium?.id ?? linea.materiumId ?? linea.materiaId;
    if (Number(matId) !== Number(item.id)) return false;

    if (linea.medida != null && linea.medida !== '' && Number(linea.medida) !== medida) {
        return false;
    }

    return true;
}

/**
 * Misma conversión que detalleItem (cantidadEntrega en piezas → mt2 entregado).
 * Si cantidadEntrega ya viene en mt2 (legacy), el tope por cantidad lo normaliza.
 */
export function mt2EntregadoEnLinea(linea: any, medida: number): number {
    const totalMt2 = Number(linea.cantidad || 0);
    const actual = Number(linea.cantidadEntrega || linea.entregado || 0);
    if (actual <= 0 || totalMt2 <= 0) return 0;

    const entregadoComoPiezas = actual * medida;
    return entregadoComoPiezas > totalMt2 ? totalMt2 : entregadoComoPiezas;
}

function mt2EntregadoDesdeConsolidado(
    entregadoRaw: number,
    medConsumo: number,
    medida: number
): number {
    if (entregadoRaw <= 0 || medConsumo <= 0) return 0;

    // Legacy: consolidado suma cantidadEntrega en mt2
    if (entregadoRaw <= medConsumo + 0.09) {
        return entregadoRaw;
    }

    // Piezas consolidadas → mt2
    return Math.min(entregadoRaw * medida, medConsumo);
}

/**
 * Compra optimizada sobre proyectos seleccionados:
 * - cantidad / totalCantidad en mt2
 * - cantidadEntrega por línea en piezas (mt2 en datos legacy, acotado por cantidad)
 * - necesidad = ceil(Σ mt2 necesario / medida)
 * - falta / entregado en piezas según mt2 realmente repartido vs necesario
 */
export function calcularMt2MateriaPrima(
    item: ItemNecesidad,
    proyectos: any[] | null | undefined
): Mt2MateriaPrimaCalculo {
    const medida = Number(item.medida) || 1;
    const medConsumo = Number(item.totalCantidad) || 0;

    let totalMt2 = 0;
    let totalMt2Entregado = 0;
    let encontroLineas = false;

    if (proyectos && Array.isArray(proyectos)) {
        proyectos.forEach((req: any) => {
            const lineas = req.itemRequisicions || req.itemRequisicion || [];
            if (!Array.isArray(lineas)) return;

            lineas.forEach((linea: any) => {
                if (!lineaCoincideConItem(linea, item, medida)) return;

                encontroLineas = true;
                totalMt2 += Number(linea.cantidad || 0);
                totalMt2Entregado += mt2EntregadoEnLinea(linea, medida);
            });
        });
    }

    const mt2Necesario = encontroLineas ? totalMt2 : medConsumo;
    const mt2Entregado = encontroLineas
        ? totalMt2Entregado
        : mt2EntregadoDesdeConsolidado(Number(item.entregado) || 0, medConsumo, medida);

    const necesidad = piezasNecesariasDesdeMt2(mt2Necesario, medida);
    const mt2Faltante = Math.max(0, mt2Necesario - mt2Entregado);
    const falta = piezasNecesariasDesdeMt2(mt2Faltante, medida);
    const entregado = Math.max(0, necesidad - falta);

    return { medConsumo, necesidad, entregado, falta };
}

export function estaCompradoMt2MateriaPrima(calc: Mt2MateriaPrimaCalculo): boolean {
    return calc.falta <= 0.09;
}

/** Coincidencia de línea de requisición con ítem consolidado (materia o producto). */
export function lineaCoincideConItemNecesidad(linea: any, item: ItemNecesidad): boolean {
    const medida = Number(item.medida) || 1;

    if (item.tipo === 'materia-prima') {
        if (!linea.materium && !linea.materiumId && !linea.materiaId) return false;
        return lineaCoincideConItem(linea, item, medida);
    }

    const prodId = linea.producto?.id ?? linea.productoId;
    if (!prodId || Number(prodId) !== Number(item.id)) return false;

    if (linea.medida != null && linea.medida !== '' && Number(linea.medida) !== medida) {
        return false;
    }

    return true;
}
