import React from 'react';
import { AiOutlineDollar } from 'react-icons/ai';
import { MdDocumentScanner, MdEditDocument, MdOutlineAttachMoney, MdOutlineDocumentScanner } from "react-icons/md";
import GraphCompras from './graph';
import GeneralDashboard from './generalDashboard';
import { useSearchParams } from 'react-router-dom';
import Orden from './ordenView/orden';

export default function DashboardCompras(){
    const [params, setParams] = useSearchParams();
    return (
        <div className="dashboardCompras">
            <GeneralDashboard />
            {
                params.get('orden') ?
                    <Orden />
                : null
            }
        </div>
    )
}