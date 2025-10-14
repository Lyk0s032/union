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

    {console.log(pr)}
    const getProject = async () => {
        setLoading(true)
        const getSearchAxios = await axios.get(`/api/requisicion/get/project/get/project/${pr.id}`)
        .then(res => {
            setData(res.data)
        })
        .catch(err => {
            console.log(err)
            setData(404)
        })
        .finally(() => {
            setLoading(false)
        })
        return getSearchAxios;
    }
    useEffect(() => {
        getProject()
    }, [pr])
    return (
        <>
            <tr className={`fila-cotizacion ${open ? "Open" : ""}`} onClick={() => setOpen(!open)}> 
                <td className="longer"> 
                    <div className="nameLonger">
                        <div className="letter">
                            <h3 >{pr.id}</h3>
                        </div> 
                        <div className="name" style={{marginLeft:10}}>
                            <h3>{pr.cotizacion?.name}</h3>
                            <span>Cotizacion: {Number(21719) + pr.cotizacion?.id}</span><br />
                            <span>{fechaAprobacion}</span><br />
                            <span>{pr.estado}</span>
                        </div>
                    </div> 
                </td>
                <td className='hidden'>
                    <div className="">
                    <span>{pr.cotizacion?.client?.nombre}</span><br />

                    </div>
                </td>
            </tr>

            {
                open && (
                    <div className="wapper">
                        <div className="fila-expandida">
                            <div className="detalle-cotizacion">
                                <OpenProject data={data} pr={pr} />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}