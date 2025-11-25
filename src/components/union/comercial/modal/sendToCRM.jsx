import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export default function SendToCRM(){
    const [params, setParams] = useSearchParams();
    const cotizacionn = useSelector(store => store.cotizacions);
    const { cotizacion, loadingCotizacion } = cotizacionn;

    console.log('cotizaciooon, ', cotizacion)

    const [valores, setValores] = useState(null);

    const getValores = (valores) => {
        setValores(valores)
    }
 
    const searchClient = async () => {
        
        const searchCl = await axios.get(`https://comercialapi-production.up.railway.app/api/cotizacion/give/clientByNit/${cotizacion.client.nit}`)
        .then(res => {
            console.log(res)
            return res.data;
        })
        .catch(async err => {
            console.log('En error')
            console.log(err)
            const resultado = await createClient()
            return resultado;

        }) 

        console.log(searchCl)
        return searchCl
    }


    const createClient = async () => {
        let body = {
            photo: null, 
            nombreEmpresa: cotizacion.client.nombre, 
            nit:cotizacion.client.nit, 
            phone: cotizacion.client.phone, 
            email: cotizacion.client.email, 
            type: cotizacion.client.type == 'juridica' ? 'empresa' : 'natural', 
            sector: null, 
            responsable: null, 
            url: null, 
            direccion: cotizacion.client.direccion, 
            fijo: cotizacion.client.fijos ? cotizacion.client.fijos[0] : null 
        } 

        const createClientFunction = await axios.post('https://comercialapi-production.up.railway.app/api/clients/create', body)
        .then(res => {
            console.log(res);
            return res.data
        })
        .catch(err => {
            console.log(err);
        })

        return createClientFunction
    }
    console.log('cotti', cotizacion)


    const createCotizacion = async (cliente) => {

        console.log('cliente desde la funcion', cliente)
        let body = {
            name: cotizacion.name,
            nit: cotizacion.client.nit,
            nro: Number(Number(21719) + Number(cotizacion.id)) ,
            fecha: cotizacion.createdAt.split('T')[0],
            bruto: valores.subtotal,
            descuento: valores.descuentos,
            iva: 19,
            neto: valores.total,
            clientId: cliente.id,
            userId: cotizacion.user.crm,
            state: 'pendiente'
        }

        const send = await axios.post('https://comercialapi-production.up.railway.app/api/cotizacion/add', body)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
        })

        return send;

    }


    const arrancarProceso = async () => {
        await searchClient()
        .then(async res => {
            console.log(res)
            console.log('respuesta desde arrancar', res)
            await createCotizacion(res)
            
        })
        .catch(err => {
            console.log(err)
        })
    }
    console.log('valorees, ', valores)

    return(
        <div className="modalSendToCRM">
            {
                !cotizacion ||loadingCotizacion ?
                    <h1>Cargando...</h1>
                : cotizacion == 'notrequest' || cotizacion == 404 ?
                    <h1>No encontramos esto</h1>
                :
                <div className="sendToCRM">
                <div className="titleAreaToCRM">
                    <div className="titleDivi">
                        <h3>Transferir al CRM</h3>
                    </div>
                    <button onClick={() => {
                        params.delete('transferir')
                        setParams(params);
                    }}>
                        <MdClose className="icon" />
                    </button>
                </div>
                <div className="bodyThat">
                    <div className="containerThat">
                        <div className="leftAnimation">
                            <div className="imgGiftrans">
                                <img src="https://lanzatunegocio.net/images/4H9h.gif" /> 
                            </div>
                            <button onClick={() => {
                                arrancarProceso()
                                console.log('enviado')
                            }}> 
                                <span>Enviar cotización</span>
                            </button>
                        </div>
                        <div className="rightContainerBody">
                            <div className="containerCotizacionBody">
                                <div className="titleCotizacion">
                                    <img src="https://www.metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                                </div>
                                <div className="topCotizacion">
                                    <div className="divideTop">
                                        <div className="lade">
                                            <h3>{cotizacion.user.name} {cotizacion.user.lastName}</h3>
                                            <strong>Nro. {cotizacion.id}</strong><br />
                                            <span>{cotizacion.createdAt.split('T')[0]}</span>
                                        </div>
                                        <div className="lade">
                                            <h3>{cotizacion.client.nombre}</h3>
                                            <strong>Nit. {cotizacion.client.nit}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="bodyTable">
                                    <TotalSub cotizacion={cotizacion} getValores={getValores} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                </div>
            }
        </div>
    )
}


function TotalSub({ cotizacion, getValores }){
    
    // const valor = cotizacion.kits && cotizacion.kits.length ? Number(cotizacion.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.precio : 0), 0)) : null
    // const valorSuper = cotizacion.armados && cotizacion.armados.length ? Number(cotizacion.armados.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion ? p.armadoCotizacion.precio : 0), 0)) : null
    // const sumaValor = Number(valor + valorSuper)
    // // Descuento
    // const descuentoValor = cotizacion.kits && cotizacion.kits.length ? Number(cotizacion.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.descuento : 0), 0)) : null
    // const descuentoValorSuper = cotizacion.armados && cotizacion.armados.length ? Number(cotizacion.armados.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion ? p.armadoCotizacion.descuento : 0), 0)) : null
    // const sumaDescuento = Number(descuentoValor + descuentoValorSuper).toFixed(0)

     // Valor de kits por área
    const valorKits = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.kits?.reduce((accKit, kit) => {
            return accKit + Number(kit.kitCotizacion?.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    // Valor de armados por área
    const valorArmados = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.armados?.reduce((accKit, kit) => {
            return accKit + Number(kit.armadosCotizacion?.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;
 
    const valorProductos = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.productoCotizacions?.reduce((accKit, kit) => {
            return accKit + Number(kit.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;


    const valorServicios = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.serviciosCotizados?.reduce((accKit, kit) => {
            return accKit + Number(kit.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;


    // Descuentos
    const descuentoKits = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.kits?.reduce((accKit, kit) => {
            return accKit + Number(kit.kitCotizacion?.descuento || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    const descuentoArmados = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.armados?.reduce((accKit, kit) => {
            return accKit + Number(kit.armadosCotizacion?.descuento || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;


    const descuentoProductos = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.productoCotizacions?.reduce((accKit, kit) => {
            return accKit + Number(kit.descuento || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    const descuentoServicios = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.serviciosCotizados?.reduce((accKit, kit) => {
            return accKit + Number(kit.descuento || 0);
        }, 0) || 0;
        return accArea + suma; 
    }, 0) || 0;

    const sumaDescuento = descuentoKits + descuentoArmados + descuentoProductos + descuentoServicios;
    const subTotal = valorKits + valorArmados + valorProductos + valorServicios;
    const totalSub = subTotal - sumaDescuento;
    const valorIva = Number(subTotal - sumaDescuento) * (19 / 100)
    const total = totalSub + valorIva;
 

    useEffect(() => {
        getValores({
            subtotal: subTotal.toFixed(0),
            descuentos: sumaDescuento.toFixed(0),
            subtotalConDescuento: totalSub.toFixed(0),
            iva: valorIva.toFixed(0),
            total: total.toFixed(0),
        })
    },[])
    return (
        <>
        <table>
            <tbody>
                <tr>
                    <td>
                        <span>Nombre cotización</span>
                    </td>
                    <td className="result">
                        <h2>{cotizacion.name}</h2>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Valor bruto:</span>
                    </td>
                    <td className="result">
                        <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(subTotal).toFixed(0))} COP</h3>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Descuento</span>
                    </td>
                    <td className="result">
                        <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(sumaDescuento).toFixed(0))} COP</h3>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>IVA incluido</span>
                    </td>
                    <td className="result">
                        <h3>Aplica</h3>
                    </td>
                </tr>


            </tbody>
        </table>

        </>
    ) 
}