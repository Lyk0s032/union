import React from 'react';
import { MdCheck } from 'react-icons/md';
import ItemToSelect from './itemToSelect';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import SelectedKits from './selected';
import SearchKitsComercial from './searchKits';
 
export default function SelectKits(){
    const cotizacions = useSelector(store => store.cotizacions);

    const { cotizacion, loadingCotizacion } = cotizacions;
    const system = useSelector(store => store.system);
    const dispatch = useDispatch();

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
    // const array =  kits.kitCotizacion.reduce((acc, p) => Number(acc) + Number(p.precio), 0)

   console.log(kits)
    // const array = !ktv ? 0 : ktv.kitCotizacion.reduce((acc, p) => Number(acc) + Number(p.precio), 0)
    // console.log(ktv)

    return (
        <div className="">
            <span>1 COP</span>
        </div>
    )
}