import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPromedio } from "./calculo";
import { useDispatch } from "react-redux";
import * as actions from '../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import AreYouSecure from "./modal/secure";
import axios from "axios";

export default function KitItem(props){
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(false); 
    const [remove, setRemove] = useState(false);
    const kit = props.kit;

    const dispatch = useDispatch();

    const handleDeleteKit = async (kitId) => {
        try {
          setLoading(true); // Activa loading
          const send = await axios.delete(`/api/kit/delete/${kitId}`)
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
          const response = await axios.get(`/api/kit/clone/${kitId}`)
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
                dispatch(actions.getKit(kit))
                params.set('w', 'newKit')
                setParams(params);
            }}>{kit.name.toUpperCase()}</td>
            <td style={{fontSize:11}}>{kit.categorium ? kit.categorium.name.toUpperCase() : 'SIN CATEGORíA'}</td>
            <td style={{fontSize:11}}>{kit.linea ? kit.linea.name.toUpperCase() : 'SIN CATEGORíA'}</td>
            <td style={{fontSize:11}}>{kit.extension ? kit.extension.name.toUpperCase() : 'SIN CATEGORíA'}</td>
            {/* <td style={{fontSize:11}}>{kit.materia ? <GetSimilarPrice materia={kit.materia} /> : null}</td> */}
            <td className="btnKits">
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

function  GetSimilarPrice(props){
    const consumir = props.materia;
    const [valor, setValor] = useState(0) 

    const mapear = () => {
        const a = consumir.map((c, i) => {
            const getV  =  getPromedio(c);
            return getV
        })
        const promedio = a && a.length ? Number(a.reduce((acc, p) => Number(acc) + Number(p), 0)) : null
        
        return setValor(promedio);
    } 

    useEffect(() => {
        mapear()
    }, [])
    return (
        <div className="similarPrice">
            <span>{valor > 0 ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor.toFixed(0)) : 0} COP</span>
        </div>
    )
}