import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';


import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español

dayjs.extend(localizedFormat);
dayjs.locale("es");

export default function ProviderAnalisis(){
    const [params, setParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const req = useSelector(store => store.requisicion);
    const { proveedoresArray } = req;
    const dispatch = useDispatch()
    const searchProviders = async () => {
        try{
            setLoading(true)
            let body = {
                materiumId: params.get('MP'),
                proveedores: proveedoresArray
            }

            const searchThat = await axios.post('/api/requisicion/post/searchProviders/analisis', body)
            .then((res) => {
                setData(res.data);
            })
            .catch(() => {
                setData(404);
            })
            .finally(() => {
                setLoading(false)
            })

            return searchThat;

        }catch(err){
            console.log(err);
            return null
        }
    }

    useEffect(() => {
        searchProviders()
    }, [params.get('MP'), proveedoresArray])

    const [valor, setValor] = useState()
    const updatePrice = async (proveedor) => {
        if(!valor) return dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        if(valor == proveedor?.prices[0].descuentos) return dispatch(actions.HandleAlerta('Debes ingresar un valor diferente'))
       // Caso contrario, enviamos consulta
        let iva = valor * 0.19;
        let total = Number(Number(valor) + Number(iva)).toFixed(0); 
        const body = { 
            mtId: params.get('MP'),
            pvId: proveedor.id,
            price:total ,
            iva,
            descuentos: valor,
        }
        const sendPetion = await axios.post('/api/mt/price/give', body)
        .then((res) => {
            dispatch(actions.HandleAlerta("Valor actualizado con éxito", 'positive'))
            searchProviders()
            
            return res;
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        })
        return sendPetion;
    }
    return (
        <div className="providerAnalisis">
            <button onClick={() => {
                params.delete('PV');
                setParams(params);
            }} style={{fontSize:16, padding:10}}>
                <span>X</span> 
            </button>
            <div className="containerAnalisisProvider">
                {
                    !data && loading ?

                    <div className="boxLoading">
                        <h1>Cargando</h1>
                    </div>

                    : !data || data == 404 ?
                    <div className="boxLoading">
                        <h1>Sin resultados</h1>
                    </div>
                    :
                    <div>
                        {
                            data?.map((pv, i) => {
                                const proveedor = pv.proveedor;
                                let lastUpdate = dayjs(proveedor?.prices[0].createdAt).format("dddd, D [de] MMMM YYYY, h:mm A");

                                return (
                                    <div className="providerItem" key={i+1}>
                                        <div className="uxProvider">
                                            <div className="topProvider">
                                                <div className="divideProvider">
                                                    <div className="lade">
                                                        <div className="nameAndLetter">
                                                            <div className="letter">
                                                                <h1>{proveedor.nombre.split('')[0]}</h1>
                                                            </div>
                                                            <div className="dataAndOther">
                                                                <h3>{proveedor.nombre}</h3>
                                                                <span>NIT: {proveedor.nit}</span><br />
                                                                <span>Teléfono: {proveedor.phone}</span><br />
                                                                <span>Email: {proveedor.email}</span>
                                                            
                                                                <div className="price">
                                                                    <span>Precio actual</span>
                                                                    <h1>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(proveedor?.prices[0].valor).toFixed(0))}</h1>
                                                                    <span>{lastUpdate}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="lade Right">
                                                        <div className="update">
                                                            <span>Valor</span><br />
                                                            <input type="text" placeholder='Ej. 250000' onChange={(e) => {
                                                                setValor(e.target.value)
                                                            }} value={valor} onKeyDown={(e) => {
                                                                if(e.code == 'Enter'){
                                                                    updatePrice(proveedor);
                                                                }
                                                            }}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="analisisProviderNumbers">
                                                <div className="titleSection">
                                                    <span>Analisís rápido</span>
                                                </div>
                                                <div className="containerNumbers">
                                                    <div className="itemNumber">
                                                        <div className="numberIt">
                                                            <h1>{pv.totalCotizaciones}</h1>
                                                        </div>
                                                        <div className="titleNumber">
                                                            <span>Total cotizaciones</span>
                                                        </div>
                                                    </div>

                                                    <div className="itemNumber">
                                                        <div className="numberIt">
                                                            <h1>{pv.aprobadas}</h1>
                                                        </div>
                                                        <div className="titleNumber">
                                                            <span>Ordenes de compra</span>
                                                        </div>
                                                    </div>

                                                    <div className="itemNumber">
                                                        <div className="numberIt">
                                                            <h1 style={{fontSize:18}}>5  <br /> Días</h1>
                                                        </div>
                                                        <div className="titleNumber">
                                                            <span>Tiempo de entrega Aprox.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}