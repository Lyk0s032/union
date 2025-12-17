import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../../../store/action/action';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ItemProjectOrden from './itemProjects';

export default function GetHowMany({ productosTotal }){
    const [choose, setChoose] = useState(false);
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { ordenCompra, ids, itemsCotizacions, itemRequisicion, loadingItemRequisicion } = req;
    const [params, setParams] = useSearchParams();
    const getChose = (item) => {
        setChoose(item);
    } 

    // Cantidades ingresadas manualmente 
    const aIngresar = itemsCotizacions.filter(i => i.materiumId == itemRequisicion.id).reduce((acc, it) => acc + Number(it.cantidad), 0);
    // Desde el sistema
    const NecesitaSistema = itemRequisicion.itemRequisicions.reduce((acc, it) => acc + Number(it.cantidad), 0);
    const ingresado = itemRequisicion.itemRequisicions.reduce((acc, it) => acc + Number(it.cantidadEntrega), 0);

    const priceCurrently = itemRequisicion ?  itemRequisicion?.prices?.find(p => p.proveedorId == ordenCompra?.proveedorId) : 0;
    const priceCurrentlyProducto = itemRequisicion ?  itemRequisicion?.productPrices?.find(p => p.proveedorId == ordenCompra?.proveedorId) : 0;
    
    // --- cambio seguro: evitar pasar un objeto a JSX ---
    const priceVal = priceCurrently ? Number(priceCurrently?.valor || 0) : 0;
    const valorKg = itemRequisicion.unidad === 'kg' && priceVal
    ? (priceVal / Number(itemRequisicion.medida || 1))
    : priceVal || 0;
        
    const unidad = itemRequisicion.unidad;
    const medidaSistema = itemRequisicion.medida; // 10.000X45.111
    const medidaLadoA = unidad == 'mt2' ? medidaSistema.split('X')[0] : null
    const medidaLadoB = unidad == 'mt2' ? medidaSistema.split('X')[1] : null
    const medidaOriginal = unidad == 'mt2' ? 
        Number(medidaLadoA) * Number(medidaLadoB)
    : medidaSistema
    
    const cantidadNecesitada = Number(Math.ceil(Number(NecesitaSistema / medidaOriginal)));

    const [contenedor, setContenedor] = useState(0)
    const [cantidad, setCantidad] = useState(0);

    let valorA = priceCurrently?.valor 
    let valorB = Number(priceCurrentlyProducto?.valor ? priceCurrentlyProducto.valor * cantidad : 0)

    const [total, setTotal] = useState(
        priceCurrentlyProducto ? 
            (valorB * cantidad) 
        : 
        itemRequisicion.unidad == 'kg' ? 
            (valorKg * cantidad)
        : 
            (valorA * cantidad) 
    )
    const [descuento, setDescuento] = useState(0);
    const [loading, setLoading] = useState(false);

    const changeHowMany = (cantidad) => {
        setCantidad(cantidad)
        setContenedor(medidaOriginal * cantidad)
    }

    const giveToProject = () => {
        setContenedor(contenedor - aIngresar)
    }

    const givePrice = () => {
        if(priceCurrentlyProducto){
            setTotal(priceCurrentlyProducto?.valor * cantidad)
        }else if(itemRequisicion.unidad == 'kg'){
            setTotal(valorKg * cantidad)
        }else{
            setTotal(priceCurrently?.valor * cantidad)

        }
    }
  
    
    // FILTRAR MEDIDA
    console.log('item a renderenziar', itemRequisicion)
    console.log('productoso', productosTotal)
    const productoFilter = productosTotal?.find(i => i.id == itemRequisicion.id)
    console.log('producto ya filtrado', productoFilter)
    const toProjects = itemsCotizacions.filter(i => i.materiumId == itemRequisicion.id);

    // AddItemToOrden
    const addItemToOrden = async () => {
        if(!cantidad || !total) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'));
        // Caso contrario, avanzamos
        let precioUnidad = total / cantidad;
        let totalFunction = total;
        let descuentoFunction = descuento;
        let final = totalFunction - descuentoFunction;

        let body = {
            cantidad,
            cotizacionId: params.get('orden'),
            precioUnidad: precioUnidad,
            precio: totalFunction,
            descuento:descuentoFunction,
            precioTotal: final, 
            productoId: priceCurrentlyProducto ? itemRequisicion.id : null,
            ordenCompraId: ordenCompra.id,
            materiaId: priceCurrently ? itemRequisicion.id : null,
            proyectos: toProjects
        }    
        setLoading(true)
        const send = await axios.post('/api/requisicion/post/add/comprasCotizacion/item/add', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Anexado', 'positive'))
            dispatch(actions.axiosToGetOrdenComprasAdmin(false, params.get('orden')))
            dispatch(actions.getItemRequisicion(null))
        })
        .finally(() => {
            setLoading(false)
            dispatch(actions.getItemRequisicion(null))

        })
    }
 
    const open = (id) => {
        dispatch(actions.gettingItemRequisicion(true))
        let body = {
            mpId: itemRequisicion.id,
            ids: ids
        }
        const send = axios.post('/api/requisicion/get/materiales/materia/', body)
        .then((res) => {
            dispatch(actions.getItemRequisicion(res.data));
        }).catch(err => {
            console.log(err);
            dispatch(actions.getItemRequisicion(404));
        })

        return send
    }
    // UPDATE PRICE
    const [valor, setValor] = useState()
    const updatePrice = async (proveedor) => {

        if(!valor) return dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        if(valor == priceCurrently) return dispatch(actions.HandleAlerta('Debes ingresar un valor diferente'))
       // Caso contrario, enviamos consulta
        let iva = valor * 0.19;
        let total = Number(Number(valor) + Number(iva)).toFixed(0); 
        const body = { 
            mtId: itemRequisicion.id,
            pvId: ordenCompra.proveedor.id,
            price:total ,
            iva,
            descuentos: valor,
        }
        const sendPetion = await axios.post('/api/mt/price/give', body)
        .then((res) => {
            dispatch(actions.HandleAlerta("Valor actualizado con éxito", 'positive'))
            open(1)
            
            return res;
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        })
        return sendPetion;
    }

    const updatePriceProducto = async (proveedor) => {
        if(!valor) return dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        if(valor == priceCurrentlyProducto) return dispatch(actions.HandleAlerta('Debes ingresar un valor diferente'))
       // Caso contrario, enviamos consulta
        let iva = valor * 0.19;
        let total = Number(Number(valor) + Number(iva)).toFixed(0); 
        const body = { 
            productoId: itemRequisicion.id,
            pvId: proveedor.id,
            price:total ,
            iva,
            descuentos: valor,
        }
        const sendPetion = await axios.post('/api/mt/price/pt/give', body)
        .then((res) => { 
            dispatch(actions.HandleAlerta("Valor actualizado con éxito", 'positive'))
            open(1)
            return res;
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        })
        return sendPetion;
    }
    useEffect(() => {
        changeHowMany(cantidad)
        giveToProject()
    }, [cantidad, aIngresar, itemsCotizacions])

    useEffect(() => {
        givePrice()
    }, [cantidad])
    return (
        <div className="containerDatarLeftSeleccionar">
            <button onClick={() => {
                dispatch(actions.getItemRequisicion(null))
                
            }}>
                x
            </button>
           <div className="topTitleProduct">

               <div className="divideContainer">
                    <div className="dataItem">
                        <div className="divideInformationItem">
                            <div className="circle">
                                <h3>{itemRequisicion?.id}</h3>
                            </div>  
                            <div className="dataName">
                                <h3>{itemRequisicion?.description} - {valorKg}</h3>
                                <span>Medida original:</span><br /> 
                                <strong>{itemRequisicion?.medida} {itemRequisicion?.unidad} -- Cotizacion: {productoFilter?.productoCotizacion[0]?.medida}</strong><br /><br /><br />

                                <span>Precio actual</span>
                                <h1>$ {priceCurrently?.valor}  {priceCurrentlyProducto?.valor}</h1> 
                                <span>{priceCurrently?.createdAt.split('T')[0]} {priceCurrentlyProducto?.createdAt.split('T')[0]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="providerItem">
                       <div className="containerProvider">
                            <div className="DataProvider">
                                <h3>{ordenCompra?.proveedor?.nombre}</h3>
                                <span>NIT {ordenCompra?.proveedor?.nit}</span><br />
                                <span>{ordenCompra?.proveedor?.email}</span><br />
                                <strong>{ordenCompra?.proveedor?.phone}</strong>
                            </div>
                            <br />
                            <div className="inputDiv">
                                <label htmlFor="">Actualizar precio</label><br /><br />
                                <input type="text" placeholder='Presiona Ctrl + P'
                                onChange={(e) => {
                                    setValor(e.target.value)
                                }} value={valor} onKeyDown={(e) => {
                                    if(e.code == 'Enter'){
                                        if(itemRequisicion.productoId){
                                            updatePriceProducto(ordenCompra.proveedor.id)
                                        }else{
                                            updatePrice(ordenCompra.proveedor.id)

                                        }
                                    }
                                }}/>
                            </div>
                       </div>
                    </div>
               </div>
           </div>
           <div className="divideZoneLine"></div>

           <div className="zoneMove">
               <div className="containerZoneMode">
                   <div className="title">
                       <span>Zona de movimientos</span>
                   </div>
                   <div className="howMany">
                       <input type="text" defaultValue={0} onChange={(e) => {
                            changeHowMany(e.target.value)
                       }}/>
                       <h3> / </h3>
                       <h1>{Number(cantidadNecesitada - ingresado).toFixed(2)}</h1>
                   </div>
               </div>
                   


               <div className="zonaProjects">
                   <div className="containerZonaProjects">
                       <div className="titleZonaProjects">
                            <span>Proyectos</span>
                       </div>
                       <div className="cantidadRepartir">
                            <span>Cantidad a Repartir</span>
                            {/* <h3>{contenedor} {itemRequisicion.unidad}</h3><br /> */}
                            <h4>+ {Number(aIngresar).toFixed(2)} {itemRequisicion.unidad}</h4>
                       </div>
                       <div className="resultLists">
                            {
                                itemRequisicion.itemRequisicions?.length ?
                                    itemRequisicion.itemRequisicions.map((it, i) => {
                                        return (
                                            <ItemProjectOrden key={i+1} dar={giveToProject} item={it} />
                                        )
                                    })
                                :null
                            }

                       </div>

                       <div className="divideZoneLine"></div>

                       <div className="pricesForm">
                            <div className="title">
                                <span>Detalles de la compra</span>
                            </div>
                            <div className="dividePrices">
                                <div className="ladePrices">
                                    <div className="inputDiv">
                                        <label htmlFor="">Precio de la compra <button>!</button></label><br />
                                        <input type="text" placeholder='Ejemplo: 250000' onChange={(e) => {
                                            setTotal(e.target.value)
                                        }} value={total} />


                                    </div>
                                    </div>
                                    <div className="ladePrices">
                                        <div className="inputDiv">
                                            <label htmlFor="">Descuento de la compra </label><br />
                                            <input type="text" placeholder='Ejemplo: 250000'
                                            onChange={(e) => {
                                                setDescuento(e.target.value)
                                            }} value={descuento} />
                                        </div>
                                    <br /><br />
                  
                                    {
                                        descuento && descuento > 0 ? 
                                            <div className="">
                                                <span style={{fontSize:12}}>Total</span>
                                                <h3>{total - descuento}</h3>
                                            </div>
                                        : null
                                    }
                                    <div className=""></div><br />
                                </div>
                            </div>
                            <div className="divideCheck">
                                <input type="checkbox" />
                                <label htmlFor="">Actualizar precio del proveedor al aprobar orden de compra <button>!</button></label>
                            </div>


                            <div className="confirm">
                                <button onClick={() => {
                                    !loading ? addItemToOrden() : null
                                }}>
                                    {
                                        loading ?
                                        <span>Ingresando...</span>
                                    :
                                        <span>Incluir a la orden compra</span>
                                    }

                                </button>
                            </div> 
                       </div>


                       <div className="divideZoneLine"></div>

                       {/* <div className="historyCompras">
                            <div className="containerHistory">
                                <div className="title">
                                    <span>Historial de compras para estos proyectos</span>
                                </div>

                                <div className="dataComprasHistory">
                                    <div className="itemDataHistory">
                                        <div className="divideZone">
                                            <div className="dataItem">
                                                <span>Nro. orden de compra: <strong>15421</strong></span>
                                                <h3>Primera cotización con Apex</h3>
                                            </div>
                                            <div className="priceData">
                                                <span>Precio</span>
                                                <h3>$ 145.000</h3>
                                            </div>
                                        </div>
                                    </div><br /><br />

                                    <div className="itemDataHistory">
                                        <div className="divideZone">
                                            <div className="dataItem">
                                                <span></span>
                                                <h3></h3>
                                            </div>
                                            <div className="priceData">
                                                <span><strong>Total comprado</strong></span>
                                                <h3>$ 145.000</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       </div> */}
                   </div>
               </div>
           </div>
        </div>
    )
}