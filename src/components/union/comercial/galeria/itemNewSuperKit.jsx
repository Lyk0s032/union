import React, { useState } from 'react';
import * as actions from '../../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function ItemNewSuperKit(props){
    const idSuperKit = props.superKitId;
    const kit = props.kit;
    const key = props.ky;
    const [howMany, setHowMany] = useState(1);
    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(false);


    const dispatch = useDispatch();
    
    const addHowMany = async () => {
        let body = {
            kitId: kit.id,
            armadoId: idSuperKit,
            cantidad: howMany
        }
        const sendAdd = await axios.post('/api/superkit/post/addKit', body)
        .then((res) => {
            dispatch(actions.axiosToGetSuperKit(false, idSuperKit))
            dispatch(actions.HandleAlerta('Kit agregado con exito.', 'positive'))
        }).catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado agregar este kit, intentalo más tarde.', 'mistake'))
        })
        .finally(r => {
            setLoading(false);
        })

        return sendAdd;
    }
    
    return (
        <div className="kitItem">
            {
                !state ?
                    <div className="divideThat">
                        <div className="data">
                            <div className="number">
                                <h3>#{key+1}</h3>
                            </div>
                            <div className="titleAndName">
                                <h3>{kit.name} </h3>
                            </div>
                        </div>
                        <div className="option">
                            <button onClick={() => setState('Active')}>
                                <span>Ok</span>
                            </button>
                        </div>
                    </div>
                :
                    <div className="divideThat Pending">
                        <div className="data">
                            <div className="inputDiv">
                                <input type="text" placeholder='Cantidad' 
                                onChange={(e) => setHowMany(e.target.value)}
                                value={howMany} />                            
                            </div>
                        </div>
                        {
                            loading ?
                            <div className="option">
                                <span>Cargando...</span>
                            </div>
                            : 
                            <div className="option">
                                <button className="btnChoose Go" onClick={() => {
                                    addHowMany()
                                }}>
                                    <span>Si</span>
                                </button>
                                <button className="btnChoose Cancel" 
                                onClick={() => setState(null)}>
                                    <span>No</span>
                                </button> 
                            </div>
                        }
                    </div>

            }
        </div>
    )
}