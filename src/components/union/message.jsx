import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../store/action/action';


export default function Message(){
    const dispatch = useDispatch();

    const system = useSelector(store => store.system);
    const { alerta, typeAlerta } = system;
    return (
        <div className={typeAlerta == 'positive' ? "message Positive" : "message Mistake"}>
            <div className="containerMessage">
                <div className="text">
                    <span>{alerta}</span>
                </div>
                <button onClick={() =>  dispatch(actions.HandleAlerta(null, null))}>
                    <AiOutlineClose /> 
                </button>
            </div>
        </div>
    )
}