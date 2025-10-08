import React, { useEffect } from 'react';

export default function OpenProject({ data }){

    function getTotalCompradoPorMateria() {
        if (!data?.comprasCotizacionItems || !data.comprasCotizacionItems.length) return 0;

          const totalComprado = data.comprasCotizacionItems?.reduce(
            (sum, item) => sum + Number(item.precioTotal || 0),
            0
        ) || 0;

        return totalComprado;
    }


    function calcularTotalesProyecto() {
        if (!data?.cotizacion) {
            const totalCotizado = 0;
             return totalCotizado
        }

        // 🧾 1️⃣ Total cotizado
        const totalCotizado = data.cotizacion?.areaCotizacions.reduce((totalArea, area) => {
            const totalKits = area.kits.reduce((totalKit, kit) => {
            const k = kit.kitCotizacion;
            const cantidad = Number(k?.cantidad || 0);
            const precio = Number(k?.precio || 0).toFixed(0);
            const descuento = Number(k?.descuento || 0).toFixed(0);
            const totalDescuento = cantidad * descuento;
            console.log('descuentooo', totalDescuento)
            const total = Number(cantidad * precio) - totalDescuento ;
            console.log('totall', total)

            return total;
            }, 0);
            return totalArea + totalKits;
        }, 0);


        return totalCotizado;
    }
    const totalComprado = getTotalCompradoPorMateria();
    const precioProyecto = calcularTotalesProyecto();


    useEffect(() => {
        calcularTotalesProyecto()
    }, [])
    return (
        <div className="openProject">
            <div className="titleProject">
                <h3>{data.cotizacion?.name}</h3>
                <span>Cotización / (Proyecto) Nro: {Number(21719) + data.cotizacion.id}</span>
            </div>
            <div className="bodyProject">
                <div className="containerBodyProject">
                    <div className="divideProjectInfo">
                        <div className="priceProject">
                            <span>Inversión hasta el momento</span>
                            <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalComprado).toFixed(0))} </h3>
                        </div>
 
                        <div className="priceProject Right">
                            <span>Precio Aproximado del proyecto</span>
                            <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(precioProyecto).toFixed(0))} </h3>
                            <button>
                                <span>Ver cotización</span>
                            </button>
                        </div>
                    </div>

                    <div className="resultsComprasItems">
                        <div className="titleResults">
                            <h3>Historial de compras</h3>
                        </div>
                        <div className="itemResultsCompra">
                        {
                            data.comprasCotizacionItems?.length ?
                                data.comprasCotizacionItems.map((it, i) => {
                                return (
                                        <div className="itemResult">
                                            <div className="divideItem">
                                                <div className="description">
                                                    <span>{it.comprasCotizacion?.daysFinish}</span>
                                                    <h3>{it.materium?.description} {it.producto?.name}</h3>
                                                    <span>$ {Number(it.precioTotal).toFixed(0)}  - <strong>{it.comprasCotizacion?.proveedor?.nombre}</strong></span><br />
                                                    <span>Cantidad: <strong>{it.cantidad}</strong></span><br />
                                                </div>
                                            </div>
                                    </div>
                                )
                            })
                            : null
                        }
                           
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}