import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Home from './Home/Home';
import './PreLogin.css';

const PreLogin = () => {

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <>
            {
                location.pathname === '/' && <Home />
            }
            <Outlet />
        </>

    )
}

export default PreLogin
