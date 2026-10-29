/**
 * Presentación de cotizacion_compromiso en producción (materia prima).
 * Los valores en BD siguen en m²; aquí solo convertimos para mostrar láminas.
 */

export function parseMedidaMaterial(medida) {
  if (medida == null || medida === '') return null;
  let s = String(medida).trim().toLowerCase();
  s = s.replace(/\s*(m2|m²|mt2|metros2|metros cuadrados)\s*$/i, '').trim();

  const multMatch = s.match(/(-?\d*\.?\d+)\s*(?:x|×|\*|por)\s*(-?\d*\.?\d+)/i);
  if (multMatch) {
    let a = parseFloat(multMatch[1]);
    let b = parseFloat(multMatch[2]);
    if (Number.isNaN(a) || Number.isNaN(b)) return null;
    if (Math.abs(a) >= 50) a /= 100;
    if (Math.abs(b) >= 50) b /= 100;
    return Number((a * b).toFixed(6));
  }

  const compactMatch = s.match(/^(-?\d*\.?\d+)[x×*](-?\d*\.?\d+)$/i);
  if (compactMatch) {
    let a = parseFloat(compactMatch[1]);
    let b = parseFloat(compactMatch[2]);
    if (Number.isNaN(a) || Number.isNaN(b)) return null;
    if (Math.abs(a) >= 50) a /= 100;
    if (Math.abs(b) >= 50) b /= 100;
    return Number((a * b).toFixed(6));
  }

  const num = parseFloat(s.replace(',', '.'));
  if (!Number.isNaN(num) && num > 0) return Number(num);
  return null;
}

export function unidadMedidaFromCompromisoItem(item) {
  if (item?.materium) {
    return {
      unidad: String(item.materium.unidad || '').toLowerCase(),
      medida: item.materium.medida,
    };
  }
  if (item?.producto) {
    return {
      unidad: String(item.producto.unidad || '').toLowerCase(),
      medida: item.medida ?? item.producto.medida,
    };
  }
  return { unidad: '', medida: null };
}

export function m2ToLaminasCeil(m2, areaLamina) {
  const n = Number(m2);
  const area = Number(areaLamina);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (!Number.isFinite(area) || area <= 0) return 0;
  return Math.ceil(n / area);
}

/** Avance global: suma con tope por ítem (siempre en unidades de compromiso, m² en BD). */
export function calcAvanceCompromisosCapped(compromisos) {
  const lista = Array.isArray(compromisos) ? compromisos : [];
  let sumComprometida = 0;
  let sumEntregadaCapped = 0;

  for (const item of lista) {
    const comprometida = Number(item.cantidadComprometida || 0);
    const entregada = Number(item.cantidadEntregada || 0);
    if (comprometida <= 0) continue;
    sumComprometida += comprometida;
    sumEntregadaCapped += Math.min(entregada, comprometida);
  }

  if (sumComprometida <= 0) return 0;
  return Math.round((sumEntregadaCapped / sumComprometida) * 100);
}

function formatCantidadGenerica(valor, unidad) {
  const n = Number(valor || 0);
  const u = String(unidad || '').toLowerCase();
  if (u === 'unidad') return n.toFixed(0);
  if (u === 'mt2' || u === 'mt' || u === 'kg') return n.toFixed(2);
  return n.toFixed(2);
}

/**
 * Texto entregado / necesidad para una fila de compromiso.
 */
export function formatCompromisoNecesidadDisplay(item) {
  const entregada = Number(item.cantidadEntregada || 0);
  const comprometida = Number(item.cantidadComprometida || 0);
  const { unidad, medida } = unidadMedidaFromCompromisoItem(item);

  if (unidad === 'mt2') {
    const area = parseMedidaMaterial(medida);
    if (area > 0) {
      const entPzas = m2ToLaminasCeil(entregada, area);
      const necPzas = m2ToLaminasCeil(comprometida, area);
      const label = necPzas === 1 ? 'lámina' : 'láminas';
      return {
        main: `${entPzas} / ${necPzas} ${label}`,
        hint:
          comprometida > 0 || entregada > 0
            ? `≈ ${entregada.toFixed(2)} / ${comprometida.toFixed(2)} m²`
            : null,
      };
    }
  }

  const uLabel = unidad || 'unidad';
  return {
    main: `${formatCantidadGenerica(entregada, unidad)} / ${formatCantidadGenerica(comprometida, unidad)} ${uLabel}`,
    hint: null,
  };
}
