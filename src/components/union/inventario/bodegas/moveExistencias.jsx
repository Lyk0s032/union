import dayjs from 'dayjs';
import React, { useState } from 'react';
import ItemToActive from './itemToMove';
import { useSearchParams } from 'react-router-dom';
import ItemToSelected from './itemSelected';
import axios from 'axios';

export default function ZoneForMoveItem({productos, loading}){
    const [params, setParams] = useSearchParams();
    const [move, setMove] = useState([])
    const [loadingAdd, setLoading] = useState(false);
    const addtoMove = async (add) => {
        setMove([...move, add])
    }

    const deleteThat = (data) => {
        const nuevoArray = move.filter(m => m != data);
        setMove(nuevoArray) 
    }

    const handleAddMateria = async () => {
        setLoading(true)
        await definitivaSend(move)
        setMove([])
        setLoading(false)
    }

    const definitivaSend = async (array) => {
        const arrayMapa = array;
        arrayMapa.map(async data => {
            let body = data
            const sendRegister = await axios.post('/api/inventario/post/bodega/addHowMany', body)
            .then(res => {
                return res.data
            })
            .catch(err => {
                console.log(err);
            })

            return sendRegister
        })
    }
    return (
        <div className="tableData">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Cantidad</th>
                        <th>Comprometida</th>
                        <th></th>
        
                    </tr>
                </thead> 
                <tbody>
                    {
                        !productos || loading ? null
                        : 
                        productos?.length ? 
                            productos.map((pt, i) => {
                                return (
                                    <ItemToActive pt={pt}  addtoMove={addtoMove} key={i+1}/>
                                )
                            })
                            :null
                    }
        
                </tbody>
                <br /><br /><br /><br />
                {move.length ? <>
                    <h3>Seleccionado</h3>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Actual</th>
                            <th>Mover</th>
            
                        </tr>
                    </thead> 
                    <tbody>
                        {
                            move?.length ? 
                                move.map((pt, i) => {
                                    console.log(pt)
                                    return (
                                        <ItemToSelected pt={pt} eliminar={deleteThat} key={i+1}/>
                                    )
                                })
                                :null
                        }
            
                    </tbody>
                </> : null}
            </table>


            <button onClick={() => {
                if(!loadingAdd){
                    handleAddMateria()
                }
            }}>{loadingAdd ? 'Moviendo' : 'Confirmar'} </button>
        </div>
    )
}