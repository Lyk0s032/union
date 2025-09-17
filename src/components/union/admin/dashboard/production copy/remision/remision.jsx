import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function RemisionSection(){
    const [params, setParams] = useSearchParams();
    return (
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('watch');
                setParams(params);
            }}></div>

            <div className="containerModal Large">
                <div className="bodyModal">
                    <div className="topDataRemision">
                        <h3>Estado de remisión</h3>
                    </div>
                    <div className="topCotizacionData">
                        <div className="divideTop">
                            <div className="leftClient">
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                            </div>

                            <div className="leftClient">
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                                <div className="item">
                                    <span>CLIENTE:</span>
                                    <h3>CONECTV SAS</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stateCurrentlyRemision">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Medida</th>
                                    <th>Cant. total</th>
                                    <th>Cant. entregada</th>
                                    <th>Cant. pendiente</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Silla Gerencial 2x1 Changai</td>
                                    <td>UND</td>
                                    <td>10</td>
                                    <td>5</td>
                                    <td>5</td>
                                </tr>
                                <tr>
                                    <td>Silla Gerencial 2x1 Changai</td>
                                    <td>UND</td>
                                    <td>10</td>
                                    <td>5</td>
                                    <td>5</td>
                                </tr>
                                <tr>
                                    <td>Silla Gerencial 2x1 Changai</td>
                                    <td>UND</td>
                                    <td>10</td>
                                    <td>5</td>
                                    <td>5</td>
                                </tr>
                                <tr>
                                    <td>Silla Gerencial 2x1 Changai</td>
                                    <td>UND</td>
                                    <td>10</td>
                                    <td>5</td>
                                    <td>5</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="registerRemision">
                        <div className="headerDivide">
                            <strong>Lista de remisiones</strong>
                            <button>
                                <span>+ Nuevo</span>
                            </button>
                        </div>
                        <table>
                            <thead>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Primera Remisión</td>
                                    <td>10 de Febrero del 2025</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}