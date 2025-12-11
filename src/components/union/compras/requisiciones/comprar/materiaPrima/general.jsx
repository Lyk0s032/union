import React, { useEffect, useRef, useState } from 'react';
import ListaMP from './listaMateria';
import AddMP from './addMP';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cotizador from '../cotizador';
import ProviderAnalisis from './providers/providersAnalisis';

export default function GeneralMateriaPrima({ cargaProyectos }){
    const [params, setParams] = useSearchParams();
    const ref = useRef(null);
    const refLeft = useRef(null);

    const longer = useRef(null);

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materia, proyectos, materiaIds} = req;

    const system = useSelector(store => store.system); 
    const { categorias, lineas } = system;


    const [total, setTotal] = useState(0)
    const [word, setWord] = useState(null);
    const [estado, setEstado] = useState();
    
    const addToTotal = (val) => {
        let a = Number(total) + Number(val);
        setTotal(a);
    }
     
    useEffect(() => {
    if (!ref.current || !longer.current) return;

    if (params.get("MP")) {
        // si hay un MP => abre
        ref.current.classList.add("rightHereActive");
        longer.current.classList.add("DataHereShort");
    } else {
        // si ya no hay MP => cierra
        ref.current.classList.remove("rightHereActive");
        longer.current.classList.remove("DataHereShort");
    }
    }, [params.get("MP")]);

    useEffect(() => {
    if (!refLeft.current) return;

    if (params.get("PV")) {
        refLeft.current.classList.add("leftHereActive");
    } else {
        refLeft.current.classList.remove("leftHereActive");
    }
}, [params.get("PV")]);
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Materia prima</h1>
                        <span>Lista de materia prima requerida {total}</span>
                    </div>
                    <div className="filterProvidersList">
                        <div className="containerFilterProvider">
                            {
                                proyectos?.length ?
                                    proyectos.map((p, i) => {
                                        return (
                                            <div style={{paddingLeft:10,paddingRight:10,width:'auto'}} className="provider " key={i+1}>
                                                <h3 style={{fontSize:12}}>{p.nombre}</h3>
                                            </div>
                                        )
                                    })
                                : null
                            }
                            
                            
                        </div>
                    </div>
                </div>
                <div className="searchFilterByMateria">
                    <input type="text" placeholder='Buscar aquì' onChange={(e) => {
                        setWord(e.target.value);
                    }} value={word} />
                    <div className="filters">
                        <select name="" id="" onChange={(e) => {
                            setEstado(e.target.value)
                        }} value={estado}>
                            <option value="">Selecciona una categoría</option>
                            {
                                lineas && lineas.length ?
                                    lineas.map((r) => {
                                        return (
                                            r.type == 'MP' ?
                                                <option value={r.id}>{r.name}</option>
                                            : null
                                        )
                                    })
                                : null
                            }
                        </select>
                    </div>
                </div>
                <div className="lista"> 
                    <div className="containerLista">
                        <div className="DataHere" ref={longer} >
                            <ListaMP estado={estado} word={word} materia={materia} sumar={addToTotal} />
                            <div className="cotizador">
                                {
                                    <Cotizador total={total}/>
                                }
                            </div>
                        </div>
                        <div className="leftHere" ref={refLeft}>
                            <div className="containerRelative">
                                <ProviderAnalisis />
                            </div>
                        </div> 
                        <div className="rightHere" ref={ref}>
                            <div className="containerRelative">
                                <AddMP cargaProyectos={cargaProyectos}/>
                            </div>
                        </div>
                        
                    </div>
                </div>

                
            </div>
        </div>
    )
}