import React, { useEffect, useRef, useState } from 'react';
import LeftNavComprar from './leftNav';
import { useSearchParams } from 'react-router-dom';
import GeneralMateriaPrima from './materiaPrima/general';
import * as actions from '../../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ProyectosReq from './projectos/proyectos';
import GeneralProductos from './productos/general';

export default function ComprarAdmin(){
    const [params, setParams] = useSearchParams();

    const btn = useRef(null);
    const factura = useRef(null);
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const { ids, itemsCotizacions } = req;
    const closeComprar = () => {
        dispatch(actions.getIDs([]))
        params.delete('s')
        params.delete('borradores')
        params.delete('facture')
        params.delete('PV')
        params.delete('MP')
        setParams(params);

    }

    const cargaProyectos = async () => {
        setLoading(true)
        const body = {
            ids
        }
        console.log('body compraaass', body)
        const getData = await axios.post('/api/requisicion/get/req/multipleReal/', body)
        .then((res) => {
            setData(res.data);
            console.log('AXIOOOOOOOS', res.data)
            return res.data
        })
        .then((res) => {
            dispatch(actions.getProyectos(res.proyectos))
            dispatch(actions.getMaterias(res.consolidado))
        }) 
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado analizar esto', 'mistake'))
        })
        .finally(e => {
            setLoading(false)
        })
        return getData; 
    } 
    useEffect(() => {
        cargaProyectos()
    }, [ids])

    console.log('idssssssssss', ids)
    useEffect(() => {
        if(!factura.current || !factura.current) return;
       factura.current.classList.toggle('facturaActive')
       btn.current.classList.toggle('facturaBtnHidden') 

    }, [params.get('facture')])
 

    return (
        <div className="modal" style={{zIndex:5}}> 
            <div className="hiddenModal"></div>
            <div className="containerModal UXCOMPLETE">
                <div className="comprar"> 
                    <div className="leftNavUX">
                        <LeftNavComprar /> 
                    </div>
                    <div className="rightUx">
                        <button onClick={() => closeComprar()} style={{fontSize:16, padding:10}}>x</button>
                        {
                            params.get('s') == 'materia' ?
                                <GeneralMateriaPrima />
                            :params.get('s') == 'proyectos' ?
                                <ProyectosReq /> 
                            : params.get('s') == 'productos' ?
                                // <h1>Productos</h1>
                                <GeneralProductos />   
                            : null
                        }
                         
                        
                    </div>
                </div>
            </div>
        </div>
    )
} 