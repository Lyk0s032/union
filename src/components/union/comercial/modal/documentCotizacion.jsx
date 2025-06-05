import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

export default function DocumentCotizacion(props){
    const [params, setParams] = useSearchParams();

    const cotizacionn = useSelector(store => store.cotizacions);
    const { cotizacion, loadingCotizacion } = cotizacionn;
    console.log(cotizacionn)
    return (
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('watch');
                setParams(params);
            }}></div>
            {
                !cotizacion || loadingCotizacion ?
                    <h1>Cargando cotización...</h1>
                : 
                <div className="containerModal Large">
                    <div className="cotizacionBody">
                        <div className="top">
                            <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                        </div>
                        <div className="cotizacionFuente">
                            <div className="topCoti">
                                <div className="divideTop">
                                    <div className="left">
                                        <h1>Modulares Costa Gomez SAS</h1>
                                        <div className="item">
                                            <h3>
                                                NIT:
                                            </h3>
                                            <h4> 901165150-3</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                DIRECCIÓN:
                                            </h3>
                                            <h4> CL 11 13 15</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                TELÉFONO:
                                            </h3>
                                            <h4> 4371651</h4>
                                        </div>
                                    </div>
                                    <div className="left">
                                        <div className="item">
                                            <h3>
                                                Número:
                                            </h3>
                                            <h4> MDC-CV-{cotizacion.id}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                FECHA:
                                            </h3>
                                            <h4>{cotizacion.time ? cotizacion.time.split('T')[0] : 0}</h4>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="clientTopData">
                                <div className="divideTopData">
                                    <div className="left">
                                        <div className="item">
                                            <h3>
                                                Cliente:
                                            </h3>
                                            <h4> {cotizacion.client.nombre}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                CONTACTO:
                                            </h3>
                                            <h4> {cotizacion.client.phone}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                DIRECCIÓN:
                                            </h3>
                                            <h4>{cotizacion.client.direccion}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                CIUDAD:
                                            </h3>
                                            <h4> {cotizacion.client.ciudad}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                TELÉFONO:
                                            </h3>
                                            <h4>{
                                                cotizacion.client.fijos && cotizacion.client.fijos.length ?
                                                cotizacion.client.fijos.map((ph,i) => {
                                                    return (
                                                        <span key={i+1}>{ph}<br /></span>
                                                    )
                                                })
                                                :null
                                            }</h4>
                                        </div>
                                    </div>
                                    <div className="left">
                                        <div className="item">
                                            <h3>
                                                Vendedor:
                                            </h3>
                                            <h4>KEVIN ANDRÉS BOLAÑOS ORREGO</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                FORMA DE PAGO:
                                            </h3>
                                            <h4> 03 50% ANTICIPO-50% ENTREGA</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                MONEDA:
                                            </h3>
                                            <h4>PESOS</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                VALIDA HASTA:
                                            </h3>
                                            <h4> 25 DE MAYO DEL 2025</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="referencias">
                                <div className="titleHere">
                                    <h3>
                                        Cotización
                                    </h3>
                                </div>
                                <div className="tableData">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className='left'>Referencia</th>
                                                <th className='left'>Descripción</th>
                                                <th>Cantidad</th>
                                                <th>Valor Unitario</th>
                                                <th>IVA</th>
                                                <th>Descuentos</th>
                                                <th>Valor total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cotizacion && cotizacion.kits  || cotizacion.armados && cotizacion.armados ?
                                                    cotizacion.kits.concat(cotizacion.armados).map((it,i) => {
                                                        return (
                                                            <tr key={i+1}>
                                                                
                                                                {
                                                                    it.kitCotizacion ?
                                                                        <td className='left'>0{it.id}</td>
                                                                    :
                                                                    <td className='left'>SP{it.id}</td>
                                                                }
                                                                <td className='left'>{it.name}</td>
                                                                {
                                                                    it.kitCotizacion ?
                                                                    <td>{it.kitCotizacion.cantidad}</td>
                                                                    :
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.cantidad).toFixed(0))}</td>
                                                                } 
                                                                {
                                                                    it.kitCotizacion ?
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.kitCotizacion.precio / it.kitCotizacion.cantidad).toFixed(0))} COP</td>
                                                                    :
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.precio / it.armadoCotizacion.cantidad).toFixed(0))} COP</td>
                                                                }
                                                                {
                                                                    it.kitCotizacion ?
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(it.kitCotizacion.precio).toFixed(0) * (19 / 100)))} COP</td>
                                                                    :
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(it.armadoCotizacion.precio).toFixed(0)) * (19 / 100))} COP</td>
                                                                }
                                                                {
                                                                    it.kitCotizacion ?
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(it.kitCotizacion.descuento)} COP</td>
                                                                    :
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(it.armadoCotizacion.descuento)} COP</td>
                                                                }
                                                                {
                                                                    it.kitCotizacion ?
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.kitCotizacion.precio).toFixed(0))} COP</td>
                                                                    :
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.precio).toFixed(0))} COP</td>
                                                                }
                                                            </tr>
                                                        )
                                                    })
                                                : null
                                            }
                                            
                                            
                                        </tbody>
                                    </table><br />
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Subtotal</th>
                                                <th>Descuento global</th>
                                                <th>Subtotal</th>
                                                <th>Valor Iva</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <TotalSub cotizacion={cotizacion} />
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

function TotalSub({ cotizacion }){
    
    const valor = cotizacion.kits && cotizacion.kits.length ? Number(cotizacion.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.precio : 0), 0)) : null
    const valorSuper = cotizacion.armados && cotizacion.armados.length ? Number(cotizacion.armados.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion ? p.armadoCotizacion.precio : 0), 0)) : null
    const sumaValor = Number(valor + valorSuper)
    // Descuento
    const descuentoValor = cotizacion.kits && cotizacion.kits.length ? Number(cotizacion.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.descuento : 0), 0)) : null
    const descuentoValorSuper = cotizacion.armados && cotizacion.armados.length ? Number(cotizacion.armados.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion ? p.armadoCotizacion.descuento : 0), 0)) : null
    const sumaDescuento = Number(descuentoValor + descuentoValorSuper).toFixed(0)

    const subTotal = sumaValor - sumaDescuento;
    const valorIva = subTotal * (19 / 100)
    const total = subTotal + valorIva;
    return (
        <tr className='total'>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(sumaValor).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(sumaDescuento).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(subTotal).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valorIva).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(total).toFixed(0))} COP</td>
        </tr>
    )
}