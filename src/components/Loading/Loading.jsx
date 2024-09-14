import React from 'react';
import { TbFidgetSpinner } from "react-icons/tb";
import './Loading.css'


export const Loading = ({ size }) => {

    return (
        <span className='loading__icon'><TbFidgetSpinner size={size}
            className='loading__icon'
        /></span>
    )
} 