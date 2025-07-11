import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdArrowForward, MdCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import { getPromedio } from "../../produccion/calculo";

export default function ItemToSelect({ dis, kit, number }) {
    const [active, setActive] = useState(null);
    const [valorProduccion, setValorProduccion] = useState(0);
    const { cotizacion } = useSelector(store => store.cotizacions);
    const dispatch = useDispatch();

    const distribuidor = kit?.linea?.percentages?.length ? kit.linea.percentages[0].distribuidor : 0;
    const final = kit?.linea?.percentages?.length ? kit.linea.percentages[0].final : 0;

    const addItem = async (cantidad, precioUnitarioFinal) => {
        if(!number) return dispatch(actions.HandleAlerta('Selecciona un área, por favor', 'mistake'))
        if (!cantidad || cantidad <= 0) {
            return dispatch(actions.HandleAlerta('Debes ingresar una cantidad válida', 'mistake'));
        } 
        
        const body = {
            cotizacionId: number,
            areaId: number,
            kitId: kit.id,
            cantidad: cantidad,
            precio: (Number(precioUnitarioFinal))
        };
        await axios.post('/api/cotizacion/add/item', body)
            .then(() => {
                dispatch(actions.axiosToGetCotizacion(false, cotizacion.id));
                dispatch(actions.HandleAlerta('Kit agregado con éxito', 'positive'));
                setActive(null);
            })
            .catch(err => {
                console.log(err);
                dispatch(actions.HandleAlerta('No hemos logrado agregar este kit', 'mistake'));
            });
    };

    return active ? (
        <ActiveRow
            kit={kit}
            onCancel={() => setActive(null)}
            onAdd={addItem}
            setValorProduccion={setValorProduccion}
            distribuidor={distribuidor}
            final={final}
            dis={dis}
        />
    ) : (
        <DisplayRow
            kit={kit}
            onActivate={() => setActive(true)}
            setValorProduccion={setValorProduccion}
            distribuidor={distribuidor}
            final={final}
            dis={dis}
        />
    );
}

function DisplayRow({ kit, onActivate, setValorProduccion, distribuidor, final, dis }) {
    return (
        <tr className="uxTable">
            <td className="titleKit">
                <div className="divTitleKits">
                   <div className="leftTitle">
                         <strong>{kit.id}</strong>
                   </div>
                   <div className="right">
                        <div className="color">
                            <div className="colorDiv" style={{color: `${kit.extension.code}`}}></div>
                            <h5>{kit.extension.name}</h5>
                        </div>
                        <h3>{kit.name}</h3>
                        
                        <h4>{kit.description}</h4>
                   </div>
                </div>
            </td> 
            <td className="short">
                <h3>
                    <PrecioCalculado
                        kit={kit}
                        setValorProduccion={setValorProduccion}
                        distribuidor={distribuidor}
                        final={final}
                        dis={dis}
                    />
                </h3>
            </td>
            <td className="btns">
                <button onClick={onActivate}><MdArrowForward /></button>
            </td>
        </tr>
    );
}

function ActiveRow({ kit, onCancel, onAdd, setValorProduccion, distribuidor, final, dis }) {
    const [cantidad, setCantidad] = useState(1);
    const howManyRef = useRef(null);
    const valorTotal = useMemo(() => {
        if (!kit.itemKits) return 0;
        
        const costoProduccionUnitario = kit.itemKits.map(item => getPromedio(item)).reduce((acc, costo) => acc + costo, 0);
        setValorProduccion(costoProduccionUnitario);

        const valorDistribuidorUnitario = (distribuidor > 0) ? (costoProduccionUnitario / Number(distribuidor)) : costoProduccionUnitario;
        const valorFinalUnitario = (final > 0) ? (valorDistribuidorUnitario / Number(final)) : valorDistribuidorUnitario;
        
        const precioUnitarioAMostrar = dis ? valorDistribuidorUnitario : valorFinalUnitario;

        return precioUnitarioAMostrar * cantidad;
        
    }, [kit, cantidad, setValorProduccion, distribuidor, final, dis]);

    useEffect(() => {
        howManyRef.current.focus()
    }, [])
    return (
        <tr className="uxTable">
            <td className="titleKit">
                <div className="divTitleKits">
                   <div className="leftTitle">
                         <strong>{kit.id}</strong>
                   </div>
                   <div className="right">
                        <div className="color">
                            <div className="colorDiv" style={{color: `${kit.extension.code}`}}></div>
                            <h5>{kit.extension.name}</h5>
                        </div>
                        <h3>{kit.name}</h3>
                        
                        <h4>{kit.description}</h4>
                   </div>
                </div>
            </td> 
            <td className="short">
                <h3>{new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valorTotal).toFixed(0))} <span>COP</span></h3>
            </td>
            <td className="btns">
                <div className="HowManyHere">
                    <div className="medida">
                        <input type="number" ref={howManyRef} min="1" onChange={(e) => setCantidad(e.target.value)} value={cantidad} 
                        onBlur={() => onCancel()}
                        onKeyDown={(e) => {
                            if(e.key == 'Enter'){
                                onAdd(cantidad, valorTotal)
                            }
                        }} />
                    </div>
                </div>

            </td>
        </tr>
    );
}

function PrecioCalculado({ kit, setValorProduccion, distribuidor, final, dis }) {
    const valorProduccion = useMemo(() => {
        if (!kit.itemKits || kit.itemKits.length === 0) return 0;
        const costos = kit.itemKits.map(item => getPromedio(item));
        return costos.reduce((acc, costo) => acc + costo, 0);
    }, [kit.itemKits]);

    useEffect(() => {
        setValorProduccion(valorProduccion);
    }, [valorProduccion, setValorProduccion]);

    const valorDistribuidor = (distribuidor > 0) ? (valorProduccion / Number(distribuidor)) : valorProduccion;
    const valorFinal = (final > 0) ? (valorDistribuidor / Number(final)) : valorDistribuidor;
    const valorAMostrar = dis ? valorDistribuidor : valorFinal;

    return (
        <>{new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valorAMostrar).toFixed(0))} <span>COP</span></>
    );
}