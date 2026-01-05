import axios from 'axios';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function ModalChangeCalibre(){
    const [word, setWord] = useState('');
    const [resultados, setResultados] = useState(null);
    const [calibre, setCalibre]= useState(null);
    const [params, setParams] = useSearchParams();
    const kits = useSelector(store => store.kits);
    const { kit, loadingKit } = kits;
    const dispatch = useDispatch();
    const search = async (query) => {
        try {
            if (!query || query.trim() === '') {
                setResultados([]);
                return;
            }

            const res = await axios.get('/api/materia/searchByQuery', {
                params: { q: query }
            });

            setResultados(res.data);
            return res.data;

        } catch (err) {
            console.error(err);
            setResultados([]);
        }
    };

    const [loading, setLoading] = useState(false);
    const updateCalibreToItemToKit = async () => {
        try {
            if (!calibre) return;
            setLoading(true);
            let body = {
                calibreId: calibre,
                itemKitId: params.get('almacen')
            } 
            await axios.put('/api/kit/update/item/calibre', body);
            dispatch(actions.axiosToGetKit(false, kit.id)); 
            dispatch(actions.HandleAlerta('Calibre actualizado correctamente', 'positive'));

        } catch (err) {
            dispatch(actions.HandleAlerta('No hemos logrado actualizar calibre', 'mistake'));
            console.error(err);
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className="modal" style={{zIndex:8}}>
            <div className="hiddenModal"  onClick={() => {
                params.delete('almacen');
                setParams(params);
            }}></div>
            <div className="containerModal ">
                <div className="top">
                    <h3>Selecciona item para inventario {calibre}</h3>
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
                                                    if(calibre == res.id){
                                                        setCalibre(null)
                                                    } else {
                                                        setCalibre(res.id)
                                                    }
                                                }}>
                                                    <td style={{width:'auto'}}><span style={{fontSize:14}}>{res.item}</span></td>
                                                    <td style={{width:'80%'}}><span style={{fontSize:14}}>{res.description}</span></td>
                                                    <td><span style={{fontSize:14}}>{res.id}</span></td> 
                                                </tr>
                                            )
                                        })
                                    : <span>No hay resultados</span>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="bottomConfirm">
                        {
                            calibre ?
                                <button onClick={() => {
                                    if(loading) return;
                                    updateCalibreToItemToKit();

                                }}>
                                    <span>{loading ? 'Cargando...' : 'Confirmar'}</span>
                                </button>
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}