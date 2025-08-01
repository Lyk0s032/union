import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SelectMP from "./selectItems";
import KitDescription from "./kitDescription";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import Loading from "../../loading";

export default function ModalNewCotizacion(){
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(null);

    const kits = useSelector(store => store.kits);
    const { kit, loadingKit } = kits;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(actions.getKit(null))
    }, [params.get('w')])
    return (
        <div className="modal">
            <div className="containerModal Complete">
                <div className="topBigModal">
                    <h3>Centro de kit</h3>
                    <button onClick={() => {
                        params.delete('w');
                        setParams(params);
                        dispatch(actions.getKit(null))
                    }}>X</button>
                </div>
                <div className="bodyModalBig">
                    <div className="page">
                        {   
                            !kit && loadingKit ?
                                <Loading />
                            : kit == 'notrequest' || kit == 404 ?
                                <div className="loading"> {console.log(kit)}
                                    <h1>No hemos encontrado esto</h1>
                                    <span>Intentalo más tarde</span><br />
                                    <button>
                                        <span>Cerrar</span>
                                    </button>
                                </div>
                            : !kit ?
                                <KitDescription />
                            : <SelectMP kit={kit} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}