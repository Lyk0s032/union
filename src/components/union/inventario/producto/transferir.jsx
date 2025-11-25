import React, { useState } from 'react';
import FormItemTransferir from './formItemTransferir';
import ItemMovimiento from './itemMovimiento';
import ItemTransferirMovimiento from './transferencias/itemTrans';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as actions from '../../../store/action/action';
import { useSearchParams } from 'react-router-dom';

export default function Transferir({ item, close }){
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    const [anexados, setAnexados] = useState([]);

    const anexar = (data) => {
        setAnexados([...anexados, data])
    }

    const removeAnexado = (item) => {
        const filter = anexados.filter(i => i != item);
        setAnexados(filter)
    }
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(false);

    const refreshAll = () => {
        // dispatch(actions.axiosToGetItemMateriaPrima(false, params.get('item')))
        setAnexados([])
        close()
    }
    const definitivaSend = async (array) => {
        const arrayMapa = array;
        setLoading(true);
        arrayMapa.map(async data => {
            let body = data
            console.log('transferencia',body)
            const sendRegister = await axios.post('/api/inventario/post/bodega/moviemitos/add', body)
            .then(res => {
                console.log(res);
                dispatch(actions.HandleAlerta('Transacción exitosa', 'positive'))
                setStatus(true)
                return res.data
            })
            .catch(err => {
                console.log(err);
                setStatus(false)
            })
            .finally(() => setLoading(false))

            return sendRegister
        }) 
        refreshAll();
    }
    return (
        <div className="componenteTransferir">
            <h3 onDoubleClick={() => close()}>Transferir</h3>
            <span>Recuerda la importancia de validar todos estos movimientos dentro de tu inventario físico.</span><br />


            <table>
                <thead>
                    <tr>
                        <th>
                            <div>
                                De
                            </div>
                        </th>
                        <th>
                            <div>
                                Para
                            </div>
                        </th>
                        <th>
                            <div>Proyecto</div>
                        </th>
                        <th>
                            <div>
                                Cantidad
                            </div>
                        </th>
                        <th>
                            <div>
                                Descripción
                            </div>
                        </th>
                        <th>
                        </th>
                    </tr>
                    
                </thead>
                <tbody>
                    <FormItemTransferir item={item} anexar={anexar} />
                </tbody>
            </table><br /><br /><br /><br /><br />


            <div className="anexado">
                <div className="titleAnexado">
                    <h3>Movimientos anexados</h3>
                </div>
                <div className="resultAnexados">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <div>
                                        Cantidad
                                    </div>
                                </th>
                                <th>
                                    <div>
                                        De
                                    </div>
                                </th>
                                <th>
                                    <div>Para</div>
                                </th>
                                <th>
                                    <div>
                                        Proyecto
                                    </div>
                                </th>
                                <th>
                                    <div>
                                        Descripción
                                    </div>
                                </th>
                                <th>
                                </th>
                            </tr>
                            
                        </thead>
                        <tbody>
                            {
                                anexados?.length ?
                                    anexados.map((a, i) => {
                                        return (
                                            <ItemTransferirMovimiento movimiento={a} clean={removeAnexado} key={i+1} />
                                        )
                                    })
                                : null
                            }
                        </tbody>
                    </table>
                    <br /><br />
                    <button onClick={() => { !loading ? definitivaSend(anexados) : null }}>
                        <span>
                            {
                                loading ? 'Enviando' : 'Confirmar'
                            }
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}