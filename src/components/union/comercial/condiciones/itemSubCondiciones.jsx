import React from 'react';

export default function SubCondicions({p}){
    return (
        <div className="subCondicions">
            <div className="containerSubCondicions">
                <div className="step">
                    <h3>{p.orden}</h3>
                </div>
                <div className="description">
                    <h3>{p.description}</h3>
                </div>
                <div className="momentoPago">
                    <span>{p.momentoPago}</span>
                </div>
            </div>
        </div>
    )
}