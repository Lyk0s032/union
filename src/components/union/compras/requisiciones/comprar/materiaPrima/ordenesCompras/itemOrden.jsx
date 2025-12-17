import React, { act, useState } from 'react';
import * as actions from './../../../../../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function ItemOrden({ item }){
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

    const [update, setUpdate] = useState(false);
    const [form, setForm] = useState({
        descuento: item.descuento,
        precio: item.precioTotal
    })
    const [loading, setLoading] = useState(false);

    const eliminarItemComprasCotizacion = async () => {
        // 1 Construimos el body
        const body = {
            itemId: item.materiumId ? item.materiumId : item.productoId,
            tipo: !item.materiumId ? 'producto' : 'materia' ,
            comprasId: item.comprasCotizacionId
        };

        try {
            // 2 Enviamos el DELETE con body
            const send = await axios.post('/api/requisicion/delete/remove/compras/item', body);
            dispatch(actions.HandleAlerta('Item removido', 'positive'))
            dispatch(actions.axiosToGetOrdenComprasAdmin(false, params.get('orden')))
            return send; 
            // 👉 aquí puedes actualizar el state o volver a consultar datos
        } catch (error) {
            console.error(error);
            dispatch(actions.HandleAlerta('No hemos logrado eliminar esto', 'mistake'))
        }
    };

    const updatePrices = async () => {
        try{    
            // Si no hay precio. Envia mensaje
            if(!form.precio) return dispatch(actions.HandleAlerta('Debes ingresar un valor', 'mistake'))
            // Si el precio y el descuento son iguales. Envia.
            if(form.precio == item.precioTotal && form.descuento == item.descuento) return dispatch(actions.HandleAlerta('Necesitas cambiar los valores', 'mistake'))
            // Caso contrario avanzamos
            setLoading(true);
            let body = {
                itemId: item.id,
                price: form.precio,
                desc: form.descuento
            }
            const send = axios.post('/api/requisicion/put/update/prices/item',body)
            .then((res) => {
                dispatch(actions.HandleAlerta('Modificado', 'positive'))
                dispatch(actions.axiosToGetOrdenComprasAdmin(false, params.get('orden')))
                setUpdate(false)
            })
            .finally(() => { setLoading(false )})
        }catch(err){
            dispatch(actions.HandleAlerta('No hemos logrado actualizar esto', 'mistake'))
            setLoading(false)
        }
    }
    console.log('itemm', item)

    const [remove, setRemove] = useState(false);
    return (
        !update && !remove ?
            <div className={`itemCompra ${open ? "open" : ""}`} onContextMenu={(e) => {
                e.preventDefault();
                setRemove(true)
            }}>
                <div className="containerItemCompra"  onClick={() => setOpen(!open)}>
                    <div className="divideItem">
                        <div className="letter"> 
                            <h3>{item.materium?.id} {item.producto?.id}</h3>
                        </div>
                        <div className="dataItemOrden">
                            <h3>{item.materium?.description} {item.producto?.item}</h3>
                            <span>{item.createdAt.split('T')[0]}</span>
                            <br />
                            <span>Precio</span>
                            <h4>{item.precio}</h4>
                        </div>
                    </div>
                    <div className="price">
                        <span>Cantidad total</span><br />
                        <h3>{item.cantidad}</h3>
                    </div>
                    <div className="price" onDoubleClick={() => setUpdate(true)}>
                        <span>Descuento</span>
                        <h3>{item.descuento}</h3>
                    </div>
                    <div className="price"  onDoubleClick={() => setUpdate(true)}>
                        <span>Precio total</span>
                        <h3>{item.precioTotal}</h3>
                    </div>
                </div> 
                <div className="hiddenContainer">
                    <div className="containerHidden">
                        {
                            item?.itemToProjects?.map((it, i) => {
                                return (
                                    <div className="itemProjectoH" key={i+1}>
                                        <div className="divideThat">
                                            <div className="pr">
                                                <span>Cotización número: {it.requisicion?.cotizacionId}</span>
                                                <h3>{it.requisicion?.nombre}</h3>
                                            </div>
                                            <div className="how">
                                                <span>Cantidad: <strong>{it.cantidad}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        
                        
                    </div>
                </div>
            </div>
        :
        remove ? 
             <div className={`itemCompra ${open ? "open" : ""}`} >
                <div className="containerItemCompra"  onClick={() => setOpen(!open)}>
                    <div className="divideItem">
                        <div className="letter"> 
                            <h3>{item.materium?.id} {item.producto?.id}</h3>
                        </div>
                        <div className="dataItemOrden">
                            <h3>{item.materium?.description} {item.producto?.item}</h3>
                        </div>
                    </div>
                    <div className="price">
                        <span>Pregunta</span><br />
                        <h3>¿Desea eliminar?</h3>
                    </div>
                    <div className="price">
                        <span></span>
                        <button onClick={() => eliminarItemComprasCotizacion()}
                            style={{width:100, padding:5,backgroundColor: 'green', border:'1px solid green', borderRadius:5}}>
                            <span style={{color: 'white'}}>Eliminar</span>
                        </button>
                    </div>
                    <div className="price" onDoubleClick={() => setUpdate(true)}>
                        <span></span>
                        <button onClick={() => setRemove(false)}
                             style={{width:100, padding:5,backgroundColor: 'red', border:'1px solid red', borderRadius:5}}>
                            <span style={{color: 'white'}}>Cancelar</span>
                        </button>
                    </div>
                </div>
            </div>           
        :        
            <div className={`itemCompra ${open ? "open" : ""}`} onContextMenu={(e) => {
                e.preventDefault();
                setRemove(true)
            }}>
                <div className="containerItemCompra"  onClick={() => setOpen(!open)}>
                    <div className="divideItem">
                        <div className="letter"> 
                            <h3>{item.materium?.id} {item.producto?.id}</h3>
                        </div>
                        <div className="dataItemOrden">
                            <h3>{item.materium?.description} {item.producto?.item}</h3>
                            
                        </div>
                    </div>
                    <div className="price">
                        <span>Cantidad</span><br />
                        <h3>{item.cantidad}</h3>
                    </div>
                    <div className="price" onDoubleClick={() => setUpdate(true)}>
                        <span>Descuento</span>
                        <input type="text" style={{width:100}} onChange={(e) => {
                            setForm({
                                ...form,
                                descuento: e.target.value
                            })
                        }} value={form.descuento}  />
                    </div>
                    <div className="price"  onDoubleClick={() => setUpdate(true)}>
                        <span>Precio total</span>
                        <input type="text"  style={{width:100}} onChange={(e) => {
                            setForm({
                                ...form,
                                precio: e.target.value
                            })
                        }} value={form.precio} />
                    </div>
                    <div className="price"  onDoubleClick={() => setUpdate(true)}>
                        <span>Precio total</span><br />
                        {
                            loading ? <span>Editando...</span>
                            :
                            <>
                                <button onClick={() => updatePrices()}>
                                    <span>Guardar</span>
                                </button>
                                <button onClick={() => setUpdate(false)}>
                                    <span>Cancelar</span>
                                </button>
                            </>
                        }
                    </div>
                </div>

            </div>
    )
}