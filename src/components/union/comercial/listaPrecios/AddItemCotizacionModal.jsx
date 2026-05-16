import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCotizacionRapida } from "./cotizacionRapidaContext";
import CantidadEditable from "./CantidadEditable";

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { currency: "COP" }).format(
    Number(n || 0).toFixed(0)
  );

export default function AddItemCotizacionModal() {
  const { addModalPayload, closeAddItemModal, addOrMergeLine } =
    useCotizacionRapida();

  const [priceType, setPriceType] = useState("final");
  const [cantidad, setCantidad] = useState(1);
  const cantidadRef = useRef(null);

  useEffect(() => {
    if (addModalPayload) {
      setPriceType("final");
      setCantidad(1);
    }
  }, [addModalPayload]);

  if (!addModalPayload) return null;

  const {
    tipo,
    refId,
    codigo,
    nombre,
    detalle,
    extensionNombre,
    precioFinal,
    precioDistribuidor,
    isSimulacion,
  } = addModalPayload;

  const unit =
    priceType === "final" ? Number(precioFinal) : Number(precioDistribuidor);

  const handleAgregar = () => {
    const raw = cantidadRef.current?.value;
    const parsed =
      raw !== undefined && raw !== null && String(raw).trim() !== ""
        ? parseInt(String(raw), 10)
        : NaN;
    const fromInput = Number.isFinite(parsed) ? parsed : cantidad;
    const n = Math.max(1, fromInput || 1);
    setCantidad(n);
    addOrMergeLine({
      tipo,
      refId,
      codigo,
      nombre,
      detalle,
      extensionNombre,
      priceType,
      unitPrice: unit,
      cantidad: n,
      isSimulacion: isSimulacion ?? false,
    });
    closeAddItemModal();
  };

  return createPortal(
    <div className="modal cotizacionRapidaOverlay">
      <div
        className="hiddenModal"
        onClick={closeAddItemModal}
        role="presentation"
      />
      <div className="containerModal cotizacionRapidaSheet cotizacionRapidaSheet--sm">
        <div className="cotizacionRapidaSheetHeader">
          <div>
            <h2>Agregar a cotización rápida</h2>
          </div>
          <button
            type="button"
            className="cotizacionRapidaBtnIcon"
            onClick={closeAddItemModal}
          >
            ✕
          </button>
        </div>

        <div className="cotizacionRapidaBody">
          <p className="cotizacionRapidaIntro">
            <strong>{nombre}</strong>
            {codigo ? (
              <span className="cotizacionRapidaMuted"> · Ref. {codigo}</span>
            ) : null}
          </p>
          {detalle ? (
            <p className="cotizacionRapidaDetalle">{detalle}</p>
          ) : null}

          <div className="cotizacionRapidaField">
            <span>Tipo de precio</span>
            <div className="cotizacionRapidaRadios">
              <label>
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === "final"}
                  onChange={() => setPriceType("final")}
                />
                Final · {fmt(precioFinal)} COP
              </label>
              <label>
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === "distribuidor"}
                  onChange={() => setPriceType("distribuidor")}
                />
                Distribuidor · {fmt(precioDistribuidor)} COP
              </label>
            </div>
          </div>

          <div className="cotizacionRapidaField">
            <label htmlFor="cqty-add">Cantidad</label>
            <CantidadEditable
              ref={cantidadRef}
              id="cqty-add"
              className="cotizacionRapidaQty"
              value={cantidad}
              onCommit={setCantidad}
            />
          </div>
        </div>

        <div className="cotizacionRapidaActions">
          <button
            type="button"
            className="cotizacionRapidaBtn"
            onClick={closeAddItemModal}
          >
            <span>Cancelar</span>
          </button>
          <button
            type="button"
            className="cotizacionRapidaBtn cotizacionRapidaBtnPrimary"
            onClick={handleAgregar}
          >
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
