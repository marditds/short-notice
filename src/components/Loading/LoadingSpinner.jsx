import React from 'react';
import { TbFidgetSpinner } from "react-icons/tb";
import './Loading.css'


export const LoadingSpinner = ({ size, color, classAnun }) => {

    return (
        <span>
            <TbFidgetSpinner
                size={size}
                color={color}
                className={'loading__icon ' + classAnun}
            />
        </span>
    )
} 