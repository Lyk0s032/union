import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NewClient from "./nuevoCliente";
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import ItemClient from "./itemClient";
import UpdateClient from "./updateClient";

export default function AllClients(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const clientes = useSelector(store => store.clients);
    const { clients, loadingClients } = clientes;

    const [openMenuId, setOpenMenuId] = useState(null);
    const [word, setWord] = useState(null);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id); // Si ya está abierto, ciérralo; si no, ábrelo
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
          // Si hay un menú abierto y el clic no fue dentro de ningún menú (o su botón)
          // Usamos event.target.closest('.menu-container') para verificar si el clic fue dentro del menú o su botón
          if (openMenuId !== null && !event.target.closest('.menu-containerClient')) {
            setOpenMenuId(null); // Cierra el menú
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [openMenuId]); 

    useEffect(() => {
        dispatch(actions.axiosToGetClients(true));
    }, [])
    return (
        <div className="allClients">
            {console.log(clients)}
            <div className="title">
                <h3>Clientes {clients && clients.length ? `(${clients.length})` : null}</h3>
            </div>
            <div className="dataClients"> 
                <div className="containerData">
                    <div className="search">
                        <input type="text" placeholder="Buscar cliente" onChange={(e) => setWord(e.target.value)} />
                        <div className="newCreate">
                            <button onClick={() => {
                                params.set('c', 'new');
                                setParams(params);
                            }}>
                                <span>Nuevo cliente</span>
                            </button> 
                        </div>
                    </div>
                    {
                        !clients || loadingClients ?
                            <div className="loading">
                                <h1>Cargando...</h1>
                            </div>
                        :
                        <div className="clientLista">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th>NIT / Documento</th>
                                        <th>Creado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        clients == 404 || clients == 'notrequest' ? null
                                        :clients && clients.length ?
                                            clients.filter(c => {
                                                const porLetra = word ?  c.nombre.toLowerCase().includes(word.toLowerCase()) ||
                                                c.nit.toLowerCase().includes(word.toLowerCase()): true;

                                                return porLetra
                                            }).map((cl, i) => {
                                                return (
                                                   <ItemClient key={i+1} client={cl} toggleMenu={toggleMenu} openMenuId={openMenuId} />
                                                )
                                            })
                                            : null
                                    }

                                </tbody>
                            </table>
                        </div>
                    }
                    
                </div>
            </div>
            {
                params.get('c') == 'new' ?
                    <NewClient />
                : params.get('c') == 'edit' ?
                    <UpdateClient />
                : null
            }
        </div>
    )
}