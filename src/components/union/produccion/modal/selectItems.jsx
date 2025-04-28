import React, { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import ItemToSelect from './itemToSelect';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import Selected from './selected';
import SearchKits from './searchKits';
import { getPromedio } from '../calculo';
import axios from 'axios';

export default function SelectMP(){

    const kits = useSelector(store => store.kits);

    const { kit, loadingKit } = kits;
    const system = useSelector(store => store.system);
    const { lineas, categorias, extensiones } = system;
    const dispatch = useDispatch();

    const sendPeticion = async () => {
        const body = {
            kitId: kit.id,
            state: 'completa'
        }
        const send = await axios.put('/api/kit/updateState', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('¡Kit esta listo!', 'positive'))
            dispatch(actions.axiosToGetKit(false, kit.id))
        }).catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado finalizar este kit, intentalo más tarde', 'mistake'))
        })
        return send;
    }
    return (
        <div className="page">
            <div className="selectItems">
                <div className="leftKit">
                    <div className="topData">
                        <div className="DataKit">
                            <h3>{kit.name}</h3>
                            { kit && kit.linea ? <span>Linea: <strong>{kit.linea.name}</strong></span> : null  }<br />
                            { kit && kit.extension ? <span>Extensión: <strong>{kit.extension.name}</strong></span> : null  }<br />
                            { kit && kit.categoria ? <span>Categoría: <strong>{kit.categoria.name}</strong></span> : null  }<br />
                        </div>
                    </div>
                    <div className="middleData">
                        <div className="tableItemsMP">
                            <Selected kit={kit}/>
                        </div>
                    </div>
                    <div className="bottomData">
                        <div className="priceBox">
                            <div>
                                <span>Precio promedio</span><br />
                                <GetSimilarPrice materia={kit.materia} />
                            </div>
                        </div>
                        <div className="buttonConfirm">
                            {
                                kit.state == 'desarrollo' || !kit.state ?
                                <button onClick={() => sendPeticion()}>
                                    <span>Confirmar</span>
                                </button>
                                :null
                            }
                        </div>
                    </div>
                </div> 
                <div className="rightSelect">
                    <SearchKits />
                </div>
            </div>
        </div>
    )
}

function  GetSimilarPrice(props){
    const consumir = props.materia;
    const [valor, setValor] = useState(0) 

    const mapear = () => {
        const a = consumir && consumir.length ? consumir.map((c, i) => {
            const getV  =  getPromedio(c);
            return getV
        }) : 0
        const promedio = a && a.length ? Number(a.reduce((acc, p) => Number(acc) + Number(p), 0)) : null
        
        return setValor(promedio);
    } 

    useEffect(() => {
        mapear()
    }, [consumir])
    return (
        <div className="similarPrice">
            <h3>{valor > 0 ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor.toFixed(0)) : 0} <span>COP</span></h3>
        </div>
    )
}