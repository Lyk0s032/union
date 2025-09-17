import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

export default function ListProvider({ item }){
    const [choose, setChosee] = useState(false);
    const max = 10
    const [howMany, setHowMany] = useState(1)


    const totalCantidad = item.itemRequisicions.reduce((acc, it) => {
        return acc + Number(it.cantidad);
    }, 0);

    // const [valor, setValor] = useState(item.price.valor);
    // const dispatch = useDispatch();

    // const updatePrice = async () => {
    //     if(!valor) return dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
    //    // Caso contrario, enviamos consulta
    //     let iva = valor * 0.19;
    //     let total = Number(Number(valor) + Number(iva)).toFixed(0); 
    //     const body = { 
    //         mtId: item.id,
    //         pvId: precio.proveedor.id,
    //         price:total ,
    //         iva,
    //         descuentos: valor,
    //     }
    //     const sendPetion = await axios.post('/api/mt/price/give', body)
    //     .then((res) => {
    //         dispatch(actions.axiosToGetPrima(false, prima.id))
    //         dispatch(actions.HandleAlerta("Valor actualizado con éxito", 'positive'))
    //         dispatch(actions.axiosToGetPrimas(false))
    //         setUpdate(null)
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
    //     })
    //     return sendPetion;
    // }
    return ( 
        <div className="listProvider">
            {
                !choose ?
                    <div className="containerList">
                        <div className="titleThis">
                            <span>Cantidades </span>
                        </div>
                        <div className="howMany"> 
                            <div className="inputDiv">
                                <input type="number" step={1} min={1} max={max} value={howMany} onChange={(e) => {
                                    setHowMany(e.target.value)
                                }} /> 
                                <h3> / </h3><h3 onDoubleClick={() => {
                                    setHowMany(max)
                                }}> {max}</h3>
                            </div>
                        </div>
                        <div className="titleThis">
                            <span>Lista de proveedores</span>
                        </div>
                        <div className="resultProviders">
                            <div className="containerResultsProviders">
                                {
                                    item.prices?.map((price, i) => {
                                        return (
                                            <div className="itemProvider" key={i+1}>
                                                <div className="letter">
                                                    <h3>{price.proveedor.nombre.split('')[0]}</h3>
                                                </div>
                                                <div className="downData">
                                                    <h3 onClick={() => setChosee(true)}>{price.proveedor.nombre}</h3>
                                                    <h1>$ {price.valor} </h1>
                                                </div> 
                                            </div>
                                        )
                                    })  
                                }                               
                            </div>
                        </div>
                    </div>
                : 
                    <div className="containerList">
                        
                        <div className="titleThis">
                            <span>Precios</span>
                        </div>
                        <div className="resultProviders">
                            <div className="containerFormProvider">
                                <div className="leftThatOption">
                                    <div className="letter">
                                        <h3>E</h3>
                                    </div>
                                    <div className="dataProvider">
                                        <h3 onDoubleClick={() => {
                                            setChosee(false)
                                        }}>Expodimo</h3>
                                        <span>Último valor</span>
                                    </div>
                                </div>
                                <div className="rightFormData">
                                    <div className="inputDiv">
                                        <label htmlFor="">Valor</label><br />
                                        <input type="text" placeholder='Ej. 250000' onKeyDown={(e) => {
                                            if(e.code == 'Escape'){
                                                setChosee(false)
                                            }
                                        }}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}