import axios from "axios";

/**
 * Descripción en PDF como documentCotizacion.jsx:
 * - kit: NOMBRE - EXTENSIÓN
 * - producto: solo nombre del ítem (terminado.item)
 */
function descripcionLineaPdf(row) {
  if (row.tipo === "kit") {
    const ext =
      (row.extensionNombre && String(row.extensionNombre).trim()) ||
      (row.detalle && String(row.detalle).split(" · ")[0]?.trim()) ||
      "";
    const name = String(row.nombre || "").trim();
    if (ext) return `${name} - ${ext}`.toUpperCase();
    return name.toUpperCase();
  }
  return String(row.nombre || "").trim().toUpperCase();
}

/**
 * Misma forma que transformarAreas() en documentCotizacion.jsx (payload a generatePdf).
 */
function buildAreasFromItems(items) {
  const productos = (items || []).map((row) => {
    const referencia =
      row.tipo === "kit" ? `0${row.refId}` : `PT${row.refId}`;
    const descripcion = descripcionLineaPdf(row);
    return {
      referencia,
      descripcion,
      cantidad: Number(row.cantidad),
      valorUnitario: Number(Number(row.unitPrice).toFixed(0)),
      subtotal: Number(Number(row.subtotal).toFixed(0)),
    };
  });
  const totalArea = productos.reduce((a, p) => a + p.subtotal, 0);
  return [
    {
      nombre: "LISTA DE PRECIOS",
      productos,
      totalArea: Number(totalArea.toFixed(0)),
    },
  ];
}

/** Misma lógica que TotalSub en documentCotizacion.jsx (sin descuentos en cotización rápida). */
function buildTotalesFromItems(items) {
  const subTotal = (items || []).reduce(
    (a, r) => a + Number(r.subtotal || 0),
    0
  );
  const sumaDescuento = 0;
  const totalSub = subTotal - sumaDescuento;
  const valorIva = Number(subTotal - sumaDescuento) * (19 / 100);
  const total = totalSub + valorIva;
  return {
    subtotal: subTotal.toFixed(0),
    descuentos: sumaDescuento.toFixed(0),
    subtotalConDescuento: totalSub.toFixed(0),
    iva: valorIva.toFixed(0),
    total: total.toFixed(0),
  };
}

/** Igual que getMun en documentCotizacion.jsx: código DANE (cod_mpio) → nombre municipio. */
async function municipioNombrePorCodigo(codigo) {
  const code = String(codigo ?? "").trim();
  if (!code || !/^\d+$/.test(code)) return null;
  const variants = [code];
  if (code.length < 5) variants.push(code.padStart(5, "0"));
  for (const c of variants) {
    try {
      const res = await axios.get(
        "https://www.datos.gov.co/resource/gdxc-w37w.json",
        { params: { cod_mpio: c } }
      );
      if (res.data?.length > 0 && res.data[0].nom_mpio) {
        return res.data[0].nom_mpio;
      }
    } catch {
      /* ignorar */
    }
  }
  return null;
}

/**
 * Si `ciudad` es solo dígitos (código), consulta datos.gov.co y devuelve el nombre.
 * Si ya es texto, devuelve el mismo valor en mayúsculas.
 */
async function resolveCiudadParaPdf(ciudadRaw) {
  if (ciudadRaw == null || String(ciudadRaw).trim() === "") return null;
  const s = String(ciudadRaw).trim();
  if (/^\d+$/.test(s)) {
    const nombre = await municipioNombrePorCodigo(s);
    return nombre ? nombre.toUpperCase() : null;
  }
  return s.toUpperCase();
}

/** Teléfono cliente: API / JSON usa `phone`; compatibilidad con borradores viejos `telefono` y `fijos`. */
export function clienteTelefonoDisplay(c) {
  if (!c) return "";
  if (c.phone != null && String(c.phone).trim() !== "") {
    return String(c.phone);
  }
  if (c.telefono != null && String(c.telefono).trim() !== "") {
    return String(c.telefono);
  }
  if (Array.isArray(c.fijos) && c.fijos.length) {
    return String(c.fijos[0]);
  }
  return "";
}

/**
 * PDF idéntico al de documentCotizacion.jsx: POST /api/cotizacion/generatePdf
 */
export async function descargarCotizacionRapidaPdf({ items, cliente, user }) {
  const c = cliente || {};
  const u = user || {};
  const phone = clienteTelefonoDisplay(c);
  const areas = buildAreasFromItems(items);
  const totales = buildTotalesFromItems(items);
  const ciudadPdf = await resolveCiudadParaPdf(c.ciudad);

  const numero = `MDC-CV-${21719 + (Date.now() % 100000)}`;

  const data = {
    cotizacion: {
      numero,
      fecha: new Date().toISOString().split("T")[0],
    },
    asesor: {
      nombre: `${(u.name || "").toUpperCase()} ${(u.lastName || "").toUpperCase()}`.trim(),
      correo: String(u.email || "").toUpperCase(),
      telefono: u.phone || "",
    },
    cliente: {
      nombre: String(c.nombre || "—").toUpperCase(),
      telefono: phone || "—",
      direccion: String(c.direccion || "—").toUpperCase(),
      ciudad: ciudadPdf,
    },
    condiciones: {
      validez: 15,
      entrega: 30,
      formaPago: null,
    },
    areas,
    totales,
    notas: [
      {
        texto:
          "Cotización de referencia generada desde lista de precios (sin registro en sistema). Sujeta a confirmación comercial.",
      },
    ],
  };

  const response = await axios.post(
    "/api/cotizacion/generatePdf",
    { data },
    { responseType: "blob" }
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safe =
    String(c.nombre || "cliente")
      .replace(/[^\w\s\-]/g, "")
      .slice(0, 40)
      .trim() || "cliente";
  link.setAttribute("download", `cotizacion-${safe}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
