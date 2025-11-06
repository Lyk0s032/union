import React from 'react';
import { MdDocumentScanner, MdEditDocument, MdOutlineAttachMoney, MdOutlineDocumentScanner } from 'react-icons/md';

export default function BoxDatas({ compras }){

    const preOrdenes = compras.filter((f) => !f.estadoPago);
    const ordenes = compras.filter((f) => f.estadoPago == 'compras');
    const comprado = compras.filter((f) => f.estadoPago == 'comprado');

    const valores = compras.filter((f) => f.daysFinish);
    console.log('valorees', valores)
    return (
        <div className="containerDivideZone">
            <div className="boxItem">
                <div className="containerBoxItem">
                    <div className="icono">
                        <MdEditDocument className="icon" />
                    </div>
                    <div className="dataBox">
                        <span>Preordenes de compra</span>
                        <h3>{preOrdenes?.length ? preOrdenes.length : 0}</h3>
                    </div>
                </div>
            </div>

            <div className="boxItem">
                <div className="containerBoxItem">
                    <div className="icono">
                        <MdOutlineDocumentScanner className='icon' />
                    </div>
                    <div className="dataBox">
                        <span>ordenes de compra</span>
                        <h3>{ordenes?.length ? ordenes.length : 0}</h3>
                    </div> 
                </div>

            </div>
            <div className="boxItem">
                    <div className="containerBoxItem">
                        <div className="icono">
                            <MdDocumentScanner className="icon" />
                        </div>
                        <div className="dataBox">
                            <span>ordenes aprobadas</span>
                            <h3>{comprado?.length ? comprado.length : 0}</h3>
                        </div>
                    </div>
                </div>


                <div className="boxItem">
                    <div className="containerBoxItem">
                        <div className="icono">
                            <MdOutlineAttachMoney className="icon" />
                        </div>
                        <div className="dataBox">
                            <span>Total comprado</span>
                            <h3>$ 154.000</h3>
                        </div>
                    </div>
                </div>
            </div>
    )
}