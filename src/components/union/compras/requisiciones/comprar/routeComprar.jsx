import React, { useEffect, useRef, useState } from 'react';
import LeftNavComprar from './leftNav';
import { useSearchParams } from 'react-router-dom';
import GeneralMateriaPrima from './materiaPrima/general';
import BtnFactura from './btnFactura';
import Factura from './factura';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ProyectosReq from './projectos/proyectos';

export default function Comprar(){
    const [params, setParams] = useSearchParams();

    const btn = useRef(null);
    const factura = useRef(null);
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const { ids } = req;

    const closeComprar = () => {
        dispatch(actions.getIDs([]))
    }

    const cargaProyectos = async () => {
        setLoading(true)
        const body = {
            ids
        }
        const getData = await axios.post('/api/requisicion/get/req/multipleReal/', body)
        .then((res) => {
            setData(res.data);
            return res.data
        })
        .then((res) => {
            dispatch(actions.getProyectos(res.proyectos))
            dispatch(actions.getMaterias(res.consolidado))

        })
        .catch(err => {
            console.log(err)
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

    useEffect(() => {
        if(!factura.current || !factura.current) return;
       factura.current.classList.toggle('facturaActive')
       btn.current.classList.toggle('facturaBtnHidden') 

    }, [params.get('facture')])


    return (
        <div className="modal" style={{zIndex:5}}> {console.log(data)}
            <div className="hiddenModal"></div>
            <div className="containerModal UXCOMPLETE">
                <div className="comprar"> {console.log(ids)}
                    <div className="leftNavUX">
                        <LeftNavComprar />
                    </div>
                    <div className="rightUx">
                        <button onClick={() => closeComprar()}>x</button>
                        {
                            params.get('s') == 'materia' ?
                                <GeneralMateriaPrima />
                            :params.get('s') == 'proyectos' ?
                                <ProyectosReq />    
                            : null
                        }
                        
                          <Factura ref={factura} />
                        <BtnFactura  ref={btn}/>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}