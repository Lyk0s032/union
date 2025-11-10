import React, { useEffect, useState } from 'react';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import OpenProject from './openProject';
import axios from 'axios';
import { useSelector } from 'react-redux';

dayjs.extend(localizedFormat);
dayjs.locale("es");

export default function ItemProyecto({ pr }){
    let fechaAprobacion = dayjs(pr?.fecha).format("D [de] MMMM YYYY, h:mm A");
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // 👇 nuevo estado para total de costo real
    const [totalValorReal, setTotalValorReal] = useState(0);

    const getProject = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/requisicion/get/project/get/project/${pr.id}`);
            const d = res.data;

            // 💡 Calculamos el total de valorAsignado desde los itemToProjects
            let total = 0;
            if (Array.isArray(d?.compras)) {
                d.compras.forEach(compra => {
                    (compra.comprasCotizacionItems || []).forEach(item => {
                        (item.itemToProjects || []).forEach(it => {
                            const v = Number(it.valorAsignado || 0);
                            if (!isNaN(v)) total += v;
                        });
                    });
                });
            }

            setData(d);
            setTotalValorReal(total);

        } catch (err) {
            console.log(err);
            setData(404);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProject();
    }, [pr]);

    return (
        <>
            <tr className={`fila-cotizacion ${open ? "Open" : ""}`} onClick={() => setOpen(!open)}> 
                <td className="longer"> 
                    <div className="nameLonger">
                        <div className="letter">
                            <h3>{pr.id}</h3>
                        </div> 
                        <div className="name" style={{marginLeft:10}}>
                            <h3>{pr.cotizacion?.name}</h3>
                            <span>Cotizacion: {Number(21719) + pr.cotizacion?.id}</span><br />
                            <span>{fechaAprobacion}</span><br />
                            <span>{pr.estado}</span><br />
                            {/* 👇 mostramos el valor real si existe */}
                            {totalValorReal > 0 && (
                                <span style={{fontWeight:'bold', color:'#0a7'}}>
                                    Valor real: ${totalValorReal.toLocaleString('es-CO')}
                                </span>
                            )}
                        </div>
                    </div> 
                </td>
                <td className='hidden'>
                    <div>
                        <span>{pr.cotizacion?.client?.nombre}</span><br />
                    </div>
                </td>
            </tr>

            {open && (
                <div className="wapper">
                    <div className="fila-expandida">
                        <div className="detalle-cotizacion">
                            {/* 👇 le pasamos el data ya con el valorAsignado calculado */}
                            <OpenProject data={data} pr={pr} totalValorReal={totalValorReal} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
