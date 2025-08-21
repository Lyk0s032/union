import axios from 'axios';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ModalCalibre({ onEnviarValor }){
    const [word, setWord] = useState('');
    const [resultados, setResultados] = useState(null);
    const [calibre, setCalibre]= useState(null);
    const [params, setParams] = useSearchParams();

    const search = async (query) => {
        const response = await axios.get('api/materia/searching', {
            params: { q: query }
        })
        .then((res) => {
            console.log('yes') 
            setResultados(res.data)
        })
        .catch(err => {
            console.log(err);
        })
        return response;
    }

    const enviarValor = async  () => {
        await onEnviarValor(calibre);
        params.delete('almacen');
        return setParams(params);
    }
    return (
        <div className="modal" style={{zIndex:8}}>
            <div className="hiddenModal"  onClick={() => {
                params.delete('almacen');
                setParams(params);
            }}></div>
            <div className="containerModal ">
                <div className="top">
                    <h3>Selecciona item para inventario</h3>
                </div>
                <div className="bodyModal">
                    <div className="topSearch">
                        <input type="text" placeholder='Buscar item aquí' onChange={(e) => {
                            setWord(e.target.value);
                            search(e.target.value)
                        }} />
                    </div>
                    <div className="containerResults">
                        <table className="results">
                            <tbody>
                                {
                                    resultados && resultados.length ?
                                        resultados.map((res,i ) => {
                                            return(
                                                <tr className={calibre == res.id ? 'Active' : null} key={i+1}
                                                onClick={() => {
                                                    setCalibre(res.id)
                                                }}>
                                                    <td ><span>{res.item}</span></td>
                                                    <td><span>{res.description}</span></td>
                                                    <td><span>XX</span></td> 
                                                </tr>
                                            )
                                        })
                                    : <span>No hay resultados</span>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="bottomConfirm">
                        <button onClick={enviarValor}>
                            <span>Confirmar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}