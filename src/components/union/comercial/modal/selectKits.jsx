import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdCheck } from 'react-icons/md';
import ItemToSelect from './itemToSelect';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import SelectedKits from './selected';
import SearchKitsComercial from './searchKits';
import axios from 'axios';
import SearchSuperKitsComercial from './superKits';
import SearchProductoTerminado from './productoTerminado';
import { BsPencil, BsPlus, BsPlusLg, BsSearch, BsThreeDotsVertical, BsX } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import MoveArea from './moveArea';
import AddNotes from './addNotesAndImg';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/es'; // Idioma español
import Condiciones from './condiciones';
import EditItemModal from './editItem';
import SearchKitsSimulacionesComercial from './simulacionesSearch';
import SolicitudDetail from '../../produccion/solicitudes/lastVersion/SolicitudDetail';
import '../../produccion/solicitudes/lastVersion/styles.less';


export default function SelectKits(){
    const cotizacions = useSelector(store => store.cotizacions);
    const [params, setParams] = useSearchParams();
    const { cotizacion, loadingCotizacion } = cotizacions;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [area, setArea] = useState(null); 
    const [edit, setEdit] = useState(false);
    const [time, setTime] = useState(cotizacion && cotizacion != 404 && cotizacion != 'notrequest' ? cotizacion.time.split('T')[0] : null) 
    const [openServices, setOpenServices] = useState(null);
    // Datos para actualizar cotizacion
    const [editTime, setEditTime] = useState(null);
    const [title, setTitle] = useState(cotizacion && cotizacion != 404 && cotizacion != 'notrequest' ? cotizacion.name : null)
    const [name, setName] = useState(null);
    const [condiciones, setCondiciones] = useState(null)
    const [loading, setLoading] = useState(false);
    const [acordeonRequerimientos, setAcordeonRequerimientos] = useState(false);
    // const system = useSelector(store => store.system);

    dayjs.locale('es') 
    dayjs.extend(localeData);

    const dispatch = useDispatch();

    const closeOpen = () => {
        setOpenServices(null);
    }
    const [navCoti, setNav] = useState(null);
    // const handleAprobar = async() => {
    //     const sendAprobation = await axios.get(`/api/cotizacion/accept/${cotizacion.id}`)
    //     .then(res => {
    //         dispatch(actions.HandleAlerta('Cotización aprobada', 'positive'))
    //         dispatch(actions.axiosToGetCotizaciones(false))
    //     })
    //     .catch(err => {
    //         dispatch(actions.HandleAlerta('Ha ocurrido un error', 'positive'))
    //     })
    //     return sendAprobation;
    // }
    // Editar
    const [notes, setNotes] = useState(null);
    // ÁREA A TRABAJAR
    const [number, setNumber] = useState(null);

    // Version
    const [version, setVersion] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [solicitarKit, setSolicitarKit] = useState(false);
    const [selectedRequerimiento, setSelectedRequerimiento] = useState(null);
    const selectArea = (zona) => {
        setNumber(zona)
    }

    const newArea = async () => {
        if(!name) return dispatch(actions.HandleAlerta('Debes ingresar un nombre al área', 'mistake'))
        // caso contrario... Avanzamos

        let body = {
            userId: user.user.id,
            cotizacionId: cotizacion.id,
            name
        }
        const send = await axios.post('/api/cotizacion/area/add', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Área agregada con exito.', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            setName('');
            setArea(null)
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado agregar área', 'mistake'))
        })
        return send;
    }

    const changeNote = (nt) => {
        setNotes(nt)
    }
    // Abrir otra versión
    const openVersion = async (versionId) => {
        dispatch(actions.axiosToGetCotizacion(true, versionId))
        setVersion(null)
    }
    // Nueva versión
     const newVersión = async () => {
        // caso contrario... Avanzamos
        setLoading(true)
        let body = {
            userId: user.user.id,
            cotizacionId: cotizacion.id,
        }
        const send = await axios.post('/api/cotizacion/version/new', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Nueva versión creada con éxito', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado crear una nueva versión', 'mistake'))
        })
        .finally(f => {
            setLoading(false);
            return f;
        })
        return send;
    }
    // Nueva versión
     const beOficialVersion = async () => {
        // caso contrario... Avanzamos
        setLoading(true)
        let body = {
            userId: user.user.id,
            cotizacionId: cotizacion.id,
            versionCotizacionId: cotizacion.versionCotizacion && (cotizacion.versionCotizacion.id)
        }
        const send = await axios.put('/api/cotizacion/version/updateToOficial', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Actualizado con éxito', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado actualizar esta versión', 'mistake'))
        })
        .finally(f => {
            setLoading(false);
            return f;
        })
        return send;
    }
    // Modificar cotizacion
     const modificarCotizacion = async () => {
        if(!title && edit) return dispatch(actions.HandleAlerta('Debes ingresar un nombre a la cotización', 'mistake'))
        if(!time && editTime) return dispatch(actions.HandleAlerta('Debes ingresar una fecha', 'mistake'))
        // caso contrario... Avanzamos

        let body = {
            time: time != cotizacion.time ? time: cotizacion.time,
            name: title != cotizacion.name ? title : cotizacion.name,
            userId: user.user.id,
            cotizacionId: cotizacion.id,
        }
        console.log(body)
        const send = await axios.put('/api/cotizacion/new', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Cotización actualizada con exito.', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            setEdit(null);
            setEditTime(null);
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado actualizar esta cotización', 'mistake'))
        })
        return send;
    }

    const closeTheCondicions = () => {
        setCondiciones(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.menuToggle')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        !cotizacion || loadingCotizacion ?
            <div className="loadingLoading">
                <h1>Cargando...</h1>
            </div>
        : cotizacion == 404 || cotizacion == 'notrequest' ?
            <div className="loadingLoading">
                <h1>No hemos logrado cargar esto.</h1>
            </div>
        :
        <div className="page">
            {cotizacion.state == 'version' && (
                <div className="mode">
                    <div className="leftMode">
                        {/* <button>
                            <span>Volver al original</span>
                        </button> */}
                    </div>
                    <div className="txt">
                        <div className="back">
                            
                            <span>Modo versión - Versión: {cotizacion && cotizacion.name ? `"${cotizacion.name}"` : null}</span>
                        </div>
                    </div>
                    <button  onClick={() => {
                            params.delete('w');
                            setParams(params);
                            dispatch(actions.getCotizacion(null))
                    }}>
                        <span>X</span>
                    </button>
                </div>
            )}
            <div className="selectItems">

                {
                    notes ?
                        <AddNotes cancelar={changeNote} cotizacion={cotizacion} /> 
                    :
                        <div className="leftKit">
                            <div className="topData">
                                {
                                    edit ? 
                                        <div className="DataKit">
                                            <div className="editForm">
                                                <div className="inputDiv">
                                                    <label htmlFor="">Editar nombre cotización</label><br />
                                                    <input type="text" placeholder='' onKeyDown={(event) => {
                                                        if(event.key === 'Escape'){
                                                            setEdit(false)
                                                        } if(event.key == 'Enter'){
                                                            modificarCotizacion()
                                                        }
                                                    }} onChange={(e) => {
                                                        setTitle(e.target.value)
                                                    }}  value={title} />
                                                </div>
                                            </div><br />
                                        </div>
                                    :
                                    editTime ?
                                        <div className="DataKit">
                                            <div className="editForm">
                                                <div className="inputDiv">
                                                    <label htmlFor="">Modificar fecha</label><br />
                                                    <input type="date" placeholder='' onKeyDown={(event) => {
                                                        if(event.key === 'Escape'){
                                                            setEditTime(false)
                                                        } if(event.key == 'Enter'){
                                                            modificarCotizacion()
                                                        }
                                                    }}  onChange={(e) => {
                                                        setTime(e.target.value)
                                                    }} value={time}/>
                                                </div>
                                            </div><br />
                                        </div>
                                    :
                                        <div className="DataKit">
                                            <h3 onDoubleClick={() => setEdit(true)}>
                                                {cotizacion.name} {number} - <strong>{21719 +cotizacion.id}</strong>
                                            </h3> 
                                            <span onDoubleClick={() => setEditTime(true)}>Fecha creada: <strong>{dayjs(cotizacion.time.split('T')[0]).format('dddd, D [de] MMMM [de] YYYY')}</strong></span><br />
                                        </div>  
                                }
                                 
                                    <div className="optionsForCotizacion">
                                        <div className="containerOptions">
                                            <nav>
                                                <ul>
                                                    {
                                                        !area ?
                                                            !edit && (
                                                                <li onClick={() => {
                                                                    setArea(!area)
                                                                }}>
                                                                    <div className="" >
                                                                        <BsPlusLg  className="icon" />
                                                                        <span>Agregar área</span>
                                                                    </div>
                                                                </li>
                                                            ) 
                                                        : 
                                                            <li onClick={() => {
                                                                setArea(!area)
                                                            }}>
                                                                <div className="" >
                                                                    <BsPlusLg  className="icon" />
                                                                    <span>Cancelar creación</span>
                                                                </div>
                                                            </li>
                                                    }
                                                    <li onClick={() => {
                                                        setCondiciones(true)
                                                    }}>
                                                        <div className="" >
                                                            <BsPlusLg  className="icon" />
                                                            <span>Condiciones</span>
                                                        </div>
                                                    </li>
                                                    {
                                                        !area && (
                                                            <li onClick={() => setEdit(!edit)}>
                                                                <div className="">
                                                                    <BsPencil className="icon" />
                                                                    <span>{!edit ? 'Editar' : 'Cancelar edición'}</span>
                                                                </div>
                                                            </li>
                                                        ) 
                                                    }
                                                    <li className="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>
                                                        <div className="">
                                                            <BsThreeDotsVertical className="icon" />
                                                        </div>
                                                        {menuOpen && (
                                                            <div className="dropdownMenu">
                                                                <ul>
                                                                    <li onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenServices(!openServices);
                                                                        setMenuOpen(false);
                                                                    }}>
                                                                        <span>Servicios</span>
                                                                    </li>
                                                                    <li onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setNotes(true);
                                                                        setMenuOpen(false);
                                                                    }}>
                                                                        <span>Notas</span>
                                                                    </li>
                                                                    <li onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setVersion(true);
                                                                        setMenuOpen(false);
                                                                    }}>
                                                                        <span>Versiones</span>
                                                                    </li>
                                                                    <li onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSolicitarKit(true);
                                                                        setMenuOpen(false);
                                                                    }}>
                                                                        <span>Solicitar KIT</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </li>
                                                    
                                                    {/* <li onClick={() => openCoti()}>
                                                        <div>
                                                            <span>Visualizar</span>
                                                        </div>
                                                    </li> */}
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                            </div>
                            <div className="middleData">
                                <div className="tableItemsMPKits">
                                    {
                                        area && (
                                            <div className="addArea">
                                                <div className="inputDiv">
                                                    <label htmlFor="">Nombre del área</label><br />
                                                    <input type="text" placeholder='Escribe aquí' onKeyDown={(event) => {
                                                        if(event.key === 'Escape'){
                                                            setArea(null)
                                                        } 
                                                        if(event.key == 'Enter'){
                                                            newArea();
                                                        }
                                                    }} onChange={(e) => {
                                                        setName(e.target.value)
                                                    }} value={name} />
                                                </div>
                                            </div>
                                        )
                                    } 
                                    {
                                        cotizacion.areaCotizacions?.length > 0 && (
                                            cotizacion.areaCotizacions.map((ar, i) => {
                                                return (
                                                    <SelectedKits number={number} selectArea={selectArea} area={ar} cotizacion={cotizacion} key={i+1} />
                                                )
                                            }
                                        ))
                                    }
                                </div>
                                { params.get('area') == 'move' && (<MoveArea area={area} />) }
                            </div>
                            <div className="bottomData">
                                {
                                    condiciones ?
                                        <Condiciones cotizacion={cotizacion} close={closeTheCondicions}  />
                                    :null
                                }
                                <div className="priceBox">
                                    {/* <div>
                                        <span>Precio promedio</span><br />
                                        <h3>
                                            {
                                                cotizacion.kits && cotizacion.kits.length ?
                                                    <PriceCotizacion cotizacion={cotizacion.kits} coti={cotizacion.armados} />
                                                : null 
                                            }
                                        </h3>
                                    </div> */}
                                    <div>
                                        {
                                            cotizacion.state == 'version' ?
                                                <button onClick={() => {
                                                    if(!loading){
                                                        beOficialVersion()
                                                    }
                                                }}>
                                                    <span>{!loading ? 'Definir como versión oficial' : 'Definiendo...'}</span>
                                                </button>
                                            : null
                                        }
                                    </div>
                                    { /* {
                                        cotizacion.state == 'desarrollo' ?
                                        <button style={{marginLeft:30, padding:10}} onClick={() => handleAprobar()}>
                                            <span style={{fontSize:14}}>Aprobar cotización</span>
                                        </button>
                                        :null
                                    } */ }
                                </div> 
                            </div>
                            {cotizacion.requiredKits && cotizacion.requiredKits.length > 0 && (
                                <div className={`requerimientosAccordion ${acordeonRequerimientos ? 'expanded' : ''}`}>
                                    {acordeonRequerimientos && (
                                        <div className="accordionBody">
                                            {cotizacion.requiredKits.map((req, index) => {
                                                const getPorcentaje = () => {
                                                    if (req.state === 'finish') return 100;
                                                    if (req.leidoProduccion && req.state === 'creando') return 70;
                                                    if (req.leidoProduccion) return 30;
                                                    return 0;
                                                };

                                                const getEstado = () => {
                                                    if (req.state === 'finish') return 'Completada';
                                                    if (req.leidoProduccion && req.state === 'creando') return 'En creación';
                                                    if (req.leidoProduccion) return 'En progreso';
                                                    return 'Pendiente';
                                                };

                                                const progreso = getPorcentaje();
                                                const estadoTexto = getEstado();
                                                const fechaCreacion = req.createdAt ? dayjs(req.createdAt).format('DD/MM/YYYY') : null;
                                                
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className="requerimientoItem"
                                                        onClick={() => setSelectedRequerimiento(req.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="reqMainInfo">
                                                            <div className="reqLeft">
                                                                <div className="reqNumber">{index + 1}</div>
                                                                <div className="reqDetails">
                                                                    <span className="reqNombre">{req.nombre || `Requerimiento ${index + 1}`}</span>
                                                                    {req.descripcion && (
                                                                        <p className="reqDescripcion">{req.descripcion}</p>
                                                                    )}
                                                                    {fechaCreacion && (
                                                                        <span className="reqFecha">Creado: {fechaCreacion}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className={`reqEstado ${estadoTexto.toLowerCase().replace(/\s+/g, '-')}`}>
                                                                {estadoTexto}
                                                            </span>
                                                        </div>
                                                        <div className="progressBar">
                                                            <div className="progressFill" style={{ width: `${progreso}%` }}>
                                                                {progreso > 0 && <span className="progressText">{progreso}%</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div 
                                        className="accordionHeader" 
                                        onClick={() => setAcordeonRequerimientos(!acordeonRequerimientos)}
                                    >
                                        <div className="accordionTitle">
                                            <span className="countBadge">{cotizacion.requiredKits.length}</span>
                                            <span className="titleText">
                                                {cotizacion.requiredKits.length === 1 ? '1 Requerimiento' : `${cotizacion.requiredKits.length} Requerimientos`}
                                            </span>
                                        </div>
                                        <span className={`accordionIcon ${acordeonRequerimientos ? 'open' : ''}`}>
                                            ▲
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div> 
                    }



                <div className="rightSelect">
                    <nav className='navToSelectFilter'>
                        <ul>
                            <li onClick={() => setNav(null)} className={!navCoti ? 'Active' : null}>
                                <div>
                                    <span>Kit's</span>
                                </div>
                            </li>
                            <li onClick={() => setNav('simulaciones')} className={navCoti == 'simulaciones' ? 'Active' : null}>
                                <div>
                                    <span>Simulaciones</span>
                                </div>
                            </li>
                            <li onClick={() => setNav('terminado')} className={navCoti == 'terminado' ? 'Active' : null}>
                                <div>
                                    <span>Producto terminado</span>
                                </div>
                            </li>
                            {/* <li onClick={() => setNav('superkits')} className={navCoti == 'superkits' ? 'Active' : null}>
                                <div>
                                    <span>Superkit's</span>
                                </div>
                            </li>  */}
                        </ul> 
                    </nav> 
                    {
                        navCoti == 'terminado' ?
                            <SearchProductoTerminado number={number} />
                        : navCoti == 'simulaciones' ?
                            <SearchKitsSimulacionesComercial number={number} />
                        : navCoti == 'superkits' ?
                            <SearchSuperKitsComercial cotizacion={cotizacion} number={number}  />
                        : <SearchKitsComercial  number={number}  /> 
                    }
                </div>
            </div>
            {
                openServices && (<ModalServices closeOpen={closeOpen} number={number} cotizacion={cotizacion} />)
            } 
            {version &&(<div className="modal BIGGEST">
                <div className="hiddenModal" onClick={() => setVersion(null)}></div>
                <div className="containerModal Small" style={{zIndex:8}}>
                    <div className="headerModal" style={{paddingLeft:40}}>
                        <div className="divide">
                            <h3>Versiones {cotizacion.versionCotizacion?.cotizacions?.length && (`(${cotizacion.versionCotizacion?.cotizacions?.length -1})`)}</h3>
                            <div className="boton">
                                <button onClick={() => {
                                    if(!loading){
                                        newVersión()
                                    }
                                }}>
                                    <span style={{color:'white'}}>{!loading ? 'Nueva versión' : 'Creando nueva versión...'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bodyModalTable" >
                        <div className="dataScroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Versión</th>
                                        <th>Estado</th>
                                        <th>Creado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cotizacion.versionCotizacion?.cotizacions?.length && (
                                            cotizacion.versionCotizacion.cotizacions?.map((v,i) => {
                                                return (
                                                    <tr className={v.state == 'desarrollo' ? `Active` : cotizacion.id == v.id ?  'Currently' : null} key={i+1} onClick={() => openVersion(v.id)}>
                                                        <td>{v.name}</td>
                                                        <td>{v.version == 1 ? 'Original' : v.version}</td> 
                                                        <td>{v.state == 'version' ? 'versionado' : v.state == 'desarrollo' ? 'Desarrollo' : 'Aprobada'}</td>
                                                        <td>{dayjs(v.createdAt.split('T')[0]).format('dddd, D [de] MMMM [de] YYYY')}</td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                    
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                    
                </div>
            </div>)
            }
            {
                solicitarKit && (
                    <SolicitarKitPanel 
                        user={user}
                        cotizacion={cotizacion}
                        onClose={() => setSolicitarKit(false)} 
                    />
                )
            }
            {
                selectedRequerimiento && (
                    <div className="modal BIGGEST" style={{ zIndex: 999999 }}>
                        <div className="hiddenModal" onClick={() => setSelectedRequerimiento(null)}></div>
                        <div className="containerModal Large solicitud-detail-modal" style={{ zIndex: 1000000, maxWidth: '900px', padding: 0, overflow: 'hidden' }}>
                            <SolicitudDetail 
                                solicitudId={selectedRequerimiento}
                                onClose={() => setSelectedRequerimiento(null)}
                                readOnly={true}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

function SolicitarKitPanel({ user, onClose, cotizacion }) {
    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);
    const { extensiones } = sistema;
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        extensionId: ''
    });

    useEffect(() => {
        if (!extensiones || extensiones.length === 0) {
            dispatch(actions.axiosToGetFiltros(false));
        }
    }, []);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleSubmit = async () => {
        if (!form.nombre || !form.descripcion || !form.extensionId) {
            return dispatch(actions.HandleAlerta('Debes completar todos los campos', 'mistake'));
        }

        setLoading(true);
        const body = {
            nombre: form.nombre,
            description: form.descripcion,
            tipo: 'kit',
            userId: user.user.id,
            cotizacionId: cotizacion.id,
            kitId: true,
            extension: parseInt(form.extensionId)
        };

        try {
            await axios.post('/api/kit/requerimientos/post/add/kit/cotizacion', body);
            dispatch(actions.HandleAlerta('Solicitud creada con éxito', 'positive'));
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id));
            onClose();
        } catch (err) {
            dispatch(actions.HandleAlerta('No hemos logrado enviar la solicitud', 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="solicitudKitPanel">
            <div className="panelOverlay" onClick={onClose}></div>
            <div className="panelContent">
                <div className="panelHeader">
                    <h3>Solicitar nuevo KIT</h3>
                    <button className="closeButton" onClick={onClose}>
                        <span>✕</span>
                    </button>
                </div>

                <div className="panelBody">
                    <div className="solicitanteInfo">
                        <label>Solicitante</label>
                        <div className="userDisplay">
                            <span>{user?.user?.name || 'Usuario'}</span>
                        </div>
                    </div>

                    <div className="inputDiv">
                        <label htmlFor="nombreKit">Nombre del KIT</label>
                        <input
                            id="nombreKit"
                            type="text"
                            placeholder="Ingresa el nombre del KIT"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        />
                    </div>

                    <div className="inputDiv">
                        <label htmlFor="descripcionKit">Descripción</label>
                        <textarea
                            id="descripcionKit"
                            placeholder="Describe las características del KIT"
                            value={form.descripcion}
                            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                            rows={4}
                        />
                    </div>

                    <div className="inputDiv">
                        <label htmlFor="extensionKit">Extensión</label>
                        <select
                            id="extensionKit"
                            value={form.extensionId}
                            onChange={(e) => setForm({ ...form, extensionId: e.target.value })}
                        >
                            <option value="">Selecciona una extensión</option>
                            {extensiones && extensiones.length > 0 && (
                                extensiones.map((ext, i) => (
                                    <option key={i} value={ext.id}>
                                        {ext.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                <div className="panelFooter">
                    <button className="btnCancelar" onClick={onClose}>
                        <span>Cancelar</span>
                    </button>
                    <button 
                        className="btnEnviar" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        <span>{loading ? 'Enviando...' : 'Enviar solicitud'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function ModalServices({ number, cotizacion, closeOpen }){
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState(null);
    const [loadingServices, setLoadingServices] = useState(false);
    const [nuevo, setNew] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [cantidad, setCantidad] = useState('1');
    const [valor, setValor] = useState('');
    const [form, setForm] = useState({
        name: '',
        description: ''
    });

    const dispatch = useDispatch();

    const searchServices = async () => {
        setLoadingServices(true);
        const send = await axios.get('/api/materia/services/search')
            .then((res) => {
                setServices(res.data);
            }).catch(err => {
                setServices(404);
                return err;
            })
            .finally(() => {
                setLoadingServices(false);
            });
        return send;
    };

    const newServicio = async () => {
        if (!form.name?.trim() || !form.description?.trim()) {
            return dispatch(actions.HandleAlerta('Completa nombre y descripción', 'mistake'));
        }
        setLoading(true);
        const body = {
            name: form.name.trim(),
            description: form.description.trim()
        };
        const sendCreate = await axios.post('/api/materia/service/new', body)
            .then((res) => {
                searchServices();
                dispatch(actions.HandleAlerta('Servicio creado con éxito', 'positive'));
                setForm({ name: '', description: '' });
                setNew(false);
                return res;
            })
            .catch(err => {
                dispatch(actions.HandleAlerta('No hemos logrado crear este servicio.', 'mistake'));
                return err;
            })
            .finally(() => {
                setLoading(false);
            });
        return sendCreate;
    };

    const addService = async () => {
        if (!number) {
            return dispatch(actions.HandleAlerta('Selecciona un área de la cotización antes de agregar el servicio', 'mistake'));
        }
        if (!selectedId) {
            return dispatch(actions.HandleAlerta('Selecciona un servicio de la lista', 'mistake'));
        }
        if (!cantidad || !valor) {
            return dispatch(actions.HandleAlerta('Ingresa cantidad y valor', 'mistake'));
        }
        setLoading(true);
        const body = {
            cotizacionId: number,
            servicioId: selectedId,
            cantidad,
            precio: valor
        };
        const sendCreate = await axios.post('/api/cotizacion/add/service/item', body)
            .then((res) => {
                dispatch(actions.axiosToGetCotizacion(false, cotizacion.id));
                dispatch(actions.HandleAlerta('Servicio anexado a la cotización', 'positive'));
                setCantidad('1');
                setValor('');
                setSelectedId(null);
                return res;
            })
            .catch(err => {
                dispatch(actions.HandleAlerta('No hemos logrado anexar este servicio.', 'mistake'));
                return err;
            })
            .finally(() => {
                setLoading(false);
            });
        return sendCreate;
    };

    useEffect(() => {
        searchServices();
    }, []);

    const lista = Array.isArray(services)
        ? services.filter((sv) => {
            if (!query.trim()) return true;
            const q = query.trim().toLowerCase();
            return (
                String(sv.name || '').toLowerCase().includes(q) ||
                String(sv.description || '').toLowerCase().includes(q)
            );
        })
        : [];

    const selected = Array.isArray(services)
        ? services.find((sv) => sv.id === selectedId)
        : null;

    const selectService = (sv) => {
        setSelectedId(sv.id);
        setNew(false);
        setCantidad('1');
        setValor('');
    };

    return createPortal(
        <div className="modal BIGGEST modalServiciosOverlay" style={{ zIndex: 999999 }}>
            <div className="hiddenModal" onClick={() => closeOpen()}></div>
            <div className="containerModal Small modalServiciosSheet" style={{ zIndex: 1000000 }}>
                <div className="modalServiciosHeader">
                    <div>
                        <h3>Agregar servicio</h3>
                        <p>Busca un servicio del catálogo e incorpóralo al área activa.</p>
                    </div>
                    <button type="button" className="modalServiciosClose" onClick={() => closeOpen()} aria-label="Cerrar">
                        <BsX />
                    </button>
                </div>

                {!number && (
                    <div className="modalServiciosAlert">
                        Selecciona un área en la cotización para poder anexar el servicio.
                    </div>
                )}

                <div className="modalServiciosToolbar">
                    <div className="modalServiciosSearch">
                        <BsSearch className="modalServiciosSearchIcon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className={`modalServiciosBtn ${nuevo ? 'isGhost' : 'isPrimary'}`}
                        onClick={() => {
                            setNew(!nuevo);
                            if (!nuevo) setSelectedId(null);
                        }}
                    >
                        {nuevo ? 'Ver catálogo' : (<><BsPlus /> Nuevo</>)}
                    </button>
                </div>

                <div className={`modalServiciosBody ${nuevo ? 'isCreate' : ''}`}>
                    <div className="modalServiciosListPane">
                        {nuevo ? (
                            <div className="modalServiciosCreate">
                                <h4>Crear servicio en catálogo</h4>
                                <p>Quedará disponible para esta y futuras cotizaciones.</p>
                                <label>
                                    Nombre
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Ej. Transporte"
                                    />
                                </label>
                                <label>
                                    Descripción
                                    <textarea
                                        rows={3}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Detalle breve del servicio"
                                    />
                                </label>
                                <div className="modalServiciosCreateActions">
                                    <button
                                        type="button"
                                        className="modalServiciosBtn isGhost"
                                        disabled={loading}
                                        onClick={() => {
                                            setNew(false);
                                            setForm({ name: '', description: '' });
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="modalServiciosBtn isPrimary"
                                        disabled={loading}
                                        onClick={() => { if (!loading) newServicio(); }}
                                    >
                                        {loading ? 'Creando...' : 'Crear servicio'}
                                    </button>
                                </div>
                            </div>
                        ) : loadingServices || !services ? (
                            <div className="modalServiciosEmpty">Cargando servicios...</div>
                        ) : services === 404 ? (
                            <div className="modalServiciosEmpty">No hay servicios en el catálogo.</div>
                        ) : lista.length === 0 ? (
                            <div className="modalServiciosEmpty">
                                {query.trim()
                                    ? `Sin resultados para “${query.trim()}”.`
                                    : 'No hay servicios para mostrar.'}
                            </div>
                        ) : (
                            <ul className="modalServiciosList">
                                {lista.map((sv) => (
                                    <li key={sv.id}>
                                        <button
                                            type="button"
                                            className={`modalServiciosItem ${selectedId === sv.id ? 'isActive' : ''}`}
                                            onClick={() => selectService(sv)}
                                        >
                                            <strong>{sv.name}</strong>
                                            <span>{sv.description || 'Sin descripción'}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {!nuevo && (
                        <div className="modalServiciosDetail">
                            {selected ? (
                                <>
                                    <div className="modalServiciosDetailHead">
                                        <span className="modalServiciosBadge">Seleccionado</span>
                                        <h4>{selected.name}</h4>
                                        <p>{selected.description || 'Sin descripción'}</p>
                                    </div>
                                    <div className="modalServiciosFields">
                                        <label>
                                            Cantidad
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={cantidad}
                                                onChange={(e) => setCantidad(e.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Valor total
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={valor}
                                                onChange={(e) => setValor(e.target.value)}
                                            />
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        className="modalServiciosBtn isPrimary modalServiciosSubmit"
                                        disabled={loading || !number}
                                        onClick={() => { if (!loading) addService(); }}
                                    >
                                        {loading ? 'Agregando...' : 'Agregar a cotización'}
                                    </button>
                                </>
                            ) : (
                                <div className="modalServiciosEmptyDetail">
                                    <h4>Elige un servicio</h4>
                                    <p>Selecciona uno de la lista para definir cantidad y valor.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
function PriceCotizacion(props) { 
    const kits = props.cotizacion;
    const superK = props.coti;

    const array =  kits ? kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion.precio), 0) : 0
    const ArrayDos = superK ? superK.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion.precio), 0) : 0

    let suma = Number(array) + Number(ArrayDos)
    // const array = !ktv ? 0 : ktv.kitCotizacion.reduce((acc, p) => Number(acc) + Number(p.precio), 0)
    // console.log(ktv)

    const descuentoArray =  kits ? kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion.descuento), 0) : 0
    const descuentoArrayDos = superK ? superK.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion.descuento), 0) : 0

    const descuentos = Number(descuentoArray) + Number(descuentoArrayDos)
    return (
        <div className="">
            <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(suma - descuentos).toFixed(0))} COP</span>
        </div>
    )
}
