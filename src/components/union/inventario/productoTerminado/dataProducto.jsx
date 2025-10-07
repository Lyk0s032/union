import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function DataProducto({ item }){
    const [params, setParams] = useSearchParams();
    const [add, setAdd] = useState(false);

    const [form, setForm] = useState({
        cantidad: 1,
        bodegaId: 1,
        tipoMovimiento: 'ENTRADA',
        ubicacionOrigenId: 1,
        ubicacionDestinoId: 1,
        refDoc: 'ENC1000'
    })
    return (
        <div className="dataProducto">
            <div className="containerProductoData">
                <div className="topInfoProductoHere">
                    <div className="topAvance">
                        <div className="letra">
                            <h3>L</h3>
                        </div>
                        <div className="dataResult">
                            <h3>{item.description}</h3>
                            <span>{item.description ? 'Materia prima' : 'Producto'}</span>
                            {
                                item.medida ?
                                    <div>
                                        <strong style={{fontSize:12}}>Medida: </strong> <span>{item.medida} {item.unidad}</span>
                                    </div>
                                : null
                            }
                        </div>
                    </div>
                    {
                        item.medida ? 
                        <div className="dataDescription">
                            <strong>Descripción</strong><br />
                            <span>Este producto no tiene descripción</span>
                            <br /><br />
                            {
                                add ?
                                <div className="inputDiv">
                                    <label htmlFor="">Ingresa Cantidad {form.tipoMovimiento}</label><br />
                                    <input type="text" onBlur={() => setAdd(false)} onChange={(e) => {
                                        setForm({
                                            ...form,
                                            cantidad: e.target.value,
                                            tipoMovimiento: e.target.value >= 0 ? 'ENTRADA' : 'SALIDA'
                                        })
                                    }}/>
                                </div>
                                :
                                <button onClick={() => setAdd(true)}>
                                    <span>Hacer movimientos</span>
                                </button>
                            }
                            <br />
                        </div>
                        :
                        <div className="dataDescription">
                            <strong>Descripción</strong><br />
                            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque explicabo, aliquam deserunt, itaque culpa illum dignissimos tenetur officiis voluptatum harum delectus repudiandae dicta aperiam hic deleniti dolorum in consequuntur? Cupiditate.</span>
                            <br /><br />
                            <button>
                                <span>Hacer movimientos</span>
                            </button><br />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}