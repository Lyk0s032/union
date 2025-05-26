import React from 'react';
import { BsPencil, BsThreeDots } from 'react-icons/bs';
import { MdDeleteOutline, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';

export default function ItemClient({client, toggleMenu, openMenuId}){
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    return (
         <tr>
            <td>{client.nombre.toUpperCase()}</td>
            <td>
                <div className="state">
                    <span>Disponible</span>
                </div>
            </td>
            <td>
                {client.nit}
            </td>
            <td>
                {client.createdAt.split('T')[0]}
            </td>
            <td>
                <div className="menu-containerClient">
                    <button className="btnOptions"
                        onClick={() => toggleMenu(client.id)}
                        aria-haspopup="true" // Indica que es un botón que abre un menú
                        aria-expanded={openMenuId === client.id} // Indica si el menú está abierto
                        aria-label="Opciones del elemento">
                        <BsThreeDots className="icon" />
                    </button>


                    {openMenuId === client.id && ( // Renderizado condicional para mostrar/ocultar
                        <div
                        className="
                         menu-dropdown"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby={`menu-button-${client.id}`}
                      >
                            <div className="panel">
                                <div className="title">
                                    <strong>Opciones rápidas</strong>
                                </div>
                                <nav>
                                    <ul>
                                        <li onClick={() => {
                                            toggleMenu(client.id)
                                            dispatch(actions.getClient(client))
                                            params.set('c', 'edit')
                                            setParams(params);
                                        }}> 
                                            <div>
                                                <BsPencil className="icon" />
                                                <span>Editar</span>
                                            </div>
                                        </li>
                                        <li> 
                                            <div>
                                                <MdOutlineRemoveRedEye  className="icon" />
                                                <span>Ver</span>
                                            </div>
                                        </li>
                                        <li> 
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
            </td>
        </tr>
    )
}