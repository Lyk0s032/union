import React, { useState } from 'react';

export default function ResultProyectoProducto(){
    const [info, setInfo] = useState()
    return (
        <div className="resultBodegaHere">
            <div className="containerHere">
                <div className="hereTitle">
                    <div className="" onDoubleClick={() => {
                        setInfo(!info)
                    }}>
                        <h3>Cotización pedestales</h3>
                        <span className="tipo">Parcialmente comprado</span>
                    </div>
                    <button>
                        <span>Mover</span>
                    </button>
                </div>
                <div className="howMany">
                    <div className="howManyItem">
                        <h1>7</h1>
                        <span>Cantidad entregada</span>
                    </div>
                    <div className="howManyItem">
                        <h1>15</h1>
                        <span>Cantidad necesaria</span>
                    </div>
                </div>
                <div className="resultadosHere">
                    {
                        !info ?

                        <div className="movimientos">
                            <div className="RegisterTitle">
                                <div className="titleThat">
                                    <span>Movimientos</span>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="grafica">
                            <h3>Grafica</h3>
                        </div> 
                    }
                </div>
                
            </div>
        </div>
    )
}