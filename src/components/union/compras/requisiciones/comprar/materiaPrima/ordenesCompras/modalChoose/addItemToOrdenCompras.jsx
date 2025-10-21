import React, { useEffect, useState } from 'react';
import ItemProjectOrden from './itemProjects';
import GetAllItemsProvider from './getAllProducts';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../../../store/action/action';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import GetHowMany from './getHowMany';

export default function SeleccionadorItems (){
    const [choose, setChoose] = useState(false);

    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

    const req = useSelector(store => store.requisicion);
    const { ordenCompra, itemsCotizacions, itemRequisicion, loadingItemRequisicion } = req;
    const getChose = (item) => {
        setChoose(item);
    } 

    return (
        <div className="seleccionadorLeft">
            {
                !itemRequisicion ?
                    <GetAllItemsProvider seleccionador={getChose} />
                :
                    <GetHowMany />
            }
        </div>
    )
}