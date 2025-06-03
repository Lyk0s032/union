import React, { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import ItemToSelect from './itemToSelect';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import Selected from './selected';
import SearchKits from './searchKits';
import { getPromedio } from '../calculo';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import UpdateKit from './updated';

export default function SelectMP(){

    const kits = useSelector(store => store.kits);

    const { kit, loadingKit } = kits;
    const system = useSelector(store => store.system);
    const { lineas, categorias, extensiones } = system;
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

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

      const [openMenuId, setOpenMenuId] = useState(null);
    
    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id); // Si ya está abierto, ciérralo; si no, ábrelo
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          // Si hay un menú abierto y el clic no fue dentro de ningún menú (o su botón)
          // Usamos event.target.closest('.menu-container') para verificar si el clic fue dentro del menú o su botón
          if (openMenuId !== null && !event.target.closest('.menu-containerSelected')) {
            setOpenMenuId(null); // Cierra el menú
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [openMenuId]);  
    return (
        <div className="page">
            {console.log(kit)}
            <div className="selectItems">
                <div className="leftKit">
                    <div className="topData">
                        <div className="DataKit">
                            <h3>{kit.name}</h3> 
                            { kit && kit.linea ? <span>Linea: <strong>{kit.linea.name}</strong></span> : null  }<br />
                            { kit && kit.extension ? <span>Extensión: <strong>{kit.extension.name}</strong></span> : null  }<br />
                            { kit && kit.categoria ? <span>Categoría: <strong>{kit.categoria.name}</strong></span> : null  }<br />
                            {
                                !params.get('update') ?
                                    <button onClick={() => {
                                        params.set('update', 'true');
                                        setParams(params);
                                    }}>
                                        <span>Editar</span>
                                    </button>
                                :null
                            }
                        </div>
                    </div>
                    <div className="middleData">
                        <div className="tableItemsMP">
                            {
                                params.get('update') ?
                                <UpdateKit kit={kit} />
                                :
                                <Selected kit={kit} toggleMenu={toggleMenu} openMenuId={openMenuId}/>
                            }
                        </div>
                    </div>
                    <div className="bottomData">
                        {
                            params.get('update') ? null :
                            <div className="priceBox">
                                <div>
                                    {/* <span>Producción </span><br /> */}
                                    <GetSimilarPrice materia={kit.materia} linea={kit.linea} />
                                </div>
                                {/* <div style={{marginLeft:50}}>
                                    <span>Distribuidor </span><br />
                                    <GetSimilarPrice materia={kit.materia} linea={kit.linea} type='distribuidor' />
                                </div> */}
                                {/* <div style={{marginLeft:50}}>
                                    <span>Precio final</span><br />
                                    <GetSimilarPrice materia={kit.materia} linea={kit.linea} type='final' />
                                </div> */}
                            </div> 
                        }
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
    const linea = props.linea;
    const type = props.type;
    const [valor, setValor] = useState(0) 

    const mapear = () => {
        const a = consumir && consumir.length ? consumir.map((c, i) => {
            const getV  =  getPromedio(c);
            return getV
        }) : 0
        const promedio = a && a.length ? Number(a.reduce((acc, p) => Number(acc) + Number(p), 0)) : null
        
        return setValor(promedio);
    } 

    const distribuidor = linea.percentages && linea.percentages.length ? Number(valor / linea.percentages[0].distribuidor) : valor
    const final = linea.percentages && linea.percentages.length ? Number(distribuidor / linea.percentages[0].final) : valor
    
    useEffect(() => {
        mapear()
    }, [consumir])
    return (
        <div className="similarPrice" style={{display:'flex'}}>
            {
            // Final
            }
            <div className="">
                <span>Distribuidor</span><br />
                <h3 style={{fontSize:14}}>{valor > 0 ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(distribuidor).toFixed(0)) : 0} <span>COP</span></h3>    
            </div>
            {// Distribuidor
            }
            <div className="" style={{marginLeft:30}}>
                <span>Final</span>
                <h3 style={{fontSize:14}}>{valor > 0 ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(final).toFixed(0)) : 0} <span>COP</span></h3>
            </div>
            {// Produccion
            }
            <div className="" style={{marginLeft:30}}>
                <span>Producción</span>
                <h3 style={{fontSize:14}}>{valor > 0 ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor).toFixed(0)) : 0} <span>COP</span></h3>
            </div>                     
        </div>
    )
}