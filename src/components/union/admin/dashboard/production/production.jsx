import React, { useEffect } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import { Route, Routes, useNavigate } from 'react-router-dom';
import GeneralProduction from './generalProduction';
import GeneralKits from './kits';
import GeneralProductos from './producto/producto';
import GeneralLineas from './lineas/lineas';
import GeneralUsuarios from './user/user';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';

export default function ProductionDashboard(){
    const dispatch = useDispatch();

    const administration = useSelector(store => store.admin);
    const { produccion, loadingProduccion } = administration;
    const navigate = useNavigate();

    useEffect(() => {
        if(!produccion){
            dispatch(actions.axiosToGetProduccionKits(true))
        }
    }, [])
    return (
        <div className="panelDashboardType">
            {
                !produccion || loadingProduccion ? 
                <div className="loading">
                    <h1>Cargando... </h1>
                </div>
                : produccion == 404 || produccion == 'notrequest' ?
                <div className="loading">
                    <h1>404 </h1>
                </div>
                :
                <div className="containerTypeDashboard">
                    <div className="topHeaderPanel">
                        <div className="divideHeader">
                            <div className="bottonChange">
                                <button>
                                    <MdOutlineArrowBackIos className='icon' />
                                </button> 
                            </div>
                            <div className="dataHeaderPrincipal">
                                <div className="containerDataHeader">
                                    <div className="area">
                                        <h2 onClick={() => {
                                        navigate('/admin/production')
                                    }}>Producción </h2>
                                        <div className="optionsData">
                                            <button>Otro panel</button>
                                        </div>
                                    </div>
                                    <div className="datosBox" onClick={() => {
                                        navigate('/admin/production/kits')
                                    }}>
                                        <span>Kit's en el sistema</span>
                                        <h1>{produccion.completos + produccion.desarrollo + 1}</h1>
                                    </div>
                                    <div className="datosBox" onClick={() => {
                                        navigate('/admin/production/productos')
                                    }}>
                                        <span>Producto terminado</span>
                                        <h1>{produccion.productos}</h1>
                                    </div>
                                    <div className="datosBox" onClick={() => {
                                        navigate('/admin/production/lineas')
                                    }}>
                                        <span>Líneas creadas</span>
                                        <h1>{produccion.lineas}</h1>
                                    </div>
                                    <div className="datosBox" onClick={() => {
                                        navigate('/admin/production/usuarios')
                                    }}>
                                        <span>Usuarios</span>
                                        <h1>{produccion.usuarios}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="bottonChange">
                                <button>
                                    <MdOutlineArrowForwardIos className='icon' />
                                </button>
                            </div>
                        </div>                   
                    </div>
                    <Routes>
                        <Route path="/*" element={<GeneralProduction produccion={produccion} />} />
                        <Route path="/kits/*" element={<GeneralKits produccion={produccion} />} />
                        <Route path="/productos/*" element={<GeneralProductos produccion={produccion}/>} />
                        <Route path="/lineas/*" element={<GeneralLineas />} />
                        <Route path="/usuarios/*" element={<GeneralUsuarios />} />
                    </Routes>
                </div>
            }

        </div>
    )
}