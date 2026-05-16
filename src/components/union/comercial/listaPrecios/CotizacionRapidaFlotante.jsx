import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/action/action";
import { useCotizacionRapida } from "./cotizacionRapidaContext";
import { descargarCotizacionRapidaPdf } from "./cotizacionRapidaPdf";
import AddItemCotizacionModal from "./AddItemCotizacionModal";
import CantidadEditable from "./CantidadEditable";

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { currency: "COP" }).format(
    Number(n || 0).toFixed(0)
  );

export default function CotizacionRapidaFlotante() {
  const dispatch = useDispatch();
  const usuario = useSelector((s) => s.usuario);
  const { user } = usuario || {};
  const u = user?.user;

  const {
    draft,
    hasActiveDraft,
    itemCount,
    panelOpen,
    openPanel,
    closePanel,
    updateLineCantidad,
    updateLineNombre,
    updateLineUnitPrice,
    removeLine,
    setCliente,
    clearDraft,
    loadingCRM,
    estadoCRM,
    enviarAlCRM,
    resetEstadoCRM,
  } = useCotizacionRapida();

  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteResultados, setClienteResultados] = useState(null);
  const searchDebounceRef = useRef(null);

  const buscarCliente = useCallback(async (q) => {
    if (!q || String(q).trim() === "") {
      setClienteResultados(null);
      return;
    }
    try {
      const res = await axios.get("/api/cotizacion/search", {
        params: { query: q },
      });
      setClienteResultados(res.data || []);
    } catch {
      setClienteResultados([]);
    }
  }, []);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      buscarCliente(clienteQuery);
    }, 320);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [clienteQuery, buscarCliente]);

  const total = draft.items.reduce(
    (a, r) => a + Number(r.subtotal || 0),
    0
  );

  const handlePdf = async () => {
    if (!draft.items.length) {
      dispatch(
        actions.HandleAlerta("Agrega al menos un ítem a la cotización", "mistake")
      );
      return;
    }
    if (!u) {
      dispatch(actions.HandleAlerta("No hay sesión de usuario", "mistake"));
      return;
    }
    try {
      await descargarCotizacionRapidaPdf({
        items: draft.items,
        cliente: draft.cliente,
        user: u,
      });
      dispatch(actions.HandleAlerta("PDF generado", "positive"));
    } catch (err) {
      console.error(err);
      dispatch(
        actions.HandleAlerta("No hemos logrado generar el PDF", "mistake")
      );
    }
  };

  const handleEnviarCRM = async () => {
    if (!draft.items.length) {
      dispatch(
        actions.HandleAlerta("Agrega al menos un ítem antes de enviar al CRM", "mistake")
      );
      return;
    }
    if (!draft.cliente.nit) {
      dispatch(
        actions.HandleAlerta("El cliente debe tener NIT para enviar al CRM", "mistake")
      );
      return;
    }
    if (!u) {
      dispatch(actions.HandleAlerta("No hay sesión de usuario", "mistake"));
      return;
    }
    await enviarAlCRM();
    // La alerta de resultado se maneja reactivamente en el efecto de abajo
  };

  useEffect(() => {
    if (estadoCRM === "enviado") {
      dispatch(actions.HandleAlerta("Cotización enviada al CRM correctamente", "positive"));
    } else if (estadoCRM === "error") {
      dispatch(actions.HandleAlerta("Error al enviar al CRM. Intenta de nuevo.", "mistake"));
      resetEstadoCRM();
    }
  }, [estadoCRM]);

  const handleVaciar = () => {
    if (
      !window.confirm(
        "¿Vaciar la cotización rápida guardada en este equipo? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }
    clearDraft();
    setClienteQuery("");
    setClienteResultados(null);
    dispatch(actions.HandleAlerta("Cotización rápida vaciada", "positive"));
  };

  const fab =
    hasActiveDraft &&
    createPortal(
      <button
        type="button"
        className="cotizacionRapidaFab"
        onClick={openPanel}
        title="Cotización en curso"
      >
        <span className="cotizacionRapidaFabBadge">{itemCount}</span>
        <span>Cotización rápida</span>
      </button>,
      document.body
    );

  const panel =
    panelOpen &&
    createPortal(
      <div className="modal cotizacionRapidaOverlay">
        <div
          className="hiddenModal"
          onClick={closePanel}
          role="presentation"
        />
        <div className="containerModal cotizacionRapidaSheet">
          <div className="cotizacionRapidaSheetHeader">
            <div>
              <h2>Cotización rápida</h2>
              <p>
                Se guarda en este navegador hasta que la vacíes. Ideal para
                enviar un PDF por WhatsApp sin crear cotización en el sistema.
              </p>
            </div>
            <button
              type="button"
              className="cotizacionRapidaBtnIcon"
              onClick={closePanel}
            >
              Cerrar
            </button>
          </div>

          <div className="cotizacionRapidaBody">
            <h3>Ítems</h3>
            <div className="cotizacionRapidaTableWrap">
              <table className="cotizacionRapidaTable">
                <thead>
                  <tr>
                    <th>Ref.</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cant.</th>
                    <th>Subt.</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {draft.items.map((row) =>
                    row.isSimulacion ? (
                      <FilaSimulacion
                        key={row.lineId}
                        row={row}
                        updateLineCantidad={updateLineCantidad}
                        updateLineNombre={updateLineNombre}
                        updateLineUnitPrice={updateLineUnitPrice}
                        removeLine={removeLine}
                        dispatch={dispatch}
                      />
                    ) : (
                      <tr key={row.lineId}>
                        <td>{row.codigo}</td>
                        <td>
                          <div>{row.nombre}</div>
                          {row.detalle ? (
                            <div className="cotizacionRapidaDesc2">
                              {row.detalle}
                            </div>
                          ) : null}
                        </td>
                        <td>
                          {row.priceType === "distribuidor"
                            ? "Distribuidor"
                            : "Final"}
                        </td>
                        <td>
                          <CantidadEditable
                            className="cotizacionRapidaQty"
                            value={row.cantidad}
                            onCommit={(n) =>
                              updateLineCantidad(row.lineId, n)
                            }
                          />
                        </td>
                        <td>{fmt(row.subtotal)}</td>
                        <td>
                          <button
                            type="button"
                            className="cotizacionRapidaLinkDanger"
                            onClick={() => removeLine(row.lineId)}
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <div className="cotizacionRapidaTotal">
              Total: {fmt(total)} COP
            </div>

            <h3>Cliente</h3>
            <p className="cotizacionRapidaHint">
              Puedes buscar en el CRM o completar a mano lo que falte.
            </p>

            <div className="cotizacionRapidaFieldSmall cotizacionRapidaGridFull">
              <label htmlFor="cr-search-cliente">Buscar cliente</label>
              <input
                id="cr-search-cliente"
                type="text"
                placeholder="Nombre o NIT…"
                value={clienteQuery}
                onChange={(e) => setClienteQuery(e.target.value)}
              />
            </div>

            {clienteResultados?.length ? (
              <div className="cotizacionRapidaClienteResults">
                {clienteResultados.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setCliente({
                        id: r.id,
                        nombre: r.nombre || "",
                        nit: r.nit || "",
                        phone:
                          r.phone ??
                          r.telefono ??
                          (Array.isArray(r.fijos) && r.fijos.length
                            ? r.fijos[0]
                            : "") ??
                          "",
                        direccion: r.direccion ?? "",
                        ciudad:
                          r.ciudad ??
                          r.ciudadNombre ??
                          r.nom_mpio ??
                          "",
                      });
                      setClienteQuery("");
                      setClienteResultados(null);
                    }}
                  >
                    <strong>{r.nombre}</strong>
                    {r.nit ? (
                      <span className="cotizacionRapidaMuted"> · {r.nit}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="cotizacionRapidaGrid">
              <div className="cotizacionRapidaFieldSmall">
                <label htmlFor="cr-cli-nombre">Nombre</label>
                <input
                  id="cr-cli-nombre"
                  type="text"
                  value={draft.cliente.nombre || ""}
                  onChange={(e) => setCliente({ nombre: e.target.value })}
                />
              </div>
              <div className="cotizacionRapidaFieldSmall">
                <label htmlFor="cr-cli-nit">NIT</label>
                <input
                  id="cr-cli-nit"
                  type="text"
                  value={draft.cliente.nit || ""}
                  onChange={(e) => setCliente({ nit: e.target.value })}
                />
              </div>
              <div className="cotizacionRapidaFieldSmall">
                <label htmlFor="cr-cli-tel">Teléfono</label>
                <input
                  id="cr-cli-tel"
                  type="text"
                  value={draft.cliente.phone || ""}
                  onChange={(e) => setCliente({ phone: e.target.value })}
                />
              </div>
              <div className="cotizacionRapidaFieldSmall">
                <label htmlFor="cr-cli-ciudad">Ciudad</label>
                <input
                  id="cr-cli-ciudad"
                  type="text"
                  value={draft.cliente.ciudad || ""}
                  onChange={(e) => setCliente({ ciudad: e.target.value })}
                />
              </div>
              <div className="cotizacionRapidaFieldSmall cotizacionRapidaGridFull">
                <label htmlFor="cr-cli-dir">Dirección</label>
                <input
                  id="cr-cli-dir"
                  type="text"
                  value={draft.cliente.direccion || ""}
                  onChange={(e) => setCliente({ direccion: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="cotizacionRapidaActions">
            <button
              type="button"
              className="cotizacionRapidaBtn cotizacionRapidaBtnDanger"
              onClick={handleVaciar}
            >
              <span>Vaciar todo</span>
            </button>
            <button
              type="button"
              className="cotizacionRapidaBtn cotizacionRapidaBtnPrimary"
              onClick={handlePdf}
            >
              <span>Descargar PDF</span>
            </button>
            <button
              type="button"
              className="cotizacionRapidaBtn cotizacionRapidaBtnCRM"
              onClick={handleEnviarCRM}
              disabled={loadingCRM || estadoCRM === "enviado"}
            >
              <span>
                {loadingCRM
                  ? "Enviando..."
                  : estadoCRM === "enviado"
                  ? "Enviado ✓"
                  : "Enviar al CRM"}
              </span>
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <AddItemCotizacionModal />
      {fab}
      {panel}
    </>
  );
}

function FilaSimulacion({ row, updateLineCantidad, updateLineNombre, updateLineUnitPrice, removeLine, dispatch }) {
  const [editNombre, setEditNombre] = useState(false);
  const [nombreDraft, setNombreDraft] = useState(row.nombre);
  const [savingNombre, setSavingNombre] = useState(false);

  const [editPrecio, setEditPrecio] = useState(false);
  const [precioDraft, setPrecioDraft] = useState(String(row.unitPrice));

  const openEditNombre = () => {
    setNombreDraft(row.nombre);
    setEditNombre(true);
  };

  const cancelNombre = () => {
    setEditNombre(false);
    setNombreDraft(row.nombre);
  };

  const commitNombre = async () => {
    const trimmed = nombreDraft.trim();
    if (!trimmed || trimmed === row.nombre) {
      setEditNombre(false);
      return;
    }
    setSavingNombre(true);
    try {
      await axios.put("/api/kit/new", { nombre: trimmed, kitId: row.refId });
      updateLineNombre(row.lineId, trimmed);
      dispatch(actions.HandleAlerta("Nombre actualizado", "positive"));
    } catch (err) {
      console.error(err);
      dispatch(actions.HandleAlerta("No se pudo actualizar el nombre", "mistake"));
      setNombreDraft(row.nombre);
    } finally {
      setSavingNombre(false);
      setEditNombre(false);
    }
  };

  const openEditPrecio = () => {
    setPrecioDraft(Number(row.unitPrice).toFixed(0));
    setEditPrecio(true);
  };

  const cancelPrecio = () => {
    setEditPrecio(false);
    setPrecioDraft(String(row.unitPrice));
  };

  const commitPrecio = () => {
    const val = Number(precioDraft);
    if (!Number.isFinite(val) || val < 0) {
      cancelPrecio();
      return;
    }
    updateLineUnitPrice(row.lineId, val);
    setEditPrecio(false);
  };

  return (
    <tr className="cotizacionRapidaFilaSimulacion">
      <td>{row.codigo}</td>
      <td>
        {editNombre ? (
          savingNombre ? (
            <span className="cotizacionRapidaMuted">Guardando...</span>
          ) : (
            <input
              type="text"
              className="cotizacionRapidaInlineInput"
              value={nombreDraft}
              autoFocus
              onChange={(e) => setNombreDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitNombre();
                if (e.key === "Escape") cancelNombre();
              }}
              onBlur={commitNombre}
            />
          )
        ) : (
          <div
            className="cotizacionRapidaSimNombre"
            onDoubleClick={openEditNombre}
            title="Doble clic para editar nombre"
          >
            {row.nombre}
            <span className="cotizacionRapidaSimTag">simulación</span>
          </div>
        )}
        {row.detalle ? (
          <div className="cotizacionRapidaDesc2">{row.detalle}</div>
        ) : null}
      </td>
      <td>
        {editPrecio ? (
          <input
            type="text"
            inputMode="numeric"
            className="cotizacionRapidaInlineInput cotizacionRapidaInlineInput--precio"
            value={precioDraft}
            autoFocus
            onChange={(e) => {
              if (/^\d*\.?\d*$/.test(e.target.value))
                setPrecioDraft(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitPrecio();
              if (e.key === "Escape") cancelPrecio();
            }}
            onBlur={commitPrecio}
          />
        ) : (
          <span
            className="cotizacionRapidaSimPrecio"
            onDoubleClick={openEditPrecio}
            title="Doble clic para editar precio"
          >
            {fmt(row.unitPrice)} COP
          </span>
        )}
      </td>
      <td>
        <CantidadEditable
          className="cotizacionRapidaQty"
          value={row.cantidad}
          onCommit={(n) => updateLineCantidad(row.lineId, n)}
        />
      </td>
      <td>{fmt(row.subtotal)}</td>
      <td>
        <button
          type="button"
          className="cotizacionRapidaLinkDanger"
          onClick={() => removeLine(row.lineId)}
        >
          Quitar
        </button>
      </td>
    </tr>
  );
}
