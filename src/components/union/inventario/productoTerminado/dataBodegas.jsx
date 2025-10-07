import React from 'react';
import ResultBodegaProducto from './resultBodega';
import { useSearchParams } from 'react-router-dom';
import ResultBodegaProyecto from './resultadoProyecto';

export default function DataBodegas({ item }){
    const [params, setParams] = useSearchParams();

    const openNecesary = (tipo, valor) =>{
        if(tipo == 'Bodega'){
            params.set('show', tipo)
            params.set('who', valor)
            setParams(params);
        }else{
            params.set('show', tipo)
            params.set('who', valor)
            setParams(params);
        }
    }
    return (
        <div className="dataBodegas">
            <div className="containerDataBodega">
                <div className="divide">
                    <div className="leftData">
                        {
                            !params.get('show') || params.get('show') == 'Bodega' ?
                                <ResultBodegaProducto item={item}/>
                            :
                                <ResultBodegaProyecto item={item}/>
                        } 
                    </div>
                    <div className="bodegasInformacion">
                        <div className="title">
                            <h3>Bodegas +</h3>
                        </div>
                         {
                            item.inventarios?.map((inv, i) => {
                                return (
                                    <div className="resultsBodegas" key={i+1}>
                                        <div className="resultBodega" onClick={() => {
                                            openNecesary('Bodega', inv.ubicacion.id)
                                        }}>
                                            <div className="letterHere">
                                                <h3>{inv.ubicacion.nombre.split('')[0]}</h3>
                                            </div> 
                                            <div className="NameHere">
                                                <h3>{inv.ubicacion.nombre}  ({inv.cantidad})</h3>
                                                <span>{inv.ubicacion.description}</span>
                                            </div>
                                        </div>
                                    </div> 
                                )
                            })
                        }



                        <br /><br />
                        <div className="title">
                            <h3>Proyectos pendientes +</h3>
                        </div>
                        {
                            item.cotizacion_compromisos?.map((inv, i) => {
                                return (
                                    <div className="resultsBodegas" key={i+1}> {console.log(inv)}
                                        <div className="resultBodega" onClick={() => {
                                            openNecesary('Proyecto', inv.cotizacionId)
                                        }}>
                                            <div className="letterHere">
                                                <h3 style={{fontSize:12}}>{inv.cotizacion?.id}</h3>
                                            </div>  
                                            <div className="NameHere">
                                                <h3>({Number(inv.cantidadEntregada).toFixed(0)} / {Number(inv.cantidadComprometida).toFixed(0)})</h3>
                                                <span>{inv.cotizacion?.name}</span>
                                            </div>
                                        </div>
                                    </div> 
                                )
                            })
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}