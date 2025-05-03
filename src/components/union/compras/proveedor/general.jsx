import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ModaUpdateMp from '../modal/updateMp';
import ModalUpdateProvider from '../modal/updateProvider';
 
export default function GeneralPv(props){
    const provider = props.provider;

    const [params, setParams] = useSearchParams();
    return (
        <div className="pestana">
            <div className="containerPestana">
                <div className="general">
                    <div className="topRight">
                        <button onClick={() => {
                            params.set('u', 'now');
                            setParams(params);
                        }}>
                            <span>Actualizar</span>
                        </button>
                    </div>
                    <div className="dataGeneral">
                        <div className="boxGeneral">
                            <h1>{provider.nombre} - {provider.siglas}</h1>
                            <h3>{provider.nit} </h3>
                            <div className="optionsItem">
                                <span className='title'>Correo: </span><br />
                                <span>{provider.email ? provider.email : 'Sin definir'}</span>
                            </div>
                            <div className="optionsItem">
                                <span className='title'>Peso: </span><br />
                                <span>{provider.ciudad ? provider.ciudad : 'Sin definir'}</span>
                            </div>
                            <div className="optionsItem">
                                <span className='title'>Linea: </span><br />
                                <span>{provider.departamento ? provider.departamento : 'Sin definir'}</span>
                            </div> 
                            <div className="optionsItem">
                                <span className='title'>Categoría: </span><br />
                                <span>{provider.pais ? provider.pais : 'Sin definir'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                params.get('u') ?
                    <ModalUpdateProvider provider={provider} />
                : null
            }
        </div>
    )
}