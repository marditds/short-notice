import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
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
        isLoading } = useUserContext();

    const location = useLocation();

    const { userId, removeSession } = useUserInfo(googleUserData);

    useEffect(() => {
        console.log('googleUserData:', googleUserData);
    }, [googleUserData])

    if (isLoading) {
        return <Loading />;
    }

    if (!isLoading && (!username || !googleUserData)) {
        return <Navigate to="/" />;
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

            {/* <div className={` position-relative ${(location.pathname === '/user/feed' && isExtraLargeScreen) ? 'd-block' : 'd-none'}`} style={{ marginTop: '88px' }}>
               
            </div> */}

            <Container
                className='userhome__body'
                style={{ maxWidth: location.pathname !== '/user/feed' ? '1320px' : '100%' }}
            // className={`${location.pathname === '/user/feed' && 'ms-xxl-0 me-xxl-0 w-100'} `}
            >
                {/* <Container className='userhome__body'
              ${location.pathname === '/user/feed' ? (isExtraLargeScreen ? 'w-75' : 'w-100') : 'w-100'} userhome__body`}
              > */}

                <Outlet />

            </Container>
        </Container>
    );
}

export default User; 