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
import GeneralBorradoresCotizacion from './borradoresCompras/generalBorradores';
import UxCotizadorPanel from './uxCotizacion/PanelCotizacions';
import GeneralProductos from './productos/general';

export default function Comprar(){
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
        console.log('body cuerpo', body)
        const getData = await axios.post('/api/requisicion/get/req/multipleReal/', body)
        .then((res) => {
            setData(res.data);
            return res.data
        })
        .then((res) => {
            dispatch(actions.getProyectos(res.proyectos))
            dispatch(actions.getMaterias(res.consolidado))
            dispatch(actions.cleanItemsForCotizacion())
        })
        .then(async (result) => {
            let body = {
                proyectos: ids
            }
            const getData = await axios.post('/api/requisicion/post/get/cotizaciones/', body)
            .then((res) => {
                dispatch(actions.getCotizacionesCompras(res.data))

            })

            return getData;
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

    useEffect(() => {
        if(!factura.current || !factura.current) return;
       factura.current.classList.toggle('facturaActive')
       btn.current.classList.toggle('facturaBtnHidden') 

    }, [params.get('facture')])


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Digit1") {
                const newParams = new URLSearchParams(params.toString());
                newParams.set("facture", "show"); // 👈 abrir componente
                setParams(newParams);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [params, setParams]);

  const itemsRef = useRef(itemsCotizacions);

  // Mantener el ref actualizado
  useEffect(() => {
    itemsRef.current = itemsCotizacions;
  }, [itemsCotizacions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        e.target?.isContentEditable === true;

      if (isTyping) return;

      // Capturar tanto el 0 superior como el del numpad
      if (e.code === "Digit0" || e.code === "Numpad0") {
        e.preventDefault();
        if (itemsRef.current && itemsRef.current.length >= 1) {
          console.log("debe limpiar");
          dispatch(actions.cleanItemsForCotizacion());
        } else {
          console.log("No debe limpiar", itemsRef.current);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]); // dispatch es estable en Redux, pero lo incluimos por ESLint

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
                                <GeneralMateriaPrima cargaProyectos={cargaProyectos} />
                            :params.get('s') == 'proyectos' ?
                                <ProyectosReq /> 
                            : params.get('s') == 'borradores' ?
                                <GeneralBorradoresCotizacion />   
                            : params.get('s') == 'productos' ?
                                <GeneralProductos />   
                            : null
                        }
                        
                          <UxCotizadorPanel ref={factura} />
                        <BtnFactura  ref={btn}/>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}