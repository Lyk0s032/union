import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";

const STORAGE_KEY = "union_cotizacion_rapida_v1";

function normalizeCliente(raw) {
  if (!raw || typeof raw !== "object") return defaultDraft().cliente;
  const phone =
    raw.phone != null && String(raw.phone).trim() !== ""
      ? String(raw.phone)
      : raw.telefono != null && String(raw.telefono).trim() !== ""
        ? String(raw.telefono)
        : "";
  return {
    id: raw.id ?? null,
    nombre: String(raw.nombre ?? ""),
    nit: String(raw.nit ?? ""),
    phone,
    direccion: String(raw.direccion ?? ""),
    ciudad: String(raw.ciudad ?? ""),
  };
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDraft();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return defaultDraft();
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      cliente: normalizeCliente(parsed.cliente),
    };
  } catch {
    return defaultDraft();
  }
}

function defaultDraft() {
  return {
    items: [],
    cliente: {
      id: null,
      nombre: "",
      nit: "",
      phone: "",
      direccion: "",
      ciudad: "",
    },
  };
}

const CotizacionRapidaContext = createContext(null);

export function useCotizacionRapida() {
  const ctx = useContext(CotizacionRapidaContext);
  if (!ctx) {
    throw new Error("useCotizacionRapida debe usarse dentro del proveedor");
  }
  return ctx;
}

const CRM_BASE = "https://comercialapi-production.up.railway.app";

export function CotizacionRapidaProvider({ children }) {
  const [draft, setDraft] = useState(loadDraft);
  const [addModalPayload, setAddModalPayload] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const usuario = useSelector((s) => s.usuario);
  const u = usuario?.user?.user;

  const [loadingCRM, setLoadingCRM] = useState(false);
  const [estadoCRM, setEstadoCRM] = useState("pendiente"); // 'pendiente' | 'enviado' | 'error'

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore quota */
    }
  }, [draft]);

  const openAddItemModal = useCallback((payload) => {
    setAddModalPayload(payload);
  }, []);

  const closeAddItemModal = useCallback(() => setAddModalPayload(null), []);

  const addOrMergeLine = useCallback(
    ({
      tipo,
      refId,
      codigo,
      nombre,
      detalle,
      extensionNombre,
      priceType,
      unitPrice,
      cantidad,
      isSimulacion,
    }) => {
      const n = Math.max(1, Number(cantidad) || 1);
      const price = Number(unitPrice) || 0;
      setDraft((prev) => {
        // Las simulaciones nunca se fusionan: cada una es una línea independiente
        if (!isSimulacion) {
          const idx = prev.items.findIndex(
            (i) =>
              i.tipo === tipo &&
              i.refId === refId &&
              i.priceType === priceType &&
              !i.isSimulacion
          );
          if (idx >= 0) {
            const next = [...prev.items];
            const row = next[idx];
            const newQty = Number(row.cantidad) + n;
            next[idx] = {
              ...row,
              cantidad: newQty,
              subtotal: Math.round(newQty * price),
            };
            return { ...prev, items: next };
          }
        }
        const lineId = `${tipo}-${refId}-${priceType}-${Date.now()}`;
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              lineId,
              tipo,
              refId,
              codigo: String(codigo ?? ""),
              nombre,
              detalle: detalle ?? "",
              extensionNombre:
                extensionNombre != null ? String(extensionNombre) : "",
              priceType,
              unitPrice: price,
              cantidad: n,
              subtotal: Math.round(n * price),
              isSimulacion: isSimulacion ?? false,
            },
          ],
        };
      });
    },
    []
  );

  const updateLineCantidad = useCallback((lineId, cantidad) => {
    const n = Math.max(1, Number(cantidad) || 1);
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((row) =>
        row.lineId === lineId
          ? {
              ...row,
              cantidad: n,
              subtotal: Math.round(n * Number(row.unitPrice)),
            }
          : row
      ),
    }));
  }, []);

  const updateLineNombre = useCallback((lineId, nombre) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((row) =>
        row.lineId === lineId ? { ...row, nombre } : row
      ),
    }));
  }, []);

  const updateLineUnitPrice = useCallback((lineId, unitPrice) => {
    const price = Number(unitPrice) || 0;
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((row) =>
        row.lineId === lineId
          ? {
              ...row,
              unitPrice: price,
              subtotal: Math.round(Number(row.cantidad) * price),
            }
          : row
      ),
    }));
  }, []);

  const removeLine = useCallback((lineId) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.lineId !== lineId),
    }));
  }, []);

  const setCliente = useCallback((cliente) => {
    setDraft((prev) => ({
      ...prev,
      cliente: { ...prev.cliente, ...cliente },
    }));
  }, []);

  const clearDraft = useCallback(() => {
    setDraft(defaultDraft());
    setEstadoCRM("pendiente");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const resetEstadoCRM = useCallback(() => setEstadoCRM("pendiente"), []);

  const enviarAlCRM = useCallback(async () => {
    if (!draft.items.length || loadingCRM) return;

    setLoadingCRM(true);
    setEstadoCRM("pendiente");

    try {
      // 1. Buscar cliente en CRM por NIT; si no existe, crearlo
      let cliente;
      try {
        const res = await axios.get(
          `${CRM_BASE}/api/cotizacion/give/clientByNit/${draft.cliente.nit}`
        );
        cliente = res.data;
      } catch {
        const clienteBody = {
          photo: null,
          nombreEmpresa: draft.cliente.nombre,
          nit: draft.cliente.nit,
          phone: draft.cliente.phone,
          email: null,
          type: "empresa",
          sector: null,
          responsable: null,
          url: null,
          direccion: draft.cliente.direccion,
          fijo: null,
        };
        const res = await axios.post(`${CRM_BASE}/api/clients/create`, clienteBody);
        cliente = res.data;
      }

      // 2. Calcular totales (la cotización rápida no maneja descuentos por ítem)
      const subTotal = draft.items.reduce((acc, r) => acc + Number(r.subtotal || 0), 0);
      const descuentos = 0;
      const valorIva = (subTotal - descuentos) * (19 / 100);
      const neto = subTotal - descuentos + valorIva;

      // 3. Crear cotización en el CRM con el campo distribuidor: true
      const cotizacionBody = {
        name: draft.cliente.nombre || "Cotización rápida",
        nit: draft.cliente.nit,
        nro: Date.now(),
        fecha: new Date().toISOString().split("T")[0],
        bruto: Math.round(subTotal),
        descuento: Math.round(descuentos),
        iva: 19,
        neto: Math.round(neto),
        clientId: cliente.id,
        userId: u?.crm,
        state: "pendiente",
        distribuidor: true,
      };

      await axios.post(`${CRM_BASE}/api/cotizacion/add`, cotizacionBody);
      setEstadoCRM("enviado");
    } catch (err) {
      console.error("Error al enviar al CRM:", err);
      setEstadoCRM("error");
    } finally {
      setLoadingCRM(false);
    }
  }, [draft, loadingCRM, u]);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const value = useMemo(
    () => ({
      draft,
      addModalPayload,
      openAddItemModal,
      closeAddItemModal,
      addOrMergeLine,
      updateLineCantidad,
      updateLineNombre,
      updateLineUnitPrice,
      removeLine,
      setCliente,
      clearDraft,
      panelOpen,
      openPanel,
      closePanel,
      itemCount: draft.items.length,
      hasActiveDraft: draft.items.length > 0,
      // CRM
      loadingCRM,
      estadoCRM,
      enviarAlCRM,
      resetEstadoCRM,
    }),
    [
      draft,
      addModalPayload,
      openAddItemModal,
      closeAddItemModal,
      addOrMergeLine,
      updateLineCantidad,
      updateLineNombre,
      updateLineUnitPrice,
      removeLine,
      setCliente,
      clearDraft,
      panelOpen,
      openPanel,
      closePanel,
      loadingCRM,
      estadoCRM,
      enviarAlCRM,
      resetEstadoCRM,
    ]
  );

  return (
    <CotizacionRapidaContext.Provider value={value}>
      {children}
    </CotizacionRapidaContext.Provider>
  );
}
