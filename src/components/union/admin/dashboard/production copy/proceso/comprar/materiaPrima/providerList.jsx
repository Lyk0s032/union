import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español

dayjs.extend(localizedFormat);
dayjs.locale("es");

export default function ListProvider({ item }) {
  const [params, setParams] = useSearchParams();
  const [choose, setChosee] = useState(false);
  const [howMany, setHowMany] = useState(0);
  const [newCotiName, setNewCotiName] = useState(""); // 🔹 nombre cotización nueva
  const [proveedor, setProveedor] = useState(null);
  const [creating, setCreating] = useState(false); 
  const req = useSelector(store => store.requisicion);
  const { ids, itemsCotizacions } = req; // 🔹 usamos también proyectos (ids)

  const dispatch = useDispatch();

  const totalCantidad = item.itemRequisicions.reduce((acc, it) => acc + Number(it.cantidad), 0);
  const cantidadEntregada = item.itemRequisicions.reduce((acc, it) => acc + Number(it.cantidadEntrega), 0);

  const [it, setIt] = useState(null);
  const getHowMany = () => {
    let validacion = itemsCotizacions.filter((it) => it.materiumId === item.id);
    setIt(validacion[0]);
    if (validacion.length > 0) {
      let a = validacion.reduce((acc, it) => acc + Number(it.cantidad), 0);
      setHowMany(a);
    }
  };

  const [forCotizacion, setForCotizacion] = useState(null);

  const changeCotizacionFor = (c) => {
    if (c.id == forCotizacion || c.id == forCotizacion?.id) {
      setForCotizacion(null);
    } else {
      setForCotizacion(c);
    }
  };

  const proveedoresIds = item.prices?.map(p => p.proveedorId);

  const cargaProyectos = async () => {
      const body = {
          ids
      }
      const getData = await axios.post('/api/requisicion/get/req/multipleReal/', body)
        .then((res) => {
            return res.data
        })
        .then((res) => {
            dispatch(actions.getProyectos(res.proyectos))
            dispatch(actions.getMaterias(res.consolidado))
        })
        .then(async (result) => {
            let body = {
                proyectos: ids
            }
            const getData = await axios.post('/api/requisicion/post/get/cotizaciones/', body)
            .then((res) => {
                dispatch(actions.getCotizacionesCompras(res.data))

            })

            return getData;
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado analizar esto', 'mistake'))
        })
        return getData; 
  }

  const addItemEstado = (cantidad, requisicionId) => {
    let objeto = {
      materiumId: item.id,
      requisicionId: requisicionId,
      cantidad
    }
    dispatch(actions.getItemsForCotizacion(objeto))
  }

  const addAll = () => {
    item.itemRequisicions?.map((it) => {
      let necesario = Number(it.cantidad) - Number(it.cantidadEntrega)
      if (necesario <= Number(it.cantidad)) {
        addItemEstado(necesario, it.requisicionId)
      }
    })
  }
 
  // 🔹 Función para crear cotización nueva
const createNewCotizacion = async () => {
  if (!proveedor || !newCotiName.trim()) return;
  setCreating(true)
  let cotizacionObj = {
    proveedorId: proveedor.id,
    name: newCotiName,
    description: "Cotización generada desde ListProvider",
    proyectos: ids,
    items: itemsCotizacions
      .filter((it) => it.materiumId === item.id)
      .map((it) => {
        // Buscamos el precio de este proveedor para la materia
        let priceMatch = item.prices.find(
          (p) => p.proveedorId === proveedor.id && p.materiumId === it.materiumId
        );

        return {
          materiaId: it.materiumId,
          productoId: it.productoId || null,
          cantidad: it.cantidad,
          requisicion: it.requisicionId,
          precioUnidad: priceMatch ? Number(priceMatch.valor) : null,
          precioTotal: priceMatch ? Number(priceMatch.valor) * Number(it.cantidad) : null,
        };
      }),
  };

  let body = { datos: [cotizacionObj] };

  try {
    const res = await axios.post("/api/requisicion/post/generar/cotizacion/somemuch", body)
    .then(async (res) => {
      await cargaProyectos()
      return res;
    })
    .then((res) => {
      console.log(res)
      dispatch(actions.HandleAlerta("Cotización creada con éxito", "positive"));
      setNewCotiName("");
      params.set("facture", "show");
      params.set("c", res.data.id);
      setParams(params);
    })
    .finally(() => setCreating(false))
    
  } catch (err) {
    console.error(err);
    dispatch(actions.HandleAlerta("Error al crear la cotización", "mistake"));
  }
};

// Agregar item a una cotización
const addItemsToCotizacion = async () => {
  if (!forCotizacion || !itemsCotizacions.length) return;

  // Armamos los items igual que antes
  let items = itemsCotizacions
    .filter((it) => it.materiumId === item.id)
    .map((it) => {
      let priceMatch = item.prices.find(
        (p) => p.proveedorId === proveedor.id && p.materiumId === it.materiumId
      );

      return {
        materiaId: it.materiumId,
        productoId: it.productoId || null,
        cantidad: it.cantidad,
        requisicion: it.requisicionId,
        precioUnidad: priceMatch ? Number(priceMatch.valor) : null,
        precioTotal: priceMatch ? Number(priceMatch.valor) * Number(it.cantidad) : null,
      };
    });

  let body = {
    cotizacionId: forCotizacion.id,
    proyectos: ids,   // los proyectos seleccionados
    items
  };

  try { 
    console.log(body)
    const res = await axios.post("/api/requisicion/post/generar/add/cotizacion/addItem", body)
    .then(async (res) => {
      await cargaProyectos()
    })
    dispatch(actions.HandleAlerta("Items agregados con éxito", "positive"));
    return res;
  } catch (err) {
    console.error(err);
    dispatch(actions.HandleAlerta("Error al agregar los items", "mistake"));
  }
};


  useEffect(() => {
    dispatch(actions.getProveedoresArrays(proveedoresIds))
    getHowMany()
  }, [itemsCotizacions, item]);

  return (
    <div className="listProvider">
      {
        !choose ?
          <div className="containerList">
            <div className="titleThis">
                <span>Cantidades </span>
            </div>
            <div className="howMany"> 
                <div className="inputDiv">
                    <h4>{howMany}</h4>
                    <h3> / </h3>

                    <h3 onDoubleClick={() => {
                        // setHowMany(max)
                        addAll()
                    }}> {Number(totalCantidad - cantidadEntregada)} </h3>
                </div>
            </div>
            {/* Lista de proveedores */}
            <div className="resultProviders">
              <div className="containerResultsProviders">
                {
                  item.prices?.map((price, i) => {
                    return (
                      <div onDoubleClick={() => {
                        setChosee(true)
                        setProveedor(price.proveedor)
                      }}
                        className="itemProvider"
                        key={i + 1}
                        onClick={() => {
                          params.set('PV', 'analisis');
                          setParams(params)
                        }}>
                        <div className="letter">
                          <h3>{price.proveedor.nombre.split('')[0]}</h3>
                        </div>
                        <div className="downData">
                          <h3>{price.proveedor.nombre}</h3>
                          <h1>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(price.valor).toFixed(0))} </h1>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          :
          <div className="containerList">
            <div className="buttonBefores">
              <button onClick={() => {
                setChosee(null)
                setProveedor(null)
              }}>
                <span>Volver</span>
              </button>
            </div>
            <div className="pricesItemHowMany">
              <div className="containerPrice">
                <span>Precio</span>
                <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(proveedor?.prices[0].valor).toFixed(0))} x {howMany}</h3>
              </div>
              <div className="total">
                <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(proveedor?.prices[0].valor * howMany).toFixed(0))}</h3>
              </div>
            </div>
            <div className="itemListaDeCotizaciones">
              <div className="itemCoti">
                { proveedor?.comprasCotizacions?.map((coti, i) => { 
                    let fechaCreacion = dayjs(coti.createdAt).format("D [de] MMMM YYYY, h:mm A");
                    console.log(coti)
                  return (
                  <div className="oneItem" key={i+1}>
                      <div className="divideOne" onClick={() => {
                          setForCotizacion(coti)
                        }}>
                        <div className="number">
                          <h3>{coti.id}</h3>
                        </div>
                        <div className="titleOne" >
                          <h3 >{coti.name}</h3>
                          <span>{fechaCreacion}</span>
                        </div>
                      </div>
                      <div className="optionsButton">
                        <button className="see" onClick={() => {
                            params.set('facture', 'show')
                            params.set('c', coti.id)
                            setParams(params);
                        }}>
                          <span>ver cotización</span>
                        </button>
                        {
                          forCotizacion?.id == coti.id ? 
                            <button onClick={() => {
                              addItemsToCotizacion(coti.id)
                            }} className="give">
                              <span>Asignar</span>
                            </button>
                          :null
                        }
                      </div>
                    </div>
                ) })}
              </div>
            </div>
            <div className="divideZone"></div>
            <div className="titleThis">
              <span>Nueva cotización para {proveedor?.nombre}</span>
            </div>

            <div className="cotizacionesIt">
              <div className="new">
                <label htmlFor="">Nombre cotización</label><br />
                <input
                  type="text"
                  value={newCotiName}
                  onChange={(e) => {
                    if(!creating){
                      setNewCotiName(e.target.value)
                    }
                  }}
                  placeholder="Escribe aquí"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      !creating ? createNewCotizacion() : null
                    }
                  }}
                /><br />
                <button onClick={() => {
                  !creating ? createNewCotizacion() : null
                }}>
                  <span>{creating ? 'Creando...' : 'Crear cotización'} </span>
                </button>
              </div>
            </div>
          </div>
      }
    </div>
  )
}
