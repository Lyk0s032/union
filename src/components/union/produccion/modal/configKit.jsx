import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { MdCheckCircle, MdClose, MdNotes, MdOutlineTextsms, MdOutlineTipsAndUpdates, MdTextDecrease } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';

export default function ConfigKit({ kit }){
    const [params, setParams] = useSearchParams();
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const system = useSelector(store => store.system);
    const { lineas, categorias, extensiones } = system;
    const nameRef = useRef(null);

    const [form, setForm] = useState({
        kitId: kit.id,
        nombre: kit.name,
        description: kit.description,
        categoriumId: kit.categoriumId,
        extensionId: kit.extensionId,
        lineaId: kit.lineaId,
        userId: user.user.id
    });

    const [focus, setFocus] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleUpdateKit = async () => {
        try {
          setLoading(true); // Inicia loading
            
          const response = await axios.put('/api/kit/new', form)
          .then(res => {
            dispatch(actions.axiosToGetKits(false))
            dispatch(actions.axiosToGetKit(false, kit.id))
            dispatch(actions.HandleAlerta('Actualizado con exito', 'positive'))
            setFocus(null);
            return res
          })
          return response
       
          // Puedes cerrar el formulario o recargar datos aquí si es necesario
        } catch (error) {
          console.error('Error al actualizar el kit:', error);
        } finally {
          setLoading(false); // Termina loading
        }
    };

    useEffect(() => {
        if(focus){
            nameRef.current.focus();  
        }
    }, [focus])
    return (
        <div className="modal Superior">
            <div className="hiddenModal" onClick={() => {
                params.delete('update');
                setParams(params);
            }}></div>
            <div className="containerModal Zoom">
                <div className="headerConfiguration">
                    <div className="divideHeader">
                        <div className="titleHeader">
                            <h3>Configuración</h3>
                        </div>
                        <div className="optionsConfiguration">
                            <nav>
                                <ul>
                                    <li>
                                        <div>
                                            <button onClick={() => {
                                                params.delete('update');
                                                setParams(params);
                                            }}>
                                                <MdClose className="icon" />
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </nav>                            
                        </div>
                    </div>
                </div>
                <div className="bodyModalConfiguration">
                    <div className="containerBodyModal">
                        <div className="divideModal">
                            <div className="leftBasicOptions">
                                <div className="topTitle">
                                    <MdCheckCircle className="icon" />
                                    {
                                        !focus ?
                                            <h3 onClick={() => setFocus(true)}>{kit.name}</h3>
                                        :
                                        <div className="inputDiv">
                                            <input type="text" ref={nameRef} onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    nombre: e.target.value
                                                })
                                            }} value={form.nombre} onBlur={() => setFocus(null)} 
                                            onKeyDown={(e) => {
                                                if(e.key == 'Enter'){
                                                    handleUpdateKit()
                                                }
                                            }} />
                                        </div>
                                    }
                                </div>
                                <div className="optionsModalConfigurationBody">
                                    <div className="titleHere">
                                        <MdOutlineTipsAndUpdates className="icon" />
                                        <span>Conexiones</span><br />
                                    </div>
                                    <nav>
                                        <ul>
                                            <li>
                                                <div>
                                                    <select
                                                    id="categoriumId"
                                                    value={form.categoriumId}
                                                    onChange={(e) => setForm({ ...form, categoriumId: Number(e.target.value) })}
                                                    >
                                                        {
                                                            categorias.map((ex, i) => {
                                                                return (
                                                                    ex.type == 'comercial' ?
                                                                        <option value={ex.id} key={i+1}>{ex.name}</option>
                                                                    : null
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <select
                                                    id="lineaId"
                                                    value={form.lineaId}
                                                    onChange={(e) => setForm({ ...form, lineaId: Number(e.target.value) })}
                                                    >
                                                        {
                                                            lineas.map((ex, i) => {
                                                                return (
                                                                    ex.type == 'comercial' ?
                                                                        <option value={ex.id} key={i+1}>{ex.name}</option>
                                                                    : null
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <select
                                                    id="extensionId"
                                                    value={form.extensionId}
                                                    onChange={(e) => setForm({ ...form, extensionId: Number(e.target.value) })}
                                                    >
                                                        {
                                                            extensiones.map((ex, i) => {
                                                                return (
                                                                    <option value={ex.id} key={i+1}>{ex.name.toUpperCase()}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="descriptionKitConfiguration">
                                    <div className="titleConfiguration">
                                        <MdNotes className="icon" />
                                        <span>Descripción</span>
                                    </div>
                                    <div className="inputDiv">
                                        <textarea name="" id=""
                                        onChange={(e) => {
                                            setForm({
                                                ...form,
                                                description: e.target.value
                                            })
                                        }} value={form.description}></textarea>
                                        <div className="optionsBottons">
                                            <button onClick={() => {
                                                if(!loading){
                                                    handleUpdateKit()
                                                }
                                            }}>
                                                <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rightMovements">
                                <div className="containerMovements">
                                    <div className="headerAndTitleMovements">
                                        <div className="divideText">
                                            <MdOutlineTextsms className="icon" />
                                            <span>Registro de actividad</span>
                                        </div>
                                        <div className="sendMessageOrRegister">
                                            <label htmlFor="">Ingresar nota</label><br />
                                            <textarea name="" id="" placeholder='Escribe aquí'></textarea>
                                        </div>
                                    </div>
                                    <div className="registersDetails">
                                        <div className="containerDetails">
                                            <div className="detailItem">
                                                <div className="divideItemDetails">
                                                    <div className="logoItemDetail">
                                                        <h3>
                                                            KB
                                                        </h3>
                                                    </div>
                                                    <div className="dataDetailsItem">
                                                        <div className="note">
                                                            <h3>Kevin Andres</h3>
                                                           <span>4, Jul 2025, 14:38</span>
                                                        </div>
                                                        <div className="time">
                                                             <span>Ha ingresado <strong>LAMINA AX# al KIT</strong></span>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}