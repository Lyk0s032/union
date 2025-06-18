import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function MoveArea({ area }) {
    const [params, setParams] = useSearchParams();

    return (
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('area');
                setParams(params);
            }}></div>
            <div className="containerModal Small">
                <div className="headerModal">
                    <h3>Mover área de cotización</h3>
                </div>
                <div className="bodyModalTable">
                    <div className="topInput">
                        <input type="text" placeholder='Buscar cotización' />
                    </div>
                    <div className="tablaCoti">
                        <table>
                            <tbody>
                                <tr>
                                    <td className='one'>
                                        <span>Nro</span><br />
                                        <strong>10</strong>
                                    </td>
                                    <td className='two'>
                                        <span>Nombre de cotización</span><br />
                                        <h3>Cotización número A</h3>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='right'>
                                        <button>
                                            <span>Pegar aquí</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}