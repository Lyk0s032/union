import React, { useEffect, useRef, useState } from "react";
import { OneElement } from "../calculo"; // Asegúrate que OneElement también esté corregida
import axios from "axios";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import { BsPencil, BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline, MdOutlineDeleteOutline } from "react-icons/md";

// [CORRECCIÓN]: El componente ahora itera sobre `kit.itemKits`
export default function Selected({ kit, openMenuId, toggleMenu, number, selectArea }) {
    const dispatch = useDispatch();
    const [fast, setFast] = useState(null);
    const [adding, setAdding] = useState(false);
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [codeSeg, setCodeSeg] = useState(null);
    const segmentoNameRef = useRef(null);
    const deleteItem = async (item) => { // [CORRECCIÓN]: Recibe el ID del itemKit
        const body = {
            itemKitId: item.id, // [CORRECCIÓN]: Enviamos el ID del itemKit al backend
            userId: user.user.id,
            kitId: kit.id,
            itemId: item.materium.id
        } 

        // La ruta del API debería ser algo como 'api/kit/item' para borrar por ID
        const sendPetion = await axios.delete('/api/kit/remove/item', { data: body })
            .then((res) => {
                dispatch(actions.axiosToGetKit(false, kit.id))
                dispatch(actions.HandleAlerta('Item removido', 'positive'))
            })
            .catch(err => {
                console.log(err);
                dispatch(actions.HandleAlerta('No hemos logrado remover este item', 'mistake'))
            })
        return sendPetion;
    }


    // Nuevo segmento
    const changeNameSegmento = async (name, areaId) => {
        if(!name) return dispatch(actions.HandleAlerta('Debes ingresar nombre al segmento', 'mistake'))
        const body = {
            areaId,
            name,
            userId: user.user.id
        }
        setAdding(true);
        const send = await axios.put('/api/kit/add/segmento', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('¡Nombre actualizado!', 'positive'))
            dispatch(actions.axiosToGetKit(false, kit.id))
            setCodeSeg(null)
            return res
        }).catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado actualizar este segmento, intentalo más tarde', 'mistake'))
            return err
        })
        .finally(e => {
            setAdding(false)
            return e;
        })
        return send;
    }

    const deleteSegmento = async (areaId) => {
        if(!areaId) return dispatch(actions.HandleAlerta('Debes ingresar nombre al segmento', 'mistake'))

        const send = await axios.delete(`/api/kit/segmento/delete/segmento/${areaId}`)
        .then((res) => {
            dispatch(actions.HandleAlerta('¡Segmento eliminado!', 'positive'))
            dispatch(actions.axiosToGetKit(false, kit.id))
            console.log('pasa')
            return res
        }).catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado eliminar este segmento, intentalo más tarde', 'mistake'))
            return err
        })
        .finally(e => {
            return e;
        })
        return send;
    }
    const AlPadre = (val) => {
        setFast(val)
    }

    useEffect(() => {
        if(codeSeg && segmentoNameRef.current){
            segmentoNameRef.current.focus()
        }
    }, [codeSeg])
    return (
        <div>
            {
                    kit.areaKits?.length ?
                        kit.areaKits.map((ar, i) => {
                            return (
                                <div className={number == ar.id ? "segmentoKits Active" : "segmentoKits"} key={i+1} 
                                onDoubleClick={() => {
                                    if(number == ar.id){
                                        selectArea(null)
                                    }else{
                                        selectArea(ar.id)
                                    }
                                }}>
                                    <div className="titleTopSegmento">
                                        <div className="titleThis" onClick={() => setCodeSeg(ar.id)}>
                                            {
                                                codeSeg && ar.id == codeSeg ?
                                                    <input type="text" ref={segmentoNameRef} defaultValue={ar.name} onBlur={() => setCodeSeg(null)} 
                                                    onKeyDown={(e) => {
                                                        if(e.code == 'Enter'){
                                                            changeNameSegmento(e.target.value, ar.id)
                                                        }
                                                    }}/>
                                                :
                                                <h3>{ar.name}</h3>
                                            }
                                        </div>
                                        <div className="optionsTitleThis">
                                            <nav>
                                                <ul>
                                                    <li>
                                                        <div>
                                                            <button style={{zIndex:5,background: 'transparent', borderWidth:0}}
                                                            onClick={() => deleteSegmento(ar.id)}>
                                                                <span style={{fontSize:16}}><MdOutlineDeleteOutline /></span>
                                                            </button>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>

                                    <div className="AllElementsHere">
                                        <div className="data">
                                            <table>
                                                <tbody>
                                            {
                                                // [CORRECCIÓN]: Iteramos sobre kit.itemKits en lugar de kit.materia
                                                kit.itemKits && kit.itemKits.length ?
                                                    kit.itemKits.map((item, i) => { // 'item' es el objeto completo de itemKit
                                                        return (
                                                            item.areaId == ar.id ? 
                                                                fast == item.id ?
                                                                    <ToFastEdit key={item.id} kit={kit} item={item} ParaElHijo={AlPadre} />
                                                                :
                                                                <tr key={i+1}>
                                                                    {/* [CORRECCIÓN]: Accedemos a los datos anidados */}
                                                                    <td className="larger">
                                                                        <div className="codeAndName">
                                                                                {item.id}
                                                                            <h3><span>{item.materium.id}</span> -  {item.materium.description}</h3>
                                                                        </div> 
                                                                    </td>
                                                                    <td onClick={() => {
                                                                        toggleMenu(item.id)
                                                                        setFast(item.id);
                                                                    }} className="edit">
                                                                        <div className="howMany">
                                                                            <strong>{item.medida} <span>{item.materium.unidad}</span></strong>
                                                                        </div>
                                                                    </td> {/* Medida del consumo */}
                                                                    <td className="edit">
                                                                        <h3>{<ValorSelected item={item} />}</h3>
                                                                    </td>
                                                                    <td className="option">
                                                                        <div className="menu-containerSelected">
                                                                            <button className="btnOptions" onClick={() => toggleMenu(item.id)}>
                                                                                <BsThreeDots className="icon" />
                                                                            </button>
                                                                            {openMenuId === item.id && (
                                                                                <div className="menu-dropdown">
                                                                                    <div className="panel">
                                                                                        <strong>Opciones rápidas</strong><br /><br />
                                                                                        <nav>
                                                                                            <ul>
                                                                                                <li onClick={() => setFast(item.id)}>
                                                                                                    <div>
                                                                                                        <BsPencil className="icon" />
                                                                                                        <span>Editar</span>
                                                                                                    </div>
                                                                                                </li>
                                                                                                {/* [CORRECCIÓN]: Pasamos el id del itemKit para eliminar */}
                                                                                                <li onClick={() => deleteItem(item)}>
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
                                                            : null
                                                        )
                                                    })
                                                    : null
                                            }
                                            </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    : null
                }
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th> {/* Título cambiado para mayor claridad */}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    
                    {
                        // [CORRECCIÓN]: Iteramos sobre kit.itemKits en lugar de kit.materia
                        kit.itemKits && kit.itemKits.length ?
                            kit.itemKits.map((item, i) => { // 'item' es el objeto completo de itemKit
                                return (
                                    !item.areaId ?
                                    fast === item.id ?
                                        <ToFastEdit key={item.id} kit={kit} item={item} ParaElHijo={AlPadre} />
                                        :
                                        <tr key={i+1}>
                                            {/* [CORRECCIÓN]: Accedemos a los datos anidados */}
                                            <td className="larger">
                                                <div className="codeAndName">
                                                    
                                                    <h3><span>{item.materium.id}</span> -  {item.materium.description}</h3>
                                                </div>
                                            </td>
                                            <td onClick={() => {
                                                toggleMenu(item.id)
                                                setFast(item.id);
                                            }} className="edit">
                                                <div className="howMany">
                                                    <strong>{item.medida} <span>{item.materium.unidad}</span></strong>
                                                </div>
                                            </td> {/* Medida del consumo */}
                                            <td className="edit">
                                                <h3>{<ValorSelected item={item} />}</h3>
                                            </td>
                                            <td className="option">
                                                <div className="menu-containerSelected">
                                                    <button className="btnOptions" onClick={() => toggleMenu(item.id)}>
                                                        <BsThreeDots className="icon" />
                                                    </button>
                                                    {openMenuId === item.id && (
                                                        <div className="menu-dropdown">
                                                            <div className="panel">
                                                                <strong>Opciones rápidas</strong><br /><br />
                                                                <nav>
                                                                    <ul>
                                                                        <li onClick={() => setFast(item.id)}>
                                                                            <div>
                                                                                <BsPencil className="icon" />
                                                                                <span>Editar</span>
                                                                            </div>
                                                                        </li>
                                                                        {/* [CORRECCIÓN]: Pasamos el id del itemKit para eliminar */}
                                                                        <li onClick={() => deleteItem(item)}>
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
                                    : null
                                )
                            })
                            : null
                    }
                </tbody>
            </table>
        </div>
        
    )
}

// [CORRECCIÓN]: El componente ahora recibe el 'item' completo
function ToFastEdit({ item, ParaElHijo, kit }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(null);
    
    // [CORRECCIÓN]: Leemos los datos desde la estructura correcta
    const [form, setForm] = useState({
        medida: item.medida || '',
        cantidad: item.cantidad || 1,
    });
    
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const inputRef = useRef(null);
    const HandleClose = () => ParaElHijo(null);

    const updateKit = async () => {
        // ... (Tu lógica de validación)
        setLoading(true);
        let body = {
            itemKitId: item.id, // Enviamos el ID del itemKit para actualizar
            medida: form.medida,
            kitId: kit.id,
            materiaId: item.materium.id,
            cantidad: form.cantidad,
            userId: user.user.id
        }

        // La ruta del API debería ser algo como 'api/kit/update/item'
        const sendPetion = await axios.put('api/kit/add/item', body)
            .then(() => { 
                dispatch(actions.axiosToGetKit(false, kit.id));
                dispatch(actions.HandleAlerta('Item actualizado con éxito', 'positive'));
                HandleClose()
            })
            .catch(err => {
                console.log(err);
                dispatch(actions.HandleAlerta('No hemos logrado actualizar este item', 'mistake'));
            }) 
            .finally(() => {
                setLoading(false);
                HandleClose();
            });
        return sendPetion;
    }

    useEffect(() => {
        inputRef.current.focus();
    }, [])
    return (
        <tr> 
            <td className="larger">
                <div className="codeAndName">
                                                
                   <h3><span>{item.materium.id}</span> -  {item.materium.description}</h3>
                </div>
            </td>
            <td className="edit">
                <div className="medida">
                    <input type="text" ref={inputRef} onChange={(e) => setForm({ ...form, medida: e.target.value })} value={form.medida} 
                    onKeyDown={(e)  => {
                        if(e.code == 'Enter' || e.code == 'NumpadEnter'){
                            !loading ? updateKit() : null
                        }
                    }} onBlur={() => HandleClose()}/>
                </div>
            </td>
            <td className="edit">
                {loading ? <span>Actualizando...</span> : <span>Enter para confirmar</span>}
            </td>
            <td></td>
        </tr>
    )
}

// [CORRECCIÓN]: El componente ahora recibe el 'item' completo
function ValorSelected({ item }) {
    // [CORRECCIÓN]: Le pasamos el 'item' completo a OneElement.
    // Asegúrate de que la función OneElement en calculo.js también esté corregida
    // para recibir el 'item' completo, igual que corregimos getPromedio.
    const valor = OneElement(item);
    return (
        <span>{new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valor).toFixed(0))}</span>
    )
}