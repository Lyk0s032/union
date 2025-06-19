import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ModalNewKit from "./modal/newCotizacion";
import CotizacionItem from "./cotizacionItem";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../store/action/action';
import ModalNewCotizacion from "./modal/newCotizacion";
import DocumentCotizacion from "./modal/documentCotizacion";

export default function ComercialPanel(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const cotizacions = useSelector(store => store.cotizacions);
    const { cotizaciones, loadingCotizaciones } = cotizacions;

    const [state, setState] = useState('completa');      
    const [word, setWord] = useState(null);
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [filter, setFilter] = useState(cotizaciones);
        

    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id); // Si ya está abierto, ciérralo; si no, ábrelo
    };
    
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


    useEffect(() => {
        dispatch(actions.axiosToGetCotizaciones(true))
    }, []) 
    return (
        <div className="provider">
            <div className="containerProviders"> {console.log(cotizaciones)}
                <div className="topSection">
                    <div className="title">
                        <h1>Cotizaciones</h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li> 
                                    <button onClick={() => {
                                        params.set('w', 'newCotizacion');
                                        setParams(params);
                                    }}>
                                        <span>Nueva Cotización</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearch">
                            <div className="containerTopSearch">
                                <input type="text" placeholder="Buscar cotización" />
                            </div>
                        </div>
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Cliente</th>
                                        <th>fecha</th>
                                        <th>Estado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !cotizaciones || loadingCotizaciones ?
                                            <h1>Cargando</h1>
                                        : cotizaciones == 404 || cotizaciones == 'notrequest' ? null
                                        :
                                        cotizaciones?.length ?
                                            cotizaciones.map((coti, i) => {
                                                return (
                                                    <CotizacionItem cotizacionn={coti} key={i+1} openMenuId={openMenuId} toggleMenu={toggleMenu} />
                                                )
                                            })
                                        :null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* {
                    params.get('prima') ?
                        <ShowMateriaPrima />
                    : null
                } */}
            </div>
            {
                params.get('w') == 'newCotizacion' ?
                    <ModalNewCotizacion />
                // :params.get('w') == 'updateMp' ?
                //     <ModaUpdateMp />    
                : params.get('watch') == 'cotizacion' ?
                    <DocumentCotizacion />
                : null
            }
        </div>
    )
}