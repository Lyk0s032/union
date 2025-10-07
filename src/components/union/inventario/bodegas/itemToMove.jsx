import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemToActive({ pt, addtoMove }){
    const [params, setParams] = useSearchParams();
    let bodega = params.get('bodega');
    const [active, setActive] = useState(null);

    const [data, setData] = useState(
        !pt.tipoProducto == 'Materia Prima' ?
            {
                description: pt.description,
                materiaId: pt.id,
                tipoProducto: 'Materia Prima',
                id: pt.id,
                cantidadActual: pt.inventarios[0].cantidad,
                fecha: pt.inventarios[0].createdAt,
                cantidad: 0,
                tipo: 'ENTRADA',
                ubicacionOrigenId: !bodega ? 1 : bodega,
                ubicacionDestinoId: !bodega ? 1 : bodega,
                refDoc: 'ENC1000',
            }
        :
            {
                description: pt.description,
                productoId: pt.id,
                tipoProducto: 'Producto',
                id: pt.id,
                cantidadActual: pt.inventarios[0].cantidad,
                fecha: pt.inventarios[0].createdAt,
                cantidad: 0,
                tipo: 'ENTRADA',
                ubicacionOrigenId: !bodega ? 1 : bodega,
                ubicacionDestinoId: !bodega ? 1 : bodega,
                refDoc: 'ENC1000'

            }
    );

    useEffect(() => {
        console.log('Entramos')
    },[])
    return (
        !active ?
            <tr onDoubleClick={() => setActive(pt.id)}>
                <td className="coding"> {console.log('Data puntual', data)}
                    <div className="code">
                        <h3>{pt.id}</h3>
                    </div>
                </td>
                <td className="longer Almacen" > 
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <div className="boxColor"></div>
                            <span>{dayjs(pt.inventarios[0].createdAt.split('T')[0]).format('DD [de] MMMM [del] YYYY ')}</span>
                        </div>
                        <div className="nameData">
                            <h3>
                                {
                                    pt.inventarios ?
                                        `${pt.description}`
                                    : 'Sin nombre'
                                }
                            </h3>
                        </div>
                    </div>
                </td>
                <td className="middle Almacen" style={{fontSize:12}}>
                    <span>{pt.inventarios[0].cantidad}</span>
                </td>
                <td className="middle Almacen" style={{fontSize:12}}>
                    <span>{pt.inventarios[0].cantidadComprometida}</span>
                </td>
                <td className='middle Almacen'>
                    <span>!</span>
                </td>
            </tr>
        :
            <tr onDoubleClick={() => setActive(null)}>
                <td className="coding">
                    <div className="code">
                        <h3>{pt.id}</h3>
                    </div>
                </td>
                <td className="longer Almacen" > 
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <div className="boxColor"></div>
                            <span>{dayjs(pt.inventarios[0].createdAt.split('T')[0]).format('DD [de] MMMM [del] YYYY ')}</span>
                        </div>
                        <div className="nameData">
                            <h3>
                                {
                                    pt.inventarios ?
                                        `${pt.description}`
                                    : 'Sin nombre'
                                }
                            </h3>
                        </div>
                    </div>
                </td>
                <td className="middle Almacen" style={{fontSize:12}}>
                    <span>{pt.inventarios[0].cantidad}</span>
                </td>
                <td className="middle Almacen" style={{fontSize:12}}>
                    <input type="text" placeholder='Cantidad a mover' onChange={(e) => {
                        setData({
                            ...data,
                            cantidad: e.target.value,
                            tipo: e.target.value > 0 ? 'ENTRADA' : e.target.value < 0 ? 'SALIDA' : null
                        })
                    }} onKeyDown={(code) => {
                        if(code.code == 'Enter'){
                            if(data.cantidad > 0 || data.cantidad < 0){
                                addtoMove(data)
                            }
                        }
                    }} onBlur={() => setActive(null)}/>
                </td>
            </tr>
    )
}