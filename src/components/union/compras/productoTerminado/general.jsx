import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ModaUpdateProducto from '../modal/updateProduct';

export default function General(props){
    const prima = props.prima;
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
                            <h3>Producto terminado</h3>
                            <h1>{prima.description}</h1>
                            <div className="optionsItem">
                                <span className='title'>Volumen: </span><br />
                                <span>{prima.volumen ? prima.volumen : 'Sin definir'}</span>
                            </div>
                            <div className="optionsItem">
                                <span className='title'>Linea: </span><br />
                                <span>{prima.linea.name ? prima.linea.name : 'Sin definir'}</span>
                            </div> 
                            <div className="optionsItem">
                                <span className='title'>Categoría: </span><br />
                                <span>{prima.categorium ? prima.categorium.name : 'Sin definir'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                params.get('u') ?
                    <ModaUpdateProducto prima={prima} />
                : null
            }
        </div>
    )
}