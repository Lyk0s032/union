import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import ItemProgress from "./itemProgress";
import { MdFormatColorText, MdOutlineFilePresent, MdOutlineImage, MdOutlineTextFields } from "react-icons/md";
import Solicitud from "./new/solicitud";
import NewReq from "./new/newReq";
export default function Solicitudes(){

    const dispatch = useDispatch();
    const noti = useSelector(store => store.noti);
    const { requerimientos , loadingRequerimientos } = noti;
    const [data, setData] = useState('image')
    const [addReq, setAdd] = useState(null);    
    const [open, setOpen] = useState(null);

    const changeOpen = (reqId) => {
        setOpen(reqId)
    }
    const close = () => {
        setAdd(null);
    }
    useEffect(() => {
        dispatch(actions.axiosToGetRequerimientos(true))
    }, [])
    return ( 
        <div className="provider"> 
            <div className="containerProviders Dashboard-grid"> 
                <div className="notificationsPanel">
                    <div className="divideNotifications">
                        <div className="leftNoti">
                            <div className="title">
                                <h3>Solicitudes</h3>
                            </div>
                            <div className="resultsNotificationsKits">
                                <div className="containerResultsNoti">
                                    <table>
                                        <tbody>
                                            {
                                                requerimientos && requerimientos?.length ?
                                                    requerimientos.map((r, i) => {
                                                        return (
                                                            <ItemProgress open={open} changeOpen={changeOpen} r={r} key={i+1} />
                                                        )
                                                    })
                                                :null
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="rightNoti">
                            {
                                addReq ?
                                    <NewReq close={close} />
                                : open ?
                                    <Solicitud open={open} />
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}