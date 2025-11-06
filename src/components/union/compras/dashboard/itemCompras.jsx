import React from 'react';
import { MdDocumentScanner } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

export default function ItemCompras({ item }){
    const [params, setParams] = useSearchParams();
    return (
        <div className="itemOrden" onClick={() => {
            params.set('orden', item.id);
            setParams(params);
        }}>
                <div className="divideItemOrden">

                    <div className="nameAndData">
                        <div className="tipo">
                            <div className="letter">
                                <MdDocumentScanner className="icon" />
                            </div>
                        </div>
                        <div className="divideHer">
                            <div className="divideTopName">
                                <span>Nro {item.id}</span>
                                <span>|</span>
                                <strong>{item.proveedor?.nombre}</strong>
                            </div>
                            <h3>{item.name}</h3>
                        </div>
                    </div>
                    <div className="time">
                        <span>{item.createdAt.split('T')[0]}</span>
                    </div>
                    <div className="price">
                        <h3>$ {item.price ? item.price : 0}</h3>
                    </div>
                </div>
            </div>
    )
}