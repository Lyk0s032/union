import React, { useState } from 'react';

export default function ItemOrden({ item }){
    const [open, setOpen] = useState(false);
    return (
        <div className={`itemCompra ${open ? "open" : ""}`}>
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
                <div className="price">
                    <span>Descuento</span>
                    <h3>{item.descuento}</h3>
                </div>
                <div className="price">
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
    )
}