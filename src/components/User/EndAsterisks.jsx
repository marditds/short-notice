import React from 'react';

export const EndAsterisks = ({ componentName }) => {
    return (
        <div className={`${componentName}__end-asterisks`} >
            <i className="bi bi-asterisk"></i>
            <i className="bi bi-asterisk"></i>
            <i className="bi bi-asterisk"></i>
        </div>
    )
}
