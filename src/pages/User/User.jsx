import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Navigation } from '../../components/User/Navigation/Navigation';
import { googleLogout } from '@react-oauth/google';
import { useUserContext } from '../../lib/context/UserContext';
import useUserInfo from '../../lib/hooks/useUserInfo';
import { Loading } from '../../components/Loading/Loading';
import '../../components/User/Navigation/Navigation.css';

const User = () => {

    const { setGoogleUserData,
        setIsLoggedIn,
        username,
        googleUserData,
        isLoading } = useUserContext();

    const { userId, removeSession } = useUserInfo(googleUserData);

    useEffect(() => {
        console.log('googleUserData:', googleUserData);
    }, [googleUserData])


    if (isLoading) {
        // console.log('Rendering loading state');
        return <Loading />;
    }

    if (!isLoading && (!username || !googleUserData)) {
        // console.log('Redirecting to home due to missing data');
        return <Navigate to="/" />;
    }

    // console.log('Rendering User component');
    return (
        <Container className='userhome__body'>
            <Navigation
                userId={userId}
                removeSession={removeSession}
                googleLogout={googleLogout}
                setGoogleUserData={setGoogleUserData}
                setIsLoggedIn={setIsLoggedIn}
            />
            <Outlet />

        </Container>
    );
}

export default User; 