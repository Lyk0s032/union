import { ItemNecesidad } from '../types';

export interface Mt2MateriaPrimaCalculo {
    medConsumo: number;
    /** Piezas (láminas) necesarias — suma de ceil por proyecto */
    necesidad: number;
    /** Piezas entregadas (consolidado) */
    entregado: number;
    /** Piezas que faltan — suma por proyecto, no solo total global */
    falta: number;
}

function piezasNecesariasPorLinea(cantidadMt2: number, medida: number): number {
    if (medida <= 0) return 0;
    return Math.ceil(cantidadMt2 / medida);
}

/**
 * Cálculo alineado con detalleItem / itemProject (compras legacy):
 * - cantidad y totalCantidad en mt2
 * - cantidadEntrega / entregado en piezas
 * - necesidad = Σ ceil(cantidad_proyecto / medida), no ceil(Σ cantidad / medida)
 * - falta = Σ max(0, piezas_necesarias - piezas_entregadas) por línea
 */
export function calcularMt2MateriaPrima(
    item: ItemNecesidad,
    proyectos: any[] | null | undefined
): Mt2MateriaPrimaCalculo {
    const medida = Number(item.medida) || 1;
    const entregado = Number(item.entregado) || 0;
    const medConsumo = Number(item.totalCantidad) || 0;

    let necesidad = 0;
    let falta = 0;
    let encontroLineas = false;

    if (proyectos && Array.isArray(proyectos)) {
        proyectos.forEach((req: any) => {
            const lineas = req.itemRequisicions || req.itemRequisicion || [];
            if (!Array.isArray(lineas)) return;

            lineas.forEach((linea: any) => {
                const matId = linea.materium?.id ?? linea.materiumId ?? linea.materiaId;
                if (Number(matId) !== Number(item.id)) return;

                encontroLineas = true;
                const cantidadMt2 = Number(linea.cantidad || 0);
                const piezasEntregadas = Number(linea.cantidadEntrega || linea.entregado || 0);
                const piezasNecesarias = piezasNecesariasPorLinea(cantidadMt2, medida);

                necesidad += piezasNecesarias;
                falta += Math.max(0, piezasNecesarias - piezasEntregadas);
            });
        });
    }

    if (!encontroLineas) {
        necesidad = piezasNecesariasPorLinea(medConsumo, medida);
        falta = Math.max(0, necesidad - entregado);
    }

    return { medConsumo, necesidad, entregado, falta };
}

export function estaCompradoMt2MateriaPrima(calc: Mt2MateriaPrimaCalculo): boolean {
    return calc.falta <= 0.09;
}
