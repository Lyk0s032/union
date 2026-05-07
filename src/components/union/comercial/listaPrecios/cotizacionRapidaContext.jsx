import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

export function CotizacionRapidaProvider({ children }) {
  const [draft, setDraft] = useState(loadDraft);
  const [addModalPayload, setAddModalPayload] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

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
    }) => {
      const n = Math.max(1, Number(cantidad) || 1);
      const price = Number(unitPrice) || 0;
      setDraft((prev) => {
        const idx = prev.items.findIndex(
          (i) =>
            i.tipo === tipo &&
            i.refId === refId &&
            i.priceType === priceType
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

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
      removeLine,
      setCliente,
      clearDraft,
      panelOpen,
      openPanel,
      closePanel,
      itemCount: draft.items.length,
      hasActiveDraft: draft.items.length > 0,
    }),
    [
      draft,
      addModalPayload,
      openAddItemModal,
      closeAddItemModal,
      addOrMergeLine,
      updateLineCantidad,
      removeLine,
      setCliente,
      clearDraft,
      panelOpen,
      openPanel,
      closePanel,
    ]
  );

  return (
    <CotizacionRapidaContext.Provider value={value}>
      {children}
    </CotizacionRapidaContext.Provider>
  );
}
