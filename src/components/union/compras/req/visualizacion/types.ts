// Interfaces para facilitar la integración con la API

export interface Proyecto {
    id: number;
    nombre: string;
    cotizacionId: number;
    fecha: string; // ISO date string
    estado: 'pendiente' | 'en proceso' | 'completada' | 'aprobada';
    cliente: string;
    totalProyecto: number;
    totalComprado: number;
    totalFaltante: number;
}

export interface Kit {
    id: number;
    nombre: string;
    tipo: 'KIT' | 'PRODUCTO TERMINADO';
    necesidad: number;
}

export interface ItemNecesidad {
    id: number;
    nombre: string;
    tipo: 'materia-prima' | 'producto-terminado';
    unidad: 'mt2' | 'ml' | 'kg' | 'unidad';
    medida: number; // Medida por pieza (para mt2: área, para ml: longitud, etc.)
    medidaOriginal: string; // Formato original de la medida (ej: "2X2", "2.5 ml")
    totalCantidad: number; // Cantidad total necesaria
    entregado: number; // Cantidad ya entregada
    precioUnitario: number;
    categoria: string;
}

export interface MedidasCalculadas {
    medConsumo: number; // Medida de consumo total
    necesidad: number; // Cantidad de piezas necesarias
}
