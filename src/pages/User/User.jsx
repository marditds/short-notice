import React, { useEffect, useState } from 'react';
import { getUserByEmail, getSession } from '../../lib/context/dbhandler';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { Navigation } from '../../components/User/Navigation/Navigation';
// import { googleLogout } from '@react-oauth/google';
import { useUserContext } from '../../lib/context/UserContext';
import { useUserInfo } from '../../lib/hooks/useUserInfo';
import { Loading } from '../../components/Loading/Loading';
import '../../components/User/Navigation/Navigation.css';

const User = () => {

    const {
        isLoggedIn, setIsLoggedIn,
        userId, setUserId,
        userEmail, setUserEmail,
        username, setUsername,
        registeredUsername, setRegisteredUsername,
        hasUsername, setHasUsername,
        accountType, setAccountType,
        hasAccountType, setHasAccountType,
        isAppLoading, setIsAppLoading
    } = useUserContext();

    const location = useLocation();

    const navigate = useNavigate();

    const { removeSession } = useUserInfo(userEmail);

    const [loadingAuth, setLoadingAuth] = useState(false);

    // Ensure we have the google data on direct URL access
    // useEffect(() => {
    //     const initializeAuth = async () => {
    //         const accessToken = localStorage.getItem('accessToken');
    //         // const storedEmail = localStorage.getItem('email');
    //         const storedGoogleUserData = localStorage.getItem('googleUserData');

    //         console.log('storedGoogleUserData', storedGoogleUserData);
    //         console.log('storedEmail', storedEmail);

    //         if (!accessToken) {
    //             navigate('/');
    //             return;
    //         }

    //         try {
    //             setLoadingAuth(true);
    //             setIsAppLoading(true);

    //             if (!googleUserData && storedGoogleUserData) {
    //                 const parsedData = JSON.parse(storedGoogleUserData);

    //                 console.log('parsedData', parsedData);

    //                 setGoogleUserData(parsedData);
    //                 setIsLoggedIn(true);
    //                 console.log('Rehydrated googleUserData from localStorage:', parsedData);
    //             }
    //         } catch (error) {
    //             console.error("Error initializing auth in User component:", error);
    //             navigate('/');
    //             return;
    //         } finally {
    //             setLoadingAuth(false);
    //             setIsAppLoading(false);
    //         }
    //     };

    //     initializeAuth();
    // }, []);

    if (isAppLoading || loadingAuth) {
        return <div className='d-flex justify-content-center align-items-center'>
            <Loading classAnun={'me-2'} />Loading...
        </div>;
    }

    return (
        <Container fluid className='w-100 p-0 px-lg-1'>
            <Navigation
                userId={userId}
                removeSession={removeSession}
                // googleLogout={googleLogout}
                setIsLoggedIn={setIsLoggedIn}
                accountType={accountType}
                setIsAppLoading={setIsAppLoading}
                setUserId={setUserId}
                setUserEmail={setUserEmail}
                setUsername={setUsername}
                setHasUsername={setHasUsername}
                setAccountType={setAccountType}
            />
            <Container
                className='userhome__body'
                style={{ maxWidth: location.pathname !== '/user/feed' ? '1320px' : '100%' }}
            >
                {/* <Button style={{ marginTop: '65px' }} onClick={getSession}>get session details</Button> */}
                <Outlet />
            </Container>
        </Container>
    );
}

export default User; 