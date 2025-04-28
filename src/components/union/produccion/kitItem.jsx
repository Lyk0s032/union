import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPromedio } from "./calculo";
import { useDispatch } from "react-redux";
import * as actions from '../../store/action/action';

export default function KitItem(props){
    const [params, setParams] = useSearchParams();
    const kit = props.kit;

    const dispatch = useDispatch();

    return (
        <tr onClick={() => {
            dispatch(actions.getKit(kit))
            params.set('w', 'newKit')
            setParams(params);
        }}>
            <td >{kit.code}</td>
            <td>{kit.name.toUpperCase()}</td>
            <td>{kit.categoria ? kit.categoria.name : 'Sin categoría'}</td>
            <td>{kit.linea ? kit.linea.name : 'Sin categoría'}</td>
            <td>{kit.extension ? kit.extension.name : 'Sin categoría'}</td>
            <td>{kit.materia ? <GetSimilarPrice materia={kit.materia} /> : null}</td>
            {/* <td>
                <button onClick={() => {
                    params.set('w', 'updateMp');
                    setParams(params);
                }}>
                    <span>Editar</span>
                </button>
            </td> */}
        </tr>
    )
}

function  GetSimilarPrice(props){
    const consumir = props.materia;
    const [valor, setValor] = useState(0) 

    const mapear = () => {
        const a = consumir.map((c, i) => {
            const getV  =  getPromedio(c);
            return getV
        })
        const promedio = a && a.length ? Number(a.reduce((acc, p) => Number(acc) + Number(p), 0)) : null
        
        return setValor(promedio);
    } 

    useEffect(() => {
        mapear()
    }, [])
    return (
        <div className="similarPrice">
            <span>{valor > 0 ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor.toFixed(0)) : 0} COP</span>
        </div>
    )
}