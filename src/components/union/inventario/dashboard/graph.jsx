import React from 'react';
import GraphSerial from './grafica';

export default function GraphBodega(){
    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="headerSeccion">
                    <h3>Kit's</h3>
                </div>
                <div className="topDataKits">
                    <div className="divide">
                        <div className="leftGraph">
                            <GraphSerial /> 
                        </div>
                        <div className="rightDataGraph">
                            <div className="containerDataRightGraph">
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Movimientos</h3>
                                    </div>
                                    <h3 className='h3'>{10}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}