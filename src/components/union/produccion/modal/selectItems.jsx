import React, { useEffect, useRef, useState } from 'react';
import { MdCheck, MdOutlineAdd, MdOutlineContentCopy, MdOutlineEditNote, MdOutlineSaveAs } from 'react-icons/md';
import ItemToSelect from './itemToSelect';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import Selected from './selected';
import SearchKits from './searchKits';
import { getPromedio } from '../calculo';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import UpdateKit from './updated';
import { BsShieldCheck } from 'react-icons/bs';
import ConfigKit from './configKit';

export default function SelectMP(){

    const kits = useSelector(store => store.kits);

    const { kit, loadingKit } = kits;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    const [add, setAdd] = useState(null);
    const segmentoRef = useRef(null);
    const [nameAdd, setNameAdd] = useState('');
    const [adding, setAdding] = useState(false);
    const [number, setNumber] = useState(null)
    const sendPeticion = async () => {
        const body = {
            kitId: kit.id,
            state: 'completa'
        }
        const send = await axios.put('/api/kit/updateState', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('¡Kit esta listo!', 'positive'))
            dispatch(actions.axiosToGetKit(false, kit.id))
            return res
        }).catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado finalizar este kit, intentalo más tarde', 'mistake'))
            return err
        })
        return send;
    }
    // Nuevo segmento
    const newSegmento = async () => {
        if(!nameAdd) return dispatch(actions.HandleAlerta('Debes ingresar nombre al segmento', 'mistake'))
        const body = {
            kitId: kit.id,
            name: nameAdd,
            userId: user.user.id
        }
        setAdding(true);
        const send = await axios.post('/api/kit/add/segmento', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('¡Segmento añadido!', 'positive'))
            setAdd(null);
            dispatch(actions.axiosToGetKit(false, kit.id))
            return res
        }).catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado añadir este segmento, intentalo más tarde', 'mistake'))
            return err
        })
        .finally(e => {
            setAdding(false)
            return e;
        })
        return send;
    }
    //  Activar segmento
        const selectArea = (zona) => {
        setNumber(zona)
    }

    const [openMenuId, setOpenMenuId] = useState(null);
    
    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id); // Si ya está abierto, ciérralo; si no, ábrelo
    };

    const copyName = () => {
        let copiedName = `${kit.id} - ${kit.name}`

        navigator.clipboard.writeText(copiedName)
        .then(() => {
            // Opcional: Avisa al usuario que funcionó.
            alert("¡Texto copiado al portapapeles!");
        })
        .catch(err => {
            // Opcional: Maneja el error si no se pudo copiar.
            console.error("Error al copiar:", err);
        });
    }

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


      useEffect(() => {
        if(add == true && segmentoRef.current){
            segmentoRef.current.focus()
        }
      }, [add])
    return (
        <div className="page">
            {
                params.get('update') == 'true' ?
                    <ConfigKit kit={kit} />
                : null
            }
            <div className="selectItems">
                <div className="leftKit">
                    <div className="topData">
                        <div className="DataKit">
                            <h3>{kit.name} - <strong>({kit.extension.name})</strong></h3> 
                            {/* {
                                !params.get('update') ?
                                    <button onClick={() => {
                                        params.set('update', 'true');
                                        setParams(params);
                                    }}>
                                        <span>Editar</span>
                                    </button>
                                :null
                            } */}
                        </div>
                        <div className="optionsForKitsNav">
                            <div className="leftNavD">
                                <nav>
                                    <ul>
                                        <li onClick={() => {
                                            params.set('update', 'true');
                                            setParams(params);
                                        }}>
                                            <div>
                                                <MdOutlineEditNote className="icon" />
                                            </div>
                                        </li>
                                        <li onClick={() => copyName()}>
                                            <div>
                                                <MdOutlineContentCopy className='icon' />
                                            </div>
                                        </li>
                                        <li onClick={() => {
                                            setAdd(true)

                                        }}>
                                            <div>
                                                <MdOutlineAdd className="icon" />
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="leftNavD">
                                <nav>
                                    <ul>
                                        {
                                            kit.state == 'desarrollo' || !kit.state ?
                                        <li onClick={() => sendPeticion()}>
                                            <div>
                                                <MdOutlineSaveAs className="icon" />
                                            </div>
                                        </li>
                                            :
                                        <li>
                                            <div >
                                                <BsShieldCheck className="icon Great" /> 
                                            </div>
                                        </li>
                                        }
                                        
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="middleData">
                        <div className="tableItemsMP">
                            {
                                add ?
                                    <div className="newSegmento">
                                        <label htmlFor="">{!adding ? 'Nombre del segmento' : 'Añadiendo...'}</label><br />
                                        <input type="text" ref={segmentoRef}
                                        onBlur={() => setAdd(null)} placeholder='Escribe aquí'
                                        onKeyDown={(e) => {
                                            if(e.code == 'Enter'){
                                                if(!adding){
                                                    newSegmento()
                                                }
                                            }
                                        }} onChange={(e) => {
                                            setNameAdd(e.target.value)
                                        }} value={nameAdd}/><br /><br />
                                    </div>
                                : null
                            }
                            
                            <Selected kit={kit} selectArea={selectArea} number={number} toggleMenu={toggleMenu} openMenuId={openMenuId}/>
                        </div>
                    </div>
                    <div className="bottomData">
                        {
                            params.get('update') ? null :
                            <div className="priceBox">
                                <div className="listPrices">
                                    {/* <span>Producción </span><br /> */}
                                    <GetSimilarPrice items={kit.itemKits} linea={kit.linea} />
                                </div>
                                {/* <div style={{marginLeft:50}}>
                                    <span>Distribuidor </span><br />
                                    <GetSimilarPrice materia={kit.materia} linea={kit.linea} type='distribuidor' />
                                </div> */}
                                {/* <div style={{marginLeft:50}}>
                                    <span>Precio final</span><br />
                                    <GetSimilarPrice materia={kit.mate ria} linea={kit.linea} type='final' />
                                </div> */}
                            </div> 
                        }
                    </div>
                </div> 
                <div className="rightSelect">
                    <SearchKits number={number}/>
                </div>
            </div>
        </div>
    )
} 

function GetSimilarPrice(props) {
    // Leemos las props que vienen del componente padre.
    // 'items' es el arreglo kit.itemKits que le pasamos.
    const items = props.items;
    const linea = props.linea;

    // Estado para guardar el costo total de producción.
    const [valor, setValor] = useState(0);
    // Función para calcular el costo total del kit.
    const mapear = () => {
        // Primero, una validación de seguridad: si no hay items, el costo es 0.
        if (!items || items.length === 0) {
            setValor(0);
            return;
        }

        // Mapeamos el arreglo de items. Cada 'item' se pasa a la función 'getPromedio'.
        const costosIndividuales = items.map(item => getPromedio(item));

        // Sumamos los costos que retornó la función para cada item.
        const costoTotal = costosIndividuales.reduce((acc, costo) => acc + Number(costo), 0);
        
        // Actualizamos el estado con el costo total de producción.
        setValor(costoTotal);
    } 

    // Calculamos los precios de venta basados en los porcentajes de la línea.
    // Usamos 'optional chaining' (?.) para evitar errores si los datos no existen.
    const distribuidor = linea?.percentages?.length ? Number(valor / linea.percentages[0].distribuidor) : valor;
    const final = linea?.percentages?.length ? Number(distribuidor / linea.percentages[0].final) : valor;
    
    // Este Hook se ejecuta cada vez que el arreglo 'items' cambia,
    // para mantener los precios siempre actualizados.
    useEffect(() => {
        mapear();
    }, [items]);

    return (
        <div className="similarPrice" style={{ display: 'flex' }}>
            
            {/* Columna para el Precio de Producción */}
            <div className="" style={{ marginLeft: 30 }}>
                <span>Producción</span>
                <h3 style={{ fontSize: 14 }}>
                    {valor > 0 ? new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valor).toFixed(0)) : 0} <span>COP</span>
                </h3>
            </div>
            
            {/* Columna para el Precio de Distribuidor */}
            <div className="" style={{ marginLeft: 30 }}>
                <span>Distribuidor</span><br />
                <h3 style={{ fontSize: 14 }}>
                    {valor > 0 ? new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(distribuidor).toFixed(0)) : 0} <span>COP</span>
                </h3>     
            </div>
            
            {/* Columna para el Precio Final */}
            <div className="" style={{ marginLeft: 30 }}>
                <span>Final</span>
                <h3 style={{ fontSize: 14 }}>
                    {valor > 0 ? new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(final).toFixed(0)) : 0} <span>COP</span>
                </h3>
            </div>
                                        
        </div>
    )
}