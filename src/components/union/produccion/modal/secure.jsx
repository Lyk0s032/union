import React, { useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

export default function AreYouSecure(props){
    const kit = props.kit;
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(null);
    return (
        <div className="modalQuestion">
            <div className="hiddenModal" onClick={() => {
                params.delete('remove');
                setParams(params)
            }}></div>
            <div className="containerModal Small"> 
                <div className="top">
                    <h3 className='question'>¿Estas seguro qué deseas eliminar este kit {kit.id} ({kit.description})?</h3>
                </div>
                <div className="bodyContainer">
                    <div className="text">
                        <h4>Una vez realizada esta acción, no podrá recuperar la información</h4>
                    </div>
                    {
                        loading ? 
                        <div className="buttons">
                            <button className='cancel'>
                                <span>Cancelar</span>
                            </button>
                            <button className="delete">
                                <span>Confirmar</span>
                                <MdDeleteOutline className="icon" />
                            </button>
                        </div>
                        : 
                        <div className="buttons">
                            <button className='cancel' onClick={() => {
                                params.delete('remove');
                                setParams(params);
                            }}>
                                <span>Cancelar</span>
                            </button>
                            <button className="delete">
                                <span>Confirmar</span>
                                <MdDeleteOutline className="icon" />
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div> 
    )
} 