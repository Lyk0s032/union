import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';


function calcTotal(project) {
  if (!project || !Array.isArray(project.necesidadProyectos)) return 0;

  return project.necesidadProyectos.reduce((total, req) => {
    // convertir cantidad a número (sin toFixed)
    const cantidad = Number(req.cantidadComprometida || 0);

    // precio del kit (campo valor)
    let precio = 0;
    if (req.kit?.priceKits?.length > 0) {
      precio = Number(req.kit.priceKits[0].valor || 0);
    }

    // precio del producto (campo valor)
    if (req.producto?.productPrices?.length > 0) {
      precio = Number(req.producto.productPrices[0].valor || 0);
    }

    // **IMPORTANTE**: retornar el acumulador
    return total + (cantidad * precio);
  }, 0);
}

 
export default function OpenProject({ data, totalValorReal }){
    console.log(data)

    function getTotalCompradoPorMateria() {
        if (!data?.comprasCotizacionItems || !data?.comprasCotizacionItems.length) return 0;

          const totalComprado = data?.comprasCotizacionItems?.reduce(
            (sum, item) => sum + Number(item.precioTotal || 0),
            0
        ) || 0;

        return totalComprado;
    }

    const [valor, setValor] = useState(0);

    const totalComprado = getTotalCompradoPorMateria();

    // recalcula cuando cambie `project`
    useEffect(() => { 
        setValor(calcTotal(data));
    }, [data]);
    return (
        <div className="openProject">
            <div className="titleProject">
                <h3>{data?.cotizacion?.name}</h3>
                <span>Cotización / (Proyecto) Nro: {Number(21719) + data?.cotizacion.id}</span>
            </div>
            <div className="bodyProject">
                <div className="containerBodyProject">
                    <div className="divideProjectInfo">
                        <div className="priceProject">
                            <span>Inversión hasta el momento</span>
                            <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(totalValorReal)} </h3>
                        </div>

                        <div className="priceProject Right">
                            <span>Precio Aproximado del proyecto</span>
                            <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor ? valor : 0)}</h3>
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
                            data?.comprasCotizacionItems?.length ?
                                data?.comprasCotizacionItems.map((it, i) => {
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