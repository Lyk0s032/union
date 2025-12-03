import React, { useState } from 'react';
import * as actions from '../../../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function ItemProjectOrden({ item, dar }){
    console.log('item en comprar',item)
    const req = useSelector(store => store.requisicion);
    const { itemsCotizacions, itemRequisicion } = req;
    const [add, setAdd] = useState(false);
    const [how, setHow] = useState(0)
    const dispatch = useDispatch();
    const anexado = itemsCotizacions.find(i => i.materiumId == item.materiumId && i.requisicionId == item.requisicionId)
    const addItemEstado = (complete) => {
        let objeto = {
            materiumId: item.materiumId ? item.materiumId : null,
            productoId: item.productoId ? item.productoId : null,
            necesidad: Number(item.cantidad - item.cantidadEntrega), 
            requisicionId: item.requisicionId,
            cantidad: how
        }
        if(complete){
            objeto.cantidad = Number(item.cantidad - item.cantidadEntrega)
        }
        
        dispatch(actions.getItemsForCotizacion(objeto))
    }
    return (
        <div className="itemProjectZone">
            <div className="divideItemProject">
                <div className="dataPrincipal">
                    <div className="divide">
                        <div className="number">
                            <h3>{item.requisicion?.id}</h3>
                        </div>
                        <div className="dataProject">
                            <h3>{item.requisicion?.nombre}</h3>
                            <span>{item.requisicion.estado}</span>

                            {/* <div className="costo">
                                <span>Costo Aproximado</span>
                                <h3>$ 152.000</h3>
                            </div> */}
                        </div>
                    </div>
                    
                </div>
                {   
                    !add ?
                        <div className="howManyProgress">
                            <span>Actualmente</span>{console.log('itititi', item)}
                            <h3 onClick={() => setAdd(true)}>  {item.cantidadEntrega} / 
                                {Number(item.cantidad).toFixed(2)} {item.materium?.unidad} {anexado ? `+ ${anexado.cantidad}` : null}</h3>
                        </div> 
                    :
                    <div className="howManyProgress">
                        <span>Actualmente</span>
                        <input type="text" onChange={(e) => {
                            setHow(e.target.value)
                        }} onBlur={() => setAdd(false)} onKeyDown={(e) => {
                            if(e.code == 'Enter'){
                                addItemEstado()
                                setAdd(false)
                            }
                        }}/>
                        <h3>/ {Number(item.cantidad).toFixed(2)} </h3>
                    </div>
                }
                <div className="need">
                    <span>Faltante</span>
                    <h3>{Number(item.cantidad - item.cantidadEntrega).toFixed(2)} {itemRequisicion.unidad}</h3>
                </div>
            </div>
        </div>
    )
}