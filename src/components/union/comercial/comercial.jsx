import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ModalNewKit from "./modal/newCotizacion";
import CotizacionItem from "./cotizacionItem";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../store/action/action';
import ModalNewCotizacion from "./modal/newCotizacion";
import DocumentCotizacion from "./modal/documentCotizacion";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";

export default function ComercialPanel(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const cotizacions = useSelector(store => store.cotizacions);
    const { cotizaciones, loadingCotizaciones } = cotizacions;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [state, setState] = useState('completa');      
    const [word, setWord] = useState('');
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [filter, setFilter] = useState(cotizaciones);
    const [cliente, setCliente] = useState([]);
    const [resultados, setResultados] = useState(null);
    const [searchCliente, setSearchCliente] = useState(null);
    const inputRef = useRef(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id); // Si ya está abierto, ciérralo; si no, ábrelo
    };

    const searchQuery = async (query) => {
        if(!query || query == '') return setResultados(null);

        const search = await axios.get('/api/cotizacion/search', {
            params: { query: query },
        })
        .then((res) => {
            setResultados(res.data)
        })
        .catch(err => {
            console.log(err);
            setResultados(null)
            return null
        });
        return search
        
       
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

    
      useEffect(() => {
        if(inputRef && searchCliente){
            inputRef.current.focus()
        }
      }, [searchCliente])
    useEffect(() => {
        dispatch(actions.axiosToGetCotizaciones(true, user.user.id))
    }, []) 
    return (
        !cotizaciones || loadingCotizaciones ?
            <h1>Cargando</h1>
        :
        <div className="provider">
            <div className="containerProviders Dashboard-grid"> 
                <div className="topSection">
                    <div className="title">
                        <h1>Cotizaciones</h1>
                    </div>
                    <div className="optionsFast">
                        {/* <nav>
                            <ul>
                                <li> 
                                    <button className={state == 'completa' ? 'Active' : null} onClick={() => {
                                       setState('completa')
                                    }}>
                                        <span>Pendientes</span>
                                    </button>
                                </li>
                                <li> 
                                    <button className={state == 'desarrollo' ? 'Active' : null} onClick={() => {
                                        setState('desarrollo')
                                    }}>
                                        <span>Aprobadas</span>
                                    </button>
                                </li>
                            </ul> 
                        </nav>*/}
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearchData">
                            <div className="divideSearching">
                                <div className="data">
                                    <h3>Cotizaciones en el sistema ({cotizaciones?.length ? cotizaciones.length : null})</h3>
                                    <button onClick={() => {
                                        params.set('w', 'newCotizacion');
                                        setParams(params);
                                    }}>
                                        <AiOutlinePlus className="icon" />
                                    </button>
                                </div>
                                <div className="filterOptions">
                                    <div className="inputDivA">
                                        <div className="inputUX LargerUX">
                                            <input type="text"  placeholder="Buscar aquí..." onChange={(e) => {
                                                setWord(e.target.value)
                                            }} value={word} />
                                        </div>
                                        <div className="filtersUX ShortUX">
                                            {
                                                !searchCliente ?
                                                    <button style={{width:'95%'}} name="" id="" onClick={() => {
                                                        setSearchCliente(true)
                                                    }} > 
                                                        <span>Filtrar por clientes</span>
                                                        <AiOutlinePlus className="icon" />
                                                    </button>
                                                :
                                                <div className="searchResults">
                                                    <input type="text" ref={inputRef} placeholder="Buscar cliente" onChange={(e) => {
                                                        searchQuery(e.target.value) 
                                                    }} onBlur={() => setSearchCliente(false)} onKeyDown={(e) => {
                                                        if(e.key == 'Escape'){
                                                            setSearchCliente(null);
                                                            setResultados(null)
                                                        }
                                                    }}/>
                                                </div>
                                            }
                                            
                                            
                                        </div>
                                        
                                    </div>
                                    {

                                        resultados?.length ?
                                    <div className="resultadosBusqueda">
                                        <div className="containerResultados">
                                                {
                                                    resultados?.length ?
                                                        resultados.map((r, i) => {
                                                            return (
                                                                    <div className="clienteResult" key={i+1} onClick={() => {
                                                                            setCliente([...cliente, { name: r.nombre, id:r.id}])
                                                                            setResultados(null)
                                                                        }}>
                                                                        <div className="divideResult">
                                                                            <div className="letter">
                                                                                <h3>{r.nombre.split('')[0]}</h3>
                                                                            </div>
                                                                            <div className="nameResult">
                                                                                <h3>{r.nombre.toUpperCase()}</h3>
                                                                                <span>{r.nit}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            )
                                                        })
                                                    : null
                                                }
                                            
                                        </div>
                                    </div> : null
                                    }
                                </div>
                            </div>
                        </div><br /><br />

                        <div className="clientsChoose">
                            <div className="containerClientsChoose">
                                {
                                    cliente?.length ?  
                                        cliente.map((cl, i) => {
                                            return (
                                                <div className="client" key={i+1} onClick={() => {
                                                    let filtado = cliente.filter(c => c.id != cl.id)
                                                    setCliente(filtado)
                                                }}>
                                                    <h3>{cl.name}</h3>
                                                    <button >
                                                        <span>X</span>
                                                    </button>
                                                </div>
                                            )
                                        })
                                    : null
                                }
                            </div>
                        </div>
                        <div className="table TableUX">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Cotizacion</th>
                                        <th></th>
                                        <th></th>
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
                                            cotizaciones.filter(pro => {
                                                const searchTerm = word.toLowerCase();
                                                const busqueda = word ? pro.name.toLowerCase().includes(word.toLowerCase()) : true;
                                                const idVisible = String(21719 + Number(pro.id));
                                                const coincidePorId = idVisible.includes(searchTerm);
                                                const porCliente = cliente.length > 0 
                                                ? cliente.some(cliente => cliente.id === pro.clientId) 
                                                : true;
                                                return (busqueda || coincidePorId) && porCliente; 
                                            }).map((coti, i) => {
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