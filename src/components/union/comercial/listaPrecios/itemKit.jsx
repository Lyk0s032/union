import React, { useEffect, useState } from "react";
import { useCotizacionRapida } from "./cotizacionRapidaContext";
import { preciosKit } from "./calcPreciosLista";

export default function ItemKitLista({ kit }){

    const [valorProduccion, setValorProduccion] = useState(0);
    const { openAddItemModal } = useCotizacionRapida();
    
    const distribuidor = kit?.linea?.percentages?.length ? kit.linea.percentages[0].distribuidor : 0;
    const final = kit?.linea?.percentages?.length ? kit.linea.percentages[0].final : 0;

    const handleClickFila = () => {
        const { precioDistribuidor, precioFinal } = preciosKit(kit);
        const detalle = [kit.extension?.name, kit.description].filter(Boolean).join(" · ");
        openAddItemModal({
            tipo: "kit",
            refId: kit.id,
            codigo: String(kit.id),
            nombre: kit.name,
            detalle,
            extensionNombre: kit.extension?.name ?? "",
            precioFinal,
            precioDistribuidor,
        });
    };


    return (
        <div
            className="long"
            style={{ width: "100%", cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onClick={handleClickFila}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClickFila();
                }
            }}
            title="Clic para agregar a cotización rápida"
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
    )
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