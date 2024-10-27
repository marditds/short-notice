import React from 'react';
import { TbFidgetSpinner } from "react-icons/tb";
import './Loading.css'


export const Loading = ({ size, color }) => {

    return (
        <span className='loading__icon'>
            <TbFidgetSpinner
                size={size}
                color={color}
                className='loading__icon'
            /></span>
    )
} 