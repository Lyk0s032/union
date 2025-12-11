import React from 'react';
import ResultBodegaProducto from './resultBodega';
import { useSearchParams } from 'react-router-dom';
import ResultBodegaProyecto from './resultadoProyecto';

export default function DataBodegas({ item }){
    const [params, setParams] = useSearchParams();

    const openNecesary = (tipo, valor) =>{
        if(tipo == 'Bodega'){
            params.set('bodega', valor)
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
                            item?.otrasBodegas?.map((inv, i) => {
                                return (
                                    <div className="resultsBodegas" key={i+1}>
                                        <div className="resultBodega" onClick={() => {
                                            openNecesary('Bodega', inv.ubicacionId)
                                        }}>
                                            <div className="letterHere">
                                                <h3>{inv &&  inv?.ubicacionNombre ? inv.ubicacionNombre.split('')[0] : 'no hay nombre'}</h3>
                                            </div> 
                                            <div className="NameHere">
                                                <h3>{inv?.ubicacionNombre}  ({inv.completeCount})</h3>
                                                <span>Cantidades {inv?.totalMeters} {item.item.unidad}</span>
                                            </div>
                                        </div>
                                    </div> 
                                )
                            })
                        }



                        <br /><br />
                        {
                            params.get('bodega') == 1 || params.get('bodega') == 2 ?
                                <div className="title">
                                    <h3>Proyectos pendientes +</h3>
                                </div>
                            : 
                                null
                        }
                        {
                            params.get('bodega') == 1 || params.get('bodega') == 2 ?
                                item?.compromisos?.map((inv, i) => {
                                    return (
                                        <div className="resultsBodegas" key={i+1}> {console.log(inv)}
                                            <div className="resultBodega" onClick={() => {
                                                // openNecesary('Proyecto', 1) 
                                            }}>
                                                <div className="letterHere">
                                                    <h3 style={{fontSize:10}}>{Number(inv.cotizacionId + 21719)}</h3>
                                                </div>  
                                                <div className="NameHere">
                                                    <h3>({Number(inv.cantidad_entregada)} / {inv.cantidad_pendiente})</h3>
                                                    <span>poner nombre de cotizacion</span>
                                                </div>
                                            </div>
                                        </div> 
                                    )
                                })
                            : null
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}