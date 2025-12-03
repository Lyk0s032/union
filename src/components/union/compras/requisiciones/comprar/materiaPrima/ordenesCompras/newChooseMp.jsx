import React, { useEffect, useRef, useState } from 'react';
import ItemOrden from './itemOrden';
import SeleccionadorItems from './modalChoose/addItemToOrdenCompras';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../../store/action/action';
import axios from 'axios';
import { MdEditNote, MdOutlineClose, MdOutlineSave } from 'react-icons/md';

export default function NewChooseMp({ productosTotal, provider, title }){
    const req = useSelector(store => store.requisicion);
    const { ordenCompra, loadingOrdenCompra } = req;

    console.log('proyectoos, ', productosTotal)

    const total =  ordenCompra?.comprasCotizacionItems?.reduce((acc, it) => acc + Number(it.precioTotal), 0);
    
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const sendToFinanciero = async () => {
        if (!ordenCompra?.id) return;
            setLoading(true);
        try {
            const res = await axios.get(`/api/requisicion/get/update/cotizacion/${ordenCompra.id}`)
             dispatch(actions.axiosToGetOrdenComprasAdmin(false, ordenCompra.id))
            dispatch(actions.HandleAlerta("Cotización aprobada", "positive"));
            return res;
        } catch (err) {
            console.error(err);
            dispatch(actions.HandleAlerta("No hemos logrado aprobar esto", "mistake"));
            return null;
        } finally {
            setLoading(false);
        }
    };
    const [addNote, setAddNote] = useState(null);
    const [note, setNote] = useState(ordenCompra?.description);

    const descriptionRef = useRef(null);
    useEffect(() => {
        if(addNote){
            descriptionRef.current.focus();

            const len = descriptionRef.current.value.length;
            descriptionRef.current.setSelectionRange(len, len);

        }
    }, [addNote])

    const updateNote = async () => {
        let body = {
            ordenId: ordenCompra.id,
            description: note
        }
        const send = axios.put('/api/requisicion/post/update/cotizaciones/one', body)
        .then((res) => {
            setAddNote(false)
            dispatch(actions.axiosToGetOrdenComprasAdmin(false, ordenCompra.id))
        })
    }
    return ( 
        <div className="newChoose">
            {
                !ordenCompra || loadingOrdenCompra ?
                    <span>Cargando...</span>
                :
                ordenCompra == 'notrequest' || ordenCompra == 404 || !ordenCompra ?
                    <span>Not found</span>
                :
                <div className="containerNewChoose">
                    <div className="topTitleData"> 
                        <h1>{ordenCompra?.name}</h1>
                        <span>Estado: {ordenCompra?.estadoPago}</span><br />
                        <span>NIT {ordenCompra?.proveedor?.nit}</span>
                        <h3>{ordenCompra?.proveedor?.nombre}</h3>


                    </div>
                    {/* <div className="searchInput">
                        <label htmlFor="">Busca tu item a comprar</label><br />
                        <input type="text" placeholder='Presiona Ctrl + B' />
                    </div> */}
                    <div className="resultsAllItems">
                        <div className="containerResultsAllItems">
                            {
                                ordenCompra?.comprasCotizacionItems?.length ?
                                    ordenCompra.comprasCotizacionItems.map((it, i) => {
                                        return (
                                            <ItemOrden item={it} key={i+1} />
                                        )
                                    })
                                : 
                                <div className="messageNotFound">
                                    <h3>No hay producto aun</h3>
                                </div>
                            }
                           
                        </div>
                        <div className="descriptionNote">
                            <div className="containerDescription">
                                <div className="titleNote">
                                    <span>Nota {addNote ? <strong>(Presiona Enter para guardar o Escape para cancelar)</strong> : <strong>(Click en la nota para editar)</strong>}</span>
                                </div>
                                <div className="descriptionNoteData">
                                    {
                                        !addNote ? 
                                             <span onClick={() => {
                                                    setAddNote(true)
                                                }
                                            }>{ordenCompra.description ? ordenCompra.description : 'No hay ninguna nota'}</span>
                                        :
                                            <div className="inputDiv">
                                                <textarea ref={descriptionRef} name="" id="" onChange={(e) => {
                                                    setNote(e.target.value)
                                                }} value={note} onBlur={() => setAddNote(false)} 
                                                onKeyDown={(e) => {
                                                    if(e.code == 'Escape'){
                                                        setAddNote(false)
                                                    }

                                                    if(e.code == 'Enter' && !e.shiftKey){
                                                        e.preventDefault()
                                                        updateNote()
                                                    }
                                                }}></textarea>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            ordenCompra?.comprasCotizacionItems?.length ?
                                <div className="resultsOptions">
                                    {
                                        ordenCompra?.estadoPago ? 
                                            <div></div>
                                        :
                                        <div className="leftAprobar">
                                            <button onClick={() => {
                                                !loading ? sendToFinanciero() : null 
                                            }}>
                                                <span>{!loading ? 'Enviar orden de compra' : 'Enviando'}</span>
                                            </button><br />
                                            <span className="simulation">Simular con otros proveedores</span>
                                        </div>
                                    }
                                    <div className="rightValors">
                                        <span>Total</span>
                                        <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(total)}</h3><br /><br />
                                    </div>
                                </div>
                            : null
                        }
                    </div>
                </div>
            }
            <SeleccionadorItems productosTotal={productosTotal}/>
        </div>
    )
}