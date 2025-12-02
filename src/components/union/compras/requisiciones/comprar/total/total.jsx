import React, { useRef, useState } from "react";
import ListaMPTotal from "./listaMP";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LISTAPT from "./listaPT";

export default function GeneralTotal({ cargaProyectos }){
    const [params, setParams] = useSearchParams();
    const ref = useRef(null);
    const refLeft = useRef(null);

    const longer = useRef(null);

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materia, proyectos, materiaIds} = req;

    const [total, setTotal] = useState(0)

    const addToTotal = (val) => {
        let a = Number(total) + Number(val);
        console.log('nuevo valor, ', a)
        setTotal(a);
    }
     
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Total</h1>
                        <span>Total del consolidado {total}</span>
                    </div>
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere" ref={longer} >
                            <ListaMPTotal materia={materia} sumar={addToTotal} />
                            <br /><br />
                            <LISTAPT materia={materia} sumar={addToTotal} />

                        </div>
                    </div>
                </div> 

                
            </div>
        </div>
    )
}