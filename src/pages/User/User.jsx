import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
        accountType,
        username,
        googleUserData,
        isAppLoading } = useUserContext();

    const location = useLocation();

    const navigate = useNavigate();

    const { userId, removeSession } = useUserInfo(googleUserData);

    useEffect(() => {
        console.log('googleUserData:', googleUserData);
    }, [googleUserData])

    useEffect(() => {
        if (!isAppLoading && (!username || !googleUserData)) {
            navigate('/');
        }
    }, [isAppLoading, username, googleUserData, navigate]);

    if (isAppLoading) {
        return <div className='d-flex justify-content-center align-items-center'>
            <Loading classAnun={'me-2'} />Loading...
        </div>;
    }

    return (
        <Container fluid className='w-100 p-0 px-lg-1'>
            <Navigation
                googleUserData={googleUserData}
                userId={userId}
                removeSession={removeSession}
                googleLogout={googleLogout}
                setGoogleUserData={setGoogleUserData}
                setIsLoggedIn={setIsLoggedIn}
                accountType={accountType}
            />
            <Container
                className='userhome__body'
                style={{ maxWidth: location.pathname !== '/user/feed' ? '1320px' : '100%' }}
            >
                <Outlet />
            </Container>
        </Container>
    );
}

export default User; 