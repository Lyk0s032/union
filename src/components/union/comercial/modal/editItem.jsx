import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function EditItemModal(){
    const [params, setParams] = useSearchParams();

    return (
        <div className="modal" style={{zIndex:5}}>
            <div className="hiddenModal" onClick={() => {
                params.delete('simulation');
                setParams(params);
            }}></div>
            <div className="containerModal Form" >
                <div className="headerTitle">
                    <h3>Editando elemento</h3>
                </div>
                <div className="containerBody">

                    <div className="formToUpdateInformation">
                        <div className="inputDiv">
                            <label htmlFor="">Nombre del item</label><br />
                            <input type="text" placeholder='Escribe aquí' />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Descripción del item</label><br />
                            <textarea name="" id="" placeholder='Descripción del item'></textarea>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Precio total</label><br />
                            <input type="text" placeholder='Escribe aquí' />
                        </div>
                        <div className="inputDiv">
                            <button>
                                <span>Guardar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}