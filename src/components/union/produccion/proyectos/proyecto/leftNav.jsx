import React from 'react';
import { MdOutlineEdgesensorHigh, MdOutlineEmojiObjects, MdOutlineFolderDelete, MdOutlineNewspaper, MdOutlineSpaceDashboard } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

export default function LeftNavProject(){
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
                    <li onClick={() => {
                        params.set('s', 'prima');
                        setParams(params);
                    }}>
                        <div>
                            <MdOutlineSpaceDashboard className="icon" /><br />
                            <span>Materia prima</span>
                        </div>
                    </li>

                </ul>
            </nav>
        </div>
    )
}