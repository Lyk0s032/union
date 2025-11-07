import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemProveedorProducto({item}){
    const [params, setParams] = useSearchParams();

    const openMateria = () => {
        params.delete('producto');
        params.set('prima', item.materium.id)
        params.set('graph', item.proveedorId)
        setParams(params);
    }

    const openProducto = () => {
        params.delete('prima');
        params.set('producto', item.producto.id)
        params.set('graph', item.proveedorId)
        setParams(params);
    }
    return (
        <tr onClick={() => {
            if(item.materium){
                openMateria()
            }else{
                openProducto()
            }
        }}>
            <td className="large">
                <div>
                    <strong>{item?.materium?.id} {item?.producto?.id} </strong>
                    <h3>{item?.materium?.description} </h3>
                    <span>{item?.materium?.item} </span>
                    <h3>{item?.producto?.item} </h3>
                    <span>{item?.producto?.description} </span>
                </div>
            </td>
            <td>
                {item?.materium?.medida} {item?.materium?.unidad} 

            </td>
            <td>
                {item?.createdAt.split('T')[0]} 
            </td>
            <td>$ {item?.valor}  </td>
        </tr>
    )
}