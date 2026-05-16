import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useCotizacionRapida } from "./cotizacionRapidaContext";
import { preciosKit } from "./calcPreciosLista";

export default function ItemKitLista({ kit }){

    const [valorProduccion, setValorProduccion] = useState(0);
    const [showSimulacion, setShowSimulacion] = useState(false);
    const clickTimerRef = useRef(null);

    const { openAddItemModal } = useCotizacionRapida();
    const usuario = useSelector((s) => s.usuario);
    const userId = usuario?.user?.user?.id;

    const distribuidor = kit?.linea?.percentages?.length ? kit.linea.percentages[0].distribuidor : 0;
    const final = kit?.linea?.percentages?.length ? kit.linea.percentages[0].final : 0;

    useEffect(() => {
        return () => {
            if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        };
    }, []);

    const buildPayload = (kitData, simulacion = false) => {
        const { precioDistribuidor, precioFinal } = preciosKit(kit);
        const detalle = [kit.extension?.name, kit.description].filter(Boolean).join(" · ");
        return {
            tipo: "kit",
            refId: kitData.id,
            codigo: String(kitData.id),
            nombre: kitData.name,
            detalle,
            extensionNombre: kit.extension?.name ?? "",
            precioFinal,
            precioDistribuidor,
            isSimulacion: simulacion,
        };
    };

    const handleClick = () => {
        if (clickTimerRef.current) return;
        clickTimerRef.current = setTimeout(() => {
            clickTimerRef.current = null;
            openAddItemModal(buildPayload(kit));
        }, 260);
    };

    const handleDoubleClick = () => {
        if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
        }
        setShowSimulacion(true);
    };

    return (
        <>
        <div
            className="long"
            style={{ width: "100%", cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openAddItemModal(buildPayload(kit));
                }
            }}
            title="Clic para agregar · Doble clic para crear simulación"
        >
            <tr >
                <td style={{width:'7%'}}>
                    <div className="code">
                        <h3>{kit.id}</h3>
                    </div>
                </td>
                <td style={{width:'90%'}} >
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <div className="boxColor"></div>
                            <span>{kit.extension.name}</span>
                            <span style={{marginLeft:10}}></span>
                        </div>
                        <div className="nameData">
                            <h3>{kit.name}</h3>
                            
                            <span style={{fontSize:11}}>{kit.description}</span>
                            <br /><br />
                            <div className="pricesItems" style={{display:'flex', alignItems:'center',
                            marginBottom:10
                            }}>
                                <PrecioCalculado
                                    kit={kit}
                                    setValorProduccion={setValorProduccion}
                                    distribuidor={distribuidor}
                                    final={final}
                                    precio={kit.priceKits}
                                />
                                
                            </div>
                        </div>
                    </div>
                </td>
                <td style={{width:'20%'}}> </td>

                <td style={{width:'5%'}}>

                </td>


                
            </tr>
        </div>
        {showSimulacion && createPortal(
            <SimulacionConfirm
                kit={kit}
                userId={userId}
                onClose={() => setShowSimulacion(false)}
                onCreated={(nuevoKit) => {
                    setShowSimulacion(false);
                    openAddItemModal(buildPayload(nuevoKit, true));
                }}
            />,
            document.body
        )}
        </>
    )
}

function SimulacionConfirm({ kit, userId, onClose, onCreated }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createSimulation = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/kit/clone/simulation/${kit.id}/${userId}`);
            onCreated(res.data.nuevoKit);
        } catch (err) {
            console.error(err);
            setError("No fue posible crear la simulación. Intenta de nuevo.");
            setLoading(false);
        }
    };

    return (
        <div className="modal cotizacionRapidaOverlay">
            <div className="hiddenModal" onClick={onClose} role="presentation" />
            <div className="containerModal cotizacionRapidaSheet cotizacionRapidaSheet--sm">
                <div className="cotizacionRapidaSheetHeader">
                    <div>
                        <h2>Crear simulación</h2>
                    </div>
                    <button type="button" className="cotizacionRapidaBtnIcon" onClick={onClose}>✕</button>
                </div>
                <div className="cotizacionRapidaBody">
                    <p className="cotizacionRapidaIntro">
                        <strong>{kit.name}</strong>
                        {kit.id ? <span className="cotizacionRapidaMuted"> · Ref. {kit.id}</span> : null}
                    </p>
                    <p>¿Deseas crear una simulación de este kit?</p>
                    {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}
                </div>
                <div className="cotizacionRapidaActions">
                    {loading ? (
                        <span style={{ padding: "8px 0" }}>Creando simulación...</span>
                    ) : (
                        <>
                            <button type="button" className="cotizacionRapidaBtn" onClick={onClose}>
                                No
                            </button>
                            <button
                                type="button"
                                className="cotizacionRapidaBtn cotizacionRapidaBtnPrimary"
                                onClick={createSimulation}
                            >
                                Sí, crear
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function PrecioCalculado({ kit, setValorProduccion, distribuidor, final, precio }) {
    const valorProduccion = precio[0].bruto

    useEffect(() => {
        setValorProduccion(valorProduccion);
    }, [valorProduccion, setValorProduccion]);

    const valorDistribuidor = (distribuidor > 0) ? (valorProduccion / Number(distribuidor)) : valorProduccion;
    const valorFinal = (final > 0) ? (valorDistribuidor / Number(final)) : valorDistribuidor;

    return (
        <>
            <h4 style={{fontWeight:400,fontSize:13}}>
                <span>Final</span><br />
                {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valorFinal).toFixed(0))} <span>COP</span>
            </h4>
            <h4 style={{marginLeft:20,fontWeight:400,fontSize:13}}>
                <span>Distribuidor</span><br />
                {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valorDistribuidor).toFixed(0))} <span>COP</span>
            </h4>
        </>
    );
}