import React, { useEffect, useRef, useState } from "react";
import { OneElement } from "../../produccion/calculo";
import axios from "axios";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import SelectedSuperKit from "./superKitSelected";
import SelectedKit from "./selectedKit";
import { MdDeleteOutline, MdOutlineFlag, MdOutlineKeyboardArrowDown, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import SelectedProducto from "./selectedProducto";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import SelectedServices from "./selectedService";

export default function SelectedKits({ number, selectArea, cotizacion, area}){
    
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [name, setName] = useState(area.name);
    const [edit, setEdit] = useState(null);
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    // Estado para controlar si el acordeón está abierto o cerrado
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    // UseRef
    const inputRef = useRef(null);
    // Función para alternar el estado del acordeón (abrir/cerrar)
    const handleAccordionToggle = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };
    const [openMenuId, setOpenMenuId] = useState(null); 
    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id); // Si ya está abierto, ciérralo; si no, ábrelo
    };

    // Clonar área
    const clonarArea = async () => {
        let body = {
            userId: user.user.id,
            areaId: area.id
        }
        const send = await axios.post('/api/cotizacion/area/clonar', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Área clonada con éxito', 'positive'));
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            return res
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado clonar esto', 'mistake'));
            
        })
        return send
    }

    // Editar área
    const EditarArea = async () => {
            if(!name) return dispatch(actions.HandleAlerta('Debes ingresar un nombre al área', 'mistake'))
            // caso contrario... Avanzamos
            let body = {
                userId: user.user.id,
                cotizacionId: cotizacion.id,
                name,
                areaId: area.id
            }
            
            const send = await axios.put('/api/cotizacion/area/add', body)
            .then((res) => {
                dispatch(actions.HandleAlerta('Área editada con exito.', 'positive'))
                dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
                setEdit(null)
                return res;
            })
            .catch(err => {
                console.log(err)
                dispatch(actions.HandleAlerta('No hemos logrado editar área', 'mistake'))
            })
            return send;
        }
    // Eliminar área
    const EliminarArea = async () => {
        let body = {
            userId: user.user.id,
            cotizacionId: cotizacion.id,
            areaId: area.id
        }
        console.log(body)
        const send = await axios.delete('/api/cotizacion/area/remove', { data: body })
        .then((res) => {
            dispatch(actions.HandleAlerta('Área eliminada con éxito', 'positive'));
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            return res
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado eliminar área', 'mistake'));
            
        })
        return send
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
          // Si hay un menú abierto y el clic no fue dentro de ningún menú (o su botón)
          // Usamos event.target.closest('.menu-container') para verificar si el clic fue dentro del menú o su botón
          if (openMenuId !== null && !event.target.closest('.menu-container')) {
            setOpenMenuId(null); // Cierra el menú
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [openMenuId]);  
    

    return (
        <div className={number == area.id ? 'area Active' : 'area'}>
            <div className="topTitleArea" onContextMenu={(e) => {
                e.preventDefault()
                toggleMenu(area.id)
                selectArea(area.id)
            }}>
                <div className="divide">
                    <div className="left">  {console.log(area)}
                        {
                             edit ?
                             <input type="text" id={area.id} ref={inputRef} className="inputVisible"  value={name} 
                             onKeyDown={(e) => { 
                                 if(e.code == 'Escape')setEdit(null)
                                 if(e.code == 'Enter') EditarArea();
                             }} onChange={(e) => {
                                setName(e.target.value)
                             }} />
                             :
                             <h3 onClick={() => {
                                if(number == area.id){
                                    selectArea(null)
                                }else{
                                    selectArea(area.id)
                                }
                            }}>{area.name}</h3>
                        }
                    </div>
                    <div className="right">
                        <div className="menu-container">
                            {openMenuId === area.id && ( // Renderizado condicional para mostrar/ocultar
                                <div className="menu-dropdown" role="menu" aria-orientation="vertical"
                                    aria-labelledby={`menu-button-${area.id}`}>
                                        <div className="panel">
                                            <div className="title">
                                                <strong>{area.name}</strong>
                                            </div>
                                            <nav>
                                                <ul>
                                                    <li> 
                                                        <div>
                                                            <MdOutlineFlag className="icon" />
                                                            <span>Desactivar</span>
                                                        </div>
                                                    </li>
                                                    <li onClick={() => { 
                                                        inputRef.current?.focus();
                                                        setEdit(true)

                                                        toggleMenu(null)
                                                    }}> 
                                                        <div>
                                                            <MdOutlineFlag className="icon" />
                                                            <span>Editar nombre</span>
                                                        </div>
                                                    </li>
                                                    <li onClick={() => clonarArea()}> 
                                                        <div>
                                                            <MdOutlineScreenShare   className="icon" />
                                                            <span>Clonar</span>
                                                        </div>
                                                    </li>
                                                    <li onClick={() => {
                                                        params.set('area', 'move')
                                                        setParams(params);
                                                    }}> 
                                                        <div>
                                                            <MdOutlineScreenShare   className="icon" />
                                                            <span>Pegar en otra cotización</span>
                                                        </div>
                                                    </li>
                                                    <li > 
                                                        <div>
                                                            <MdOutlineRemoveRedEye  className="icon" />
                                                            <span>Ver</span>
                                                        </div>
                                                    </li>
                                                    <li onClick={() => EliminarArea()}> 
                                                        <div>
                                                            <MdDeleteOutline className="icon" />
                                                            <span>Eliminar</span>
                                                        </div>
                                                    </li>

                                                </ul>
                                            </nav>
                                        </div>
                                </div>
                            )}
                                    </div>
                        <button onClick={handleAccordionToggle} className={isAccordionOpen ? 'btn Rotated' : 'btn'}>
                            <MdOutlineKeyboardArrowDown className={isAccordionOpen ? 'icon Rotated' : 'icon'} />
                        </button> 
                    </div>
                </div>
            </div> 
            <div className={isAccordionOpen ? 'acordion Open' : 'acordion'}>
                <table>
                    <thead>
                        <tr> 
                            <th>Nombre</th>
                            <th>Cant.</th>
                            <th>Descuento</th>
                            <th>Valor</th>
                            <th></th>

                        </tr>
                    </thead> 
                    <tbody> 
 
                        {
                            area && area.kits?.length || area.armados?.length || area.productoCotizacions?.length ? 
  
                            area.productoCotizacions.concat(area.serviciosCotizados).concat(area.armados).concat(area.kits).map((kt, i) => {
                                    return (
                                        kt.armadoCotizacion ?
                                            <SelectedSuperKit key={i+1} kt={kt} area={area} cotizacion={cotizacion}/>
                                        : kt.cantidad && kt.service ?
                                            <SelectedServices key={i+1} kt={kt} area={area} cotizacion={cotizacion} />
                                        : kt.cantidad && kt.producto ? 
                                            <SelectedProducto  key={i+1} kt={kt} area={area} cotizacion={cotizacion} />    
                                        : kt.kitCotizacion ? 
                                            <SelectedKit key={i+1} kt={kt} area={area} cotizacion={cotizacion} />
                                        : null
                                    )
                                })
                            : null
                        }

                    </tbody>  
                </table>
                
            </div>
            
        </div>
    )
}

function ValorSelected(props){
    const mt = props.mt;
    const valor = OneElement(mt)
    return (
        <span>{Number(valor).toFixed(2)}</span>
    )
}