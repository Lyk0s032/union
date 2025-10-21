import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import * as actions from "../../../../../store/action/action";

export default function UxCotizadorPanel({ ref }) {
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();

  const req = useSelector((store) => store.requisicion);
  const { cotizacionesCompras } = req;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBoton, setLoadingBoton] = useState(false);
  const [loadingRemove, setLoadinRemove] = useState(null);
  const [agrupado, setAgrupado] = useState(true);
  const searchCoti = async (coti, carga) => {
    setLoading(carga ?? true);
    try {
      const res = await axios.get(`/api/requisicion/get/get/cotizacion/${coti}`);
      setData(res.data);
      console.log("COTI DATA:", res.data);
    } catch (err) { 
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    if(!id) return;
    setLoadinRemove(id)
    const send = await axios.get(`/api/requisicion/remove/cotizacionItemCompras/${id}`)
    .then((res) => {
      searchCoti(data.id, false)
      return res;
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      setLoadinRemove(false)
    })
    return send;
  }

  // Build projects list from multiple possible sources (top-level, item.requisicion object, or item.requisicionId)
  const proyectos = React.useMemo(() => {
    if (!data) return [];

    const sources = [];

    // 1) prefer top-level array if provided
    if (Array.isArray(data.requisiciones) && data.requisiciones.length) {
      data.requisiciones.forEach((r) => {
        if (r && r.id) sources.push({ id: r.id, nombre: r.nombre ?? `Proyecto ${r.id}` });
      });
    }

    // 2) from item.requisicion objects
    if (Array.isArray(data.comprasCotizacionItems)) {
      data.comprasCotizacionItems.forEach((it) => {
        if (it.requisicion && it.requisicion.id) {
          sources.push({ id: it.requisicion.id, nombre: it.requisicion.nombre ?? `Proyecto ${it.requisicion.id}` });
        } else if (it.requisicionId) {
          // We'll add a placeholder name (can be replaced if top-level has more data)
          sources.push({ id: it.requisicionId, nombre: `Proyecto ${it.requisicionId}` });
        }
      });
    }

    // Unique by id (keep first occurrence's nombre)
    const map = new Map();
    sources.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });

    return Array.from(map.values());
  }, [data]);

  // Approve / send to financiero
  const sendToFinanciero = async () => {
    if (!data?.id) return;
    setLoadingBoton(true);
    try {
      const res = await axios.get(`/api/requisicion/get/update/cotizacion/${data.id}`);
      dispatch(actions.HandleAlerta("Cotización aprobada", "positive"));
      await searchCoti(data.id, false);
      return res;
    } catch (err) {
      console.error(err);
      dispatch(actions.HandleAlerta("No hemos logrado aprobar esto", "mistake"));
      return null;
    } finally {
      setLoadingBoton(false);
    }
  };

  // Helper para formatear COP
  const fmt = (v) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP",  minimumFractionDigits: 0,
  maximumFractionDigits: 0 }).format(Number(v || 0));

    // Agrupado robusto: por materiaId si existe, si no por productoId, si no por item.id
    const grupos = React.useMemo(() => {
    if (!data?.comprasCotizacionItems?.length) return [];

    const acc = [];

    data.comprasCotizacionItems.forEach((item) => {
      // normalizo ids posibles
      const materiaId = item.materiaId ?? item.materiumId ?? null;
      const productoId = item.productoId ?? item.productoCotizacionId ?? item.productoCotizacion_id ?? null;

      let key;
      if (materiaId != null) key = `M-${materiaId}`;
      else if (productoId != null) key = `P-${productoId}`;
      else key = `I-${item.id}`; // fallback único por item

      const exist = acc.find((g) => g.key === key);
      if (exist) {
        exist.items.push(item);
      } else {
        acc.push({
          key,
          materiaId: materiaId,
          productoId: productoId,
          items: [item],
        });
      }
    });

    return acc;
  }, [data]);

  useEffect(() => {
      if(params.get('c')){
        searchCoti(params.get('c'), true) 
      }
  }, [params.get('c')])

const isOpen = useMemo(() => params.get("facture"), [params]);

useEffect(() => {

  if (!isOpen) return;

  const handleKeyDown = (e) => { 
    if (e.key === "Escape") {
      const newParams = new URLSearchParams(params.toString());
      newParams.delete("c");
      newParams.delete("facture");
      setParams(newParams); // 👈 aquí sincronizas bien
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isOpen, params, setParams]);
  return (
    <div className="factura" ref={ref} style={{ zIndex: 7 }}>
      <div className="facturaBox"><br />
        {/* <button
          onClick={() => {
            params.delete("facture");
            setParams(params);
          }}
        >
          x
        </button> */}

        <div className="containerFactura">
          <div className="horizontalCotizacions">
            {cotizacionesCompras?.map((coti, i) => (
              <div className={params.get('c') == coti.id ? `itemCotizacion Active` : 'itemCotizacion'} key={i + 1} 
              onClick={() => {
                params.set('orden', coti.id)
                setParams(params);
              }}>
                <div className="containerItemCotizacion">
                  <div className="Number">
                    <h3>{coti.id}</h3>
                  </div>
                  <div className="dataCotizacionBody">
                    <h3>{coti.name}</h3>
                    <span>{coti.proveedor?.nombre}</span><br />

                    <strong>{!coti.estadoPago ? 'Cotización' : coti.estadoPago}</strong>
                  </div>
                </div>
                
              </div>
            ))}
          </div>

          <div className="boxAll">
            {!data && loading ? (
              <h1>Cargando</h1>
            ) : data === "notrequest" || data === 404 ? (
              <h1>No hemos logrado cargar esto.</h1>
            ) : !data ?(
              <div className="boxMessage">
                <h1>Selecciona una cotización</h1>
              </div>
            ) :(
              <div className="itemsTable">
                {
                  agrupado ? 
                  <button onClick={() => setAgrupado(false)}>
                    <span>Ver al detalle</span>
                  </button>
                  : 
                  <button onClick={() => setAgrupado(true)}>
                    <span>Agrupar</span>
                  </button>
                }
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Total</th>
                      {proyectos.map((proj) => (
                        <th key={proj.id}>{proj.nombre}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                  {agrupado
                    ? grupos.map((grupo, i) => {
                        const totalCantidad = grupo.items.reduce((s, it) => s + Number(it.cantidad || 0), 0);
                        const totalPrecio = grupo.items.reduce((s, it) => s + Number(it.precioTotal || 0), 0);

                        const sample = grupo.items[0] || {};
                        
                        const nombre =
                          sample.materium?.description ||
                          sample.materium?.description ||
                          sample.producto?.nombre ||
                          (grupo.materiaId
                            ? `Materia -  ${grupo} ${console.log(grupo)}`
                            : grupo.productoId
                            ? `Producto ${grupo.productoId}`
                            : `Item ${sample.id}`);

                        return (
                          <tr key={i + 1}>{console.log(sample)}
                            <td className="large">{sample.materium?.id} - {nombre}</td>
                            <td className="short">{totalCantidad}</td>
                            <td className="short">{fmt(grupo.items[0]?.precioUnidad || 0)}</td>
                            <td className="short">{fmt(totalPrecio)}</td>

                            {proyectos.map((proj) => {
                              const itemProyecto = grupo.items.find(
                                (it) =>
                                  (it.requisicionId && Number(it.requisicionId) === Number(proj.id)) ||
                                  (it.requisicion && it.requisicion.id === proj.id)
                              );
                              return (
                                <td key={proj.id} className="short">
                                  {itemProyecto ? itemProyecto.cantidad : 0}
                                </td>
                              );
                            })}

                            <td className="short">
                              
                            </td>
                          </tr>
                        );
                      })
                    : data.comprasCotizacionItems.map((item, i) => (
                        <tr key={i + 1}>
                          <td className="large">{console.log(item)}
                            {item.materium?.id} - {item.materium?.description} 
                            {item.producto?.id} - {item.producto?.description} 

                          </td>
                          <td className="short">{item.cantidad}</td>
                          <td className="short">{fmt(item.precioUnidad || 0)}</td>
                          <td className="short">{fmt(item.precioTotal || 0)}</td>

                          {proyectos.map((proj) => (
                            <td key={proj.id} className="short">
                              {(item.requisicionId && Number(item.requisicionId) === Number(proj.id)) ||
                              (item.requisicion && item.requisicion.id === proj.id)
                                ? item.cantidad
                                : 0}
                            </td>
                          ))}

                          <td className="short">
                            {
                              loadingRemove == item.id?
                                <span>Eliminando...</span>
                              :
                              <button
                                onClick={() => {
                                  if(!loadingRemove){
                                    removeItem(item.id)
                                  }
                                }}
                              >
                                x
                              </button>
                            }
                          </td>
                        </tr>
                      ))}
                  </tbody>

                </table>

                {/* total simple (suma de todos los precioTotal) */}
                <table className="Topcito">
                  <thead>
                    <tr>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="short">
                        {fmt(
                          data.comprasCotizacionItems?.reduce((s, it) => s + Number(it.precioTotal || 0), 0) || 0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {data.estadoPago === "comprado" ? (
                  <button>
                    <span>Analizar</span>
                  </button>
                ) : data.estadoPago === "compras" ? (
                  <button>
                    <span>Analizar</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!loadingBoton) sendToFinanciero();
                    }}
                  >
                    <span>{loadingBoton ? "Generando orden de compra" : "Enviar orden de compra"}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
