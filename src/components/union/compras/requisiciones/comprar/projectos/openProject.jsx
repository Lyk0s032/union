import React from 'react';

export default function OpenProject({ data }){
    console.log(data)

    function getTotalCompradoPorMateria() {
        if (!data.comprasCotizacionItems || !data.comprasCotizacionItems.length) return 0;

          const totalComprado = data.comprasCotizacionItems?.reduce(
            (sum, item) => sum + Number(item.precioTotal || 0),
            0
        ) || 0;

        return totalComprado;
    }

    const totalComprado = getTotalCompradoPorMateria();
    return (
        <div className="openProject">
            <div className="titleProject">
                <h3>{data.cotizacion?.name}</h3>
                <span>Cotización / (Proyecto) Nro: {data.cotizacion.id}</span>
            </div>
            <div className="bodyProject">
                <div className="containerBodyProject">
                    <div className="divideProjectInfo">
                        <div className="priceProject">
                            <span>Inversión hasta el momento</span>
                            <h3>$ {totalComprado} </h3>
                        </div>

                        <div className="priceProject Right">
                            <span>Precio Aproximado del proyecto</span>
                            <h3>$ 15.210.000 </h3>
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