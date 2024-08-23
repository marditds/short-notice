import React from 'react';
import { TbFidgetSpinner } from "react-icons/tb";
import './Loading.css'


export const Loading = () => {

    return (
        <span className='loading__icon'><TbFidgetSpinner
            className='loading__icon'
        /></span>
    )
} 