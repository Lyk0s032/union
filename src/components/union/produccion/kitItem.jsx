import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPromedio } from "./calculo";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import AreYouSecure from "./modal/secure";
import axios from "axios";

export default function KitItem(props){
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(false); 
    const [remove, setRemove] = useState(false);
    const kit = props.kit;

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario; 
            
    const dispatch = useDispatch();


    const handleDeleteKit = async (kitId) => {
        try {
          setLoading(true); // Activa loading
          const send = await axios.delete(`/api/kit/delete/${kitId}/${user.user.id}`)
          .then((res) => {
            setRemove(false)
            dispatch(actions.axiosToGetKits(false))
            return res
          })
            return send
        } catch (error) {
          console.error("Error al eliminar el kit:", error);
        } finally {
          setLoading(false); // Finaliza loading, pase lo que pase
        }
    };

    const handleCloneKit = async (kitId) => {
        try { 
          setLoading(true); // Inicia el loading
          const response = await axios.get(`/api/kit/clone/${kitId}/${user.user.id}`)
          .then(res => {
            dispatch(actions.axiosToGetKits(false));
            return res;
          })
          
          console.log("Kit duplicado:", response.data);
          // Aquí podrías volver a cargar la lista si es necesario
        } catch (error) {
          console.error("Error al duplicar el kit:", error);
        } finally {
          setLoading(false); // Finaliza el loading
        }
    };
    return (
        <tr>
            <td onClick={() => {
                dispatch(actions.axiosToGetKit(true, kit.id))
                params.set('w', 'newKit')
                setParams(params);
            }}>{kit.id}</td>
            <td onClick={() => {
                dispatch(actions.axiosToGetKit(true, kit.id))
                params.set('w', 'newKit')
                setParams(params);
            }}>{kit.name.toUpperCase()}</td>
            <td style={{fontSize:11}}>{kit.categorium ? kit.categorium.name.toUpperCase() : 'SIN CATEGORíA'}</td>
            <td style={{fontSize:11}}>{kit.linea ? kit.linea.name.toUpperCase() : 'SIN CATEGORíA'}</td>
            <td style={{fontSize:11}}>{kit.extension ? kit.extension.name.toUpperCase() : 'SIN CATEGORíA'}</td>
            <td style={{fontSize:11}}>{kit.itemKits && kit.itemKits.length > 0 ? <GetSimilarPrice items={kit.itemKits} /> : null}</td>            <td className="btnKits">
                {
                    loading ?
                    <div className="basic">
                        <span>Cargando...</span>
                    </div> 
                    :
                    remove ?
                        <div className="basic">
                            <button className="edit" onClick={() => setRemove(null)}>
                                <span>No</span>
                            </button>
                            <button id={kit.id} className="rem" onClick={() => handleDeleteKit(kit.id)}>
                                <span>Si</span>
                            </button>
                        </div>
                    :
                    <div className="basic">
                        <button className="edit" onClick={() => handleCloneKit(kit.id)}>
                            <MdOutlineContentCopy className="icon" />
                        </button>
                        <button id={kit.id} className="rem" onClick={() => {
                            setRemove(true)
                        }}>
                            <MdDeleteOutline className="icon" />
                        </button>
                    </div>
                }

            </td>
            {/* <td>
                <button onClick={() => {
                    params.set('w', 'updateMp');
                    setParams(params);
                }}>
                    <span>Editar</span>
                </button>
            </td> */}

        </tr>
    )
}

function GetSimilarPrice(props) {
    // 1. Ahora recibimos 'items' en lugar de 'materia'
    const consumir = props.items; 
    const [valor, setValor] = useState(0);

    const mapear = () => {
        // Nos aseguramos de que 'consumir' no sea nulo o vacío
        if (!consumir || consumir.length === 0) {
            setValor(0);
            return;
        }

        // 2. Mapeamos el arreglo 'itemKits' y accedemos a 'item.materia' en cada iteración
        const sumaDePromedios = consumir
            .map(item => getPromedio(item)) // <-- ¡Este es el cambio principal!
            .reduce((acc, p) => acc + Number(p), 0);

        setValor(sumaDePromedios);
    } 

    useEffect(() => {
        mapear();
    }, [consumir]); // La dependencia sigue siendo la misma variable

    return (
        <div className="similarPrice">
            <span>{valor > 0 ? new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(valor.toFixed(0)) : 0} COP</span>
        </div>
    );
}