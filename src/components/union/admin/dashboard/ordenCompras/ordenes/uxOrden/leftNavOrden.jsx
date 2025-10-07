import React from 'react';
import { MdOutlineEdgesensorHigh, MdOutlineEmojiObjects, MdOutlineFolderDelete, MdOutlineNewspaper, MdOutlineSpaceDashboard } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

export default function LeftNavOrdenCompra(){
    const [params, setParams] = useSearchParams();
    return (
        <div className="leftNav">
            <nav>
                <ul>
                    <li onClick={() => {
                        params.set('s', 'detalles');
                        setParams(params);
                    }}>
                        <div>
                            <MdOutlineSpaceDashboard className="icon" /><br />
                            <span>Detalles</span>
                        </div>
                    </li>
                    {/* <li onClick={() => {
                        params.set('s', 'proyectos');
                        setParams(params);
                    }}>
                        <div>
                            <MdOutlineNewspaper className="icon" /><br />
                            <span>Proyectos</span>
                        </div>
                    </li> */}

                </ul>
            </nav>
        </div>
    )
}