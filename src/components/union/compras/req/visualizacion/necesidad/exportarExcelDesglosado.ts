import * as XLSX from 'xlsx';
import { ItemNecesidad } from '../types';
import { lineaCoincideConItemNecesidad, mt2EntregadoEnLinea } from './calcularMt2MateriaPrima';

const COTIZACION_OFFSET = 21719;

export interface FilaExcelDesglosado {
    INGRESO: string;
    ENTREGA: string;
    CV: number | string;
    CLIENTE: string;
    Nombre: string;
    Necesidad: number | string;
    'Precio Unitario': number | string;
    'inversión faltante': number | string;
    Proveedor: string;
    'FECHA DE COMPRA': string;
    PLANTA: string;
}

function formatFechaExcel(value: unknown): string {
    if (value == null || value === '') return '';
    const raw = String(value);
    const datePart = raw.includes('T') ? raw.split('T')[0] : raw;
    const parts = datePart.split('-').map(Number);
    if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return '';
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
}

function precioUnitarioReal(item: ItemNecesidad): number {
    if (item.unidad === 'kg') {
        return item.precioUnitario / item.medida;
    }
    if (item.unidad === 'mt2' && item.tipo === 'producto-terminado') {
        return Number(Number(item.precioUnitario * item.medida).toFixed(0));
    }
    return item.precioUnitario;
}

function sumCantidadLineas(lineas: any[]): number {
    return lineas.reduce((acc, linea) => acc + Number(linea.cantidad || 0), 0);
}

function sumEntregadoLineas(lineas: any[]): number {
    return lineas.reduce(
        (acc, linea) => acc + Number(linea.cantidadEntrega || linea.entregado || 0),
        0
    );
}

function calcularNecesidadProyecto(item: ItemNecesidad, totalCantidad: number): number {
    const medida = Number(item.medida) || 1;

    if (item.unidad === 'mt2') {
        if (item.tipo === 'materia-prima') {
            return totalCantidad <= 0 ? 0 : Math.ceil(totalCantidad / medida);
        }
        return totalCantidad <= 0 ? 0 : Math.ceil(totalCantidad);
    }
    if (item.unidad === ('mt' as ItemNecesidad['unidad'])) {
        return totalCantidad <= 0 ? 0 : Math.ceil(totalCantidad / medida);
    }
    if (item.unidad === 'ml') {
        return totalCantidad <= 0 ? 0 : Math.ceil(totalCantidad / medida);
    }
    if (item.unidad === 'kg') {
        return totalCantidad <= 0 ? 0 : Math.ceil(totalCantidad);
    }
    return totalCantidad;
}

function calcularFaltaProyecto(
    item: ItemNecesidad,
    lineas: any[],
    necesidad: number
): number {
    const medida = Number(item.medida) || 1;

    if (item.unidad === 'mt2' && item.tipo === 'materia-prima') {
        let cantidadMt2 = 0;
        let mt2Entregado = 0;
        lineas.forEach((linea) => {
            cantidadMt2 += Number(linea.cantidad || 0);
            mt2Entregado += mt2EntregadoEnLinea(linea, medida);
        });
        const mt2Faltante = Math.max(0, cantidadMt2 - mt2Entregado);
        return mt2Faltante <= 0 ? 0 : Math.ceil(mt2Faltante / medida);
    }

    const entregado = sumEntregadoLineas(lineas);
    return Math.max(0, necesidad - entregado);
}

function calcularInversionFaltanteProyecto(
    item: ItemNecesidad,
    faltaQty: number,
    precioNum: number,
    totalCantidad: number,
    entregadoNum: number
): number {
    const base = faltaQty > 0 ? precioNum * faltaQty : 0;

    if (faltaQty <= 0.09) return 0;
    if (base <= 0.09) return 0;

    if (
        totalCantidad > 0 &&
        entregadoNum >= totalCantidad &&
        (item.unidad === ('mt' as ItemNecesidad['unidad']) || item.unidad === 'kg')
    ) {
        return 0;
    }

    return base;
}

function metaProyecto(proyecto: any) {
    const cotizacion = proyecto.cotizacion || {};
    const cliente = cotizacion.client || {};
    const cotRaw = cotizacion.id ?? proyecto.cotizacionId;
    const cotizacionId =
        cotRaw !== undefined && cotRaw !== null && cotRaw !== ''
            ? Number(cotRaw)
            : null;
    const cv =
        cotizacionId !== null && !Number.isNaN(cotizacionId)
            ? COTIZACION_OFFSET + cotizacionId
            : '';

    return {
        ingreso: formatFechaExcel(proyecto.fecha || proyecto.createdAt),
        entrega: formatFechaExcel(proyecto.fechaNecesaria),
        cv,
        cliente: cliente.name || cliente.nombre || '',
    };
}

/**
 * Genera filas Excel desglosadas: un bloque por ítem (orden de la tabla),
 * dentro de cada ítem una fila por proyecto que lo requiera.
 */
export function construirFilasExcelDesglosado(
    items: ItemNecesidad[],
    proyectos: any[] | null | undefined
): FilaExcelDesglosado[] {
    if (!proyectos?.length || !items.length) return [];

    const filas: FilaExcelDesglosado[] = [];

    items.forEach((item) => {
        const precioNum = precioUnitarioReal(item);

        proyectos.forEach((proyecto) => {
            const lineas = (proyecto.itemRequisicions || proyecto.itemRequisicion || []).filter(
                (linea: any) => lineaCoincideConItemNecesidad(linea, item)
            );

            if (!lineas.length) return;

            const totalCantidad = sumCantidadLineas(lineas);
            if (totalCantidad <= 0) return;

            const necesidad = calcularNecesidadProyecto(item, totalCantidad);
            const falta = calcularFaltaProyecto(item, lineas, necesidad);
            const entregadoNum = sumEntregadoLineas(lineas);
            const inversionFaltante = calcularInversionFaltanteProyecto(
                item,
                falta,
                precioNum,
                totalCantidad,
                entregadoNum
            );

            const meta = metaProyecto(proyecto);

            filas.push({
                INGRESO: meta.ingreso,
                ENTREGA: meta.entrega,
                CV: meta.cv,
                CLIENTE: meta.cliente,
                Nombre: item.nombre,
                Necesidad: necesidad,
                'Precio Unitario': precioNum,
                'inversión faltante': inversionFaltante,
                Proveedor: '',
                'FECHA DE COMPRA': '',
                PLANTA: '',
            });
        });
    });

    return filas;
}

export function descargarExcelDesglosado(
    items: ItemNecesidad[],
    proyectos: any[] | null | undefined,
    nombreArchivo?: string
): void {
    const filas = construirFilasExcelDesglosado(items, proyectos);
    if (!filas.length) return;

    const totalInversion = filas.reduce(
        (acc, f) => acc + (typeof f['inversión faltante'] === 'number' ? f['inversión faltante'] : 0),
        0
    );

    const filasConTotal: FilaExcelDesglosado[] = [
        ...filas,
        {
            INGRESO: '',
            ENTREGA: '',
            CV: '',
            CLIENTE: '',
            Nombre: '',
            Necesidad: '',
            'Precio Unitario': '',
            'inversión faltante': totalInversion,
            Proveedor: '',
            'FECHA DE COMPRA': '',
            PLANTA: '',
        },
    ];

    const worksheet = XLSX.utils.json_to_sheet(filasConTotal);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Necesidad desglosada');

    const archivo =
        nombreArchivo || `Consolidado_Desglosado_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, archivo);
}
