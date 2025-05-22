import React, { useState } from "react";
import { OneElement } from "../calculo";
import axios from "axios";
import * as actions from '../../../store/action/action';
import { useDispatch } from "react-redux";
import { BsPencil, BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

export default function Selected({kit, openMenuId, toggleMenu}){
    const dispatch = useDispatch();
    const [fast, setFast] = useState(null);
    const deleteItem = async (itemId) => {
        const body = {
            kitId: kit.id, 
            itemId: itemId
        }

        const sendPetion = await axios.delete('api/kit/remove/item', { data: body} )
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

    const AlPadre = (val) => {
        setFast(val)
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Medida</th>
                    <th>Uni.</th>
                    <th>Val</th>
                    <th></th>

                </tr>
            </thead>
            <tbody>
                {
                    kit.materia && kit.materia.length ?
                        kit.materia.map((materia, i) => {
                            return (
                                fast == materia.id ?
                                    <ToFastEdit kit={kit} materia={materia} ParaElHijo={AlPadre} mt={materia} />
                                :
                                <tr key={i+1}>
                                    <td>{materia.id}</td>
                                    <td>{materia.description}</td>
                                    <td>{materia.itemKit.medida}</td>
                                    <td>
                                        {materia.unidad}
                                    </td>
                                    <td> 
                                        <strong>{<ValorSelected mt={materia} />}</strong>
                                    </td>
                                    <td className="option">
                                        <div className="menu-containerSelected">
                                            <button className="btnOptions"
                                                onClick={() => toggleMenu(materia.id)}
                                                aria-haspopup="true" // Indica que es un botón que abre un menú
                                                aria-expanded={openMenuId === materia.id} // Indica si el menú está abierto
                                                aria-label="Opciones del elemento"
                                            >
                                                {/* Icono de tres puntos */}
                                                <BsThreeDots className="icon" />
                                            </button>
                                            {openMenuId === materia.id && ( // Renderizado condicional para mostrar/ocultar
                                                <div 
                                                    className="menu-dropdown" role="menu"
                                                    aria-orientation="vertical"
                                                    aria-labelledby={`menu-button-${materia.id}`}>

                                                    <div className="panel">
                                                        <div className="title">
                                                            <strong>Opciones rápidas</strong>
                                                        </div>
                                                        <nav>
                                                            <ul>
                                                                <li onClick={() => {
                                                                    toggleMenu(materia.id)
                                                                    setFast(materia.id);
                                                                }}> 
                                                                    <div>
                                                                        <BsPencil className="icon" />
                                                                        <span>Editar</span>
                                                                    </div>
                                                                </li>
                                                                <li  onClick={() => deleteItem(materia.id)}> 
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
                        })
                    : null
                }


            </tbody>
        </table>
    )
}

function ToFastEdit({materia, ParaElHijo, mt, kit}){

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(null);
    const [form, setForm] = useState({
        mt2: materia.unidad == 'mt2' ? Number(Number(materia.medida.split('X')[0]) * Number(materia.medida.split('X')[1])) : '1',
        other: materia.unidad != 'mt2' ? materia.medida : materia.medida,
        cantidad: materia.cantidad ? materia.cantidad : 0,
        kg: materia.medida 
    });

    
    const HandleClose = () => {
        ParaElHijo(null)
    }
 
    const updateKit = async () => {
        if(materia.unidad == 'mt2' && !form.mt2) return dispatch(actions.HandleAlerta('Ingresa una medida', 'mistake')) 
        if(materia.unidad == 'kg' &&!form.kg) return dispatch(actions.HandleAlerta('Ingresa una medida', 'mistake'))        
        setLoading(true)
        let body = {
            kitId: kit.id,
            materiaId: materia.id,
            medida: materia.unidad == 'mt2' ? form.mt2 : materia.unidad == 'kg' ? form.kg : form.other
        }

        const sendPetion = await axios.put('api/kit/add/item', body )
        .then((res) => {
            dispatch(actions.axiosToGetKit(false, kit.id))
            dispatch(actions.axiosToGetPrimas(false))
            dispatch(actions.HandleAlerta('Item agregado con éxito', 'positive'))

        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado agregar este item', 'mistake'))
        })
        .finally((y) => {
            setLoading(false)
            HandleClose()
        }) 
        return sendPetion; 
    }
    return (
        <tr className="forEdit">
            <td>{materia.id}</td>
            <td>{materia.description}</td>
            <td>
                {
                    materia.unidad == 'mt2' ? 
                        <div className="medida">
                            <input type="text"id="one" onChange={(e) => {
                                setForm({
                                    ...form,
                                    mt2:  `${e.target.value}`
                                })
                            }} value={form.mt2}/>
                            {/* <h3>x</h3>
                            <input type="text" onChange={(e) => {
                                setForm({
                                    ...form,
                                    mt2:  `${form.mt2.split('X')[0]}X${e.target.value}`
                                })
                            }} value={form.mt2.split('X')[1]}/> */}
                        </div>
                    :
                        <div className="medida">
                            {
                                materia.unidad == 'kg' ?
                                <input type="text" onChange={(e) => {
                                    setForm({
                                        ...form,
                                        kg: e.target.value
                                    })
                                }} value={form.kg}/>
                                :
                                <input type="text" onChange={(e) => {
                                    setForm({
                                        ...form,
                                        other: e.target.value
                                    })
                                }} value={form.other}/>
                            }
                        </div>
                }
            </td>
            {
                loading ?
                <td>
                    <span>Actualizando...</span>
                </td>
                :
                <td>
                    <button onClick={() => updateKit()} className="ok">
                        <span>Confirmar</span>
                    </button>
                </td>
            }
            {
                loading ?
                null: 
                <td>
                    <button onClick={() => HandleClose()} className="cancel">
                        <span>Cancelar</span>
                    </button>
                </td> 
            }
        </tr>
    )
}
function ValorSelected(props){
    const mt = props.mt;
    const valor = OneElement(mt) 
    return (
        mt.unidad == 'kg' ?
        <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor).toFixed(0))}</span>
        :
        <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor).toFixed(0))}</span>
    )
}