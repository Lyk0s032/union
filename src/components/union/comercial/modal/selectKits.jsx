import React from 'react';
import { MdCheck } from 'react-icons/md';
import ItemToSelect from './itemToSelect';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import SelectedKits from './selected';
import SearchKitsComercial from './searchKits';
import axios from 'axios';
 
export default function SelectKits(){
    const cotizacions = useSelector(store => store.cotizacions);

    const { cotizacion, loadingCotizacion } = cotizacions;
    const system = useSelector(store => store.system);
    const dispatch = useDispatch();

    const handleAprobar = async() => {
        
        const sendAprobation = await axios.get(`/api/cotizacion/accept/${cotizacion.id}`)
        .then(res => {
            dispatch(actions.HandleAlerta('Cotización aprobada', 'positive'))
            dispatch(actions.axiosToGetCotizaciones(false))
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('Ha ocurrido un error', 'positive'))
        })
        return sendAprobation;
    }
    return (
        <div className="page">
            <div className="selectItems">
                <div className="leftKit">
                    <div className="topData">
                        <div className="DataKit">
                            <h3>{cotizacion.name}</h3>
                            <span>Fecha creada: <strong>{cotizacion.createdAt.split('T')[0]}</strong></span><br />
                            <span>Nro: <strong>{cotizacion.id}</strong></span>

                        </div>
                    </div>
                    <div className="middleData">
                        <div className="tableItemsMP">
                            <SelectedKits cotizacion={cotizacion} />
                        </div>
                    </div>
                    <div className="bottomData">
                        <div className="priceBox">
                            <div>
                                <span>Precio promedio</span><br />
                                <h3>
                                    {
                                        cotizacion.kits && cotizacion.kits.length ?
                                            <PriceCotizacion cotizacion={cotizacion.kits} />
                                        : null 
                                    }
                                </h3>
                            </div>
                            {
                                cotizacion.state == 'desarrollo' ?
                                <button style={{marginLeft:30, padding:10}} onClick={() => handleAprobar()}>
                                    <span style={{fontSize:14}}>Aprobar cotización</span>
                                </button>
                                :null
                            }
                        </div> 
                    </div> 
                </div>  
                <div className="rightSelect">
                    <SearchKitsComercial />
                </div>
            </div>
        </div>
    )
}


function PriceCotizacion(props) { 

    const kits = props.cotizacion;
    const array =  kits ? kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion.precio), 0) : 0

    // const array = !ktv ? 0 : ktv.kitCotizacion.reduce((acc, p) => Number(acc) + Number(p.precio), 0)
    // console.log(ktv)

    return (
        <div className="">
            <span>{array} COP</span>
        </div>
    )
}