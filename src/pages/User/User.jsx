import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Tools } from '../../components/User/Tools';
import { googleLogout } from '@react-oauth/google';
import { useUserContext } from '../../lib/context/UserContext';
import { Loading } from '../../components/Loading/Loading';
import './User.css';

const User = () => {
    const { setGoogleUserData, setIsLoggedIn, username, googleUserData, isLoading } = useUserContext();



    if (isLoading) {
        console.log('User.jsx - Rendering loading state');
        return <Loading />;
    }

    if (!isLoading && (!username || !googleUserData)) {
        console.log('User.jsx - Redirecting to home due to missing data');
        return <Navigate to="/" />;
    }

    console.log('User.jsx - Rendering User component');
    return (
        <Container className='userhome__body'>
            <Tools
                googleLogout={googleLogout}
                setGoogleUserData={setGoogleUserData}
                setIsLoggedIn={setIsLoggedIn}
            />
            <Outlet />

        </Container>
    );
}

export default User; 