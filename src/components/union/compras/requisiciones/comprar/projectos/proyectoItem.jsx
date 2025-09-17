import React from 'react';

export default function ItemProyecto({ pr }){
    return (
        <tr> 
            <td className="longer">
                <div className="nameLonger">
                    <div className="letter">
                        <h3 >{pr.id}</h3>
                    </div> 
                    <div className="name" style={{marginLeft:10}}>
                        <h3>{pr.cotizacion?.name}</h3>
                        <span>{pr.cotizacion?.time.split('T')[0]}</span><br />


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
    )
}