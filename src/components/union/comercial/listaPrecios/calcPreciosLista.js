/** Cálculos alineados con itemProducto.jsx (GetPrice) e itemKit.jsx (PrecioCalculado). */

export function preciosProductoTerminado(terminado) {
  if (!terminado) return { precioDistribuidor: 0, precioFinal: 0 };
  const distribuidor = terminado?.linea?.percentages?.length
    ? Number(terminado.linea.percentages[0].distribuidor)
    : 0;
  const final = terminado?.linea?.percentages?.length
    ? Number(terminado.linea.percentages[0].final)
    : 0;
  const precios = terminado.productPrices || [];
  const valor = precios.reduce((a, b) => Number(a) + Number(b?.valor ?? 0), 0);
  const promedio = precios.length ? Number(valor) / precios.length : 0;
  const precioDistribuidor =
    distribuidor > 0 ? promedio / distribuidor : promedio;
  const precioFinal = final > 0 ? promedio / final : promedio;
  return { precioDistribuidor, precioFinal };
}

export function preciosKit(kit) {
  if (!kit) return { precioDistribuidor: 0, precioFinal: 0 };
  const distribuidor = kit?.linea?.percentages?.length
    ? Number(kit.linea.percentages[0].distribuidor)
    : 0;
  const final = kit?.linea?.percentages?.length
    ? Number(kit.linea.percentages[0].final)
    : 0;
  const valorProduccion = Number(kit?.priceKits?.[0]?.bruto) || 0;
  const valorDistribuidor =
    distribuidor > 0
      ? valorProduccion / distribuidor
      : valorProduccion;
  const precioFinal =
    final > 0 ? valorDistribuidor / final : valorDistribuidor;
  return { precioDistribuidor: valorDistribuidor, precioFinal };
}
