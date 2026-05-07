import React, { useEffect } from "react";
import { useCotizacionRapida } from "./cotizacionRapidaContext";
import { preciosProductoTerminado } from "./calcPreciosLista";

export default function ItemProductoLista({ terminado }){

    const { openAddItemModal } = useCotizacionRapida();
    
    const distribuidor = terminado?.linea?.percentages?.length ? terminado.linea.percentages[0].distribuidor : 0;
    const final = terminado?.linea?.percentages?.length ? terminado.linea.percentages[0].final : 0;

    const handleClickFila = () => {
        const { precioDistribuidor, precioFinal } = preciosProductoTerminado(terminado);
        openAddItemModal({
            tipo: "producto",
            refId: terminado.id,
            codigo: String(terminado.id),
            nombre: terminado.item,
            detalle: terminado.description || "",
            precioFinal,
            precioDistribuidor,
        });
    };

    return (
        <div
            className="long"
            role="button"
            tabIndex={0}
            onClick={handleClickFila}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClickFila();
                }
            }}
            style={{ cursor: "pointer" }}
            title="Clic para agregar a cotización rápida"
        >
            <tr > 
                <td className="coding">
                    <div className="code">
                        <h3>{terminado.id}</h3>
                    </div>
                </td>
                <td style={{ width:'40%'}} >
                    <div className="titleNameKitAndData" style={{width:'100%'}}>
                        <div className="extensionColor">
                            <span style={{marginLeft:10}}></span>
                        </div>
                        <div className="nameData">
                            <h3>{terminado.item}</h3>
                            
                            <span style={{fontSize:11}}>{terminado.description}</span>
                            <br /><br />
                            <div className="pricesItems" style={{display:'flex', alignItems:'center',
                            marginBottom:10
                            }}>
                                <GetPrice distribuidor={distribuidor} final={final} precios={terminado.productPrices} terminado={terminado} />
                                
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </div>
    )
}

function GetPrice({ precios, final, distribuidor, estado }){
    const valor = precios.reduce((a,b) => Number(a) + Number(b.valor), 0)
    const promedio = Number(valor) / precios.length

    const  precioDistribuidor = promedio / distribuidor
    const precioFinal = promedio / final
    useEffect(() => {
    }, [promedio, estado]) 
    return (
        <>
            <h4 style={{fontWeight:400,fontSize:13}}>
                <span>Final</span><br />
                {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(precioFinal).toFixed(0))} <span>COP</span>
            </h4>
            <h4 style={{marginLeft:20,fontWeight:400,fontSize:13}}>
                <span>Distribuidor</span><br />
                {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(precioDistribuidor).toFixed(0))} <span>COP</span>
            </h4>
         {/* <strong>{estado ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precioFinal.toFixed(0)) : new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precioDistribuidor.toFixed(0))}</strong><br />
         <span>Precio básico: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(promedio)}</span><br />
         <span>Precio distribuidor: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precioDistribuidor.toFixed(0))} - ({distribuidor})</span><br />
         <span>Precio Final: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precioFinal.toFixed(0))} - ({final})</span><br />

        <br /><br /> */}
        </>
    )
}