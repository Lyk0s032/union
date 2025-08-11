import React, { useState } from 'react';
import { MdOutlineImage, MdOutlineTextFields } from 'react-icons/md';
import { useSelector } from 'react-redux';

export default function AdjuntMessage(message){
    const [data, setData] = useState('text')
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    return (
        <div className="containerMessageUser">
            <div className={`titleMessage ${user.user.id == message.message.user.id ? 'Me' : null}`}>
                <div className="leftMessageUser">
                    <div className="letter">
                        <div className="circle">
                            <h3>{message.message.user.name.split('')[0]}</h3>
                        </div>
                    </div>
                    <div className="dataUserMessage">
                        <h3>{`${message.message.user.name} ${message.message.user.lastName}`}</h3>
                        <span>{message.message.user.id == user.user.id ? 'Yo' : `@${message.message.user.email}`}</span>
                    </div>
                </div>
                <div className="rightUserMessage">
                    <span>
                        {message.message.createdAt.split('T')[0]}
                    </span><br />
                    {
                        message.message.user.id == user.user.id ? 
                            <strong>{message.message.adjunt ? 'Leido' : null}</strong>
                        : null
                        
                    }

                </div>
            </div>
            <div className="messegeContainerUser Me">
                <div className="leftFilterMessage">
                    <nav>
                        <ul>
                            <li className={data == 'text' ? 'Active' : null} onClick={() => setData('text')}>
                                <div className="text Active">
                                    <MdOutlineTextFields className="icon Active" />
                                </div>
                            </li>
                            <li className={data == 'image' ? 'Active' : null}  onClick={() => setData('image')}>
                                <div>
                                    <MdOutlineImage className="icon" />
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
                {
                    data == 'text' ?
                        <div className="rightMessageContainer">
                            <h3>{message.message.mesagge}</h3>
                        </div>
                    : data == 'image' ?
                            <div className="rightMessageContainer">
                                <div className="containerImages">
                                    <div className="image"> {console.log(message.message)}
                                        {
                                          message.message.adjunts?.length ?
                                            message.message.adjunts.map((ad, i) => {
                                                return (
                                                    <img src={ad.adjunt} key={i+1} alt="" />
                                                )
                                            })
                                          : <h1>No hay</h1>
                                        }
                                    </div>
                                </div>
                            </div>
                    :null
                }

            </div>
        </div>
    )
}