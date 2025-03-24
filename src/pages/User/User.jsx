import React, { useEffect, useState } from 'react';
import { getUserByEmail } from '../../lib/context/dbhandler';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Navigation } from '../../components/User/Navigation/Navigation';
import { googleLogout } from '@react-oauth/google';
import { useUserContext } from '../../lib/context/UserContext';
import useUserInfo from '../../lib/hooks/useUserInfo';
import { Loading } from '../../components/Loading/Loading';
import '../../components/User/Navigation/Navigation.css';

const User = () => {

    const {
        setGoogleUserData,
        setIsLoggedIn,
        accountType,
        username,
        googleUserData,
        isAppLoading,
        setIsAppLoading,
        setUsername,
        setHasUsername
    } = useUserContext();

    const location = useLocation();

    const navigate = useNavigate();

    const { userId, removeSession } = useUserInfo(googleUserData.email);

    const [loadingAuth, setLoadingAuth] = useState(false);

    useEffect(() => {
        console.log('googleUserData:', googleUserData);
    }, [googleUserData])

    // Ensure we have the google data on direct URL access
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const storedEmail = localStorage.getItem('email');
            const storedGoogleUserData = localStorage.getItem('googleUserData');

            console.log('storedGoogleUserData', storedGoogleUserData);
            console.log('storedEmail', storedEmail);

            if (!accessToken || !storedEmail) {
                navigate('/');
                return;
            }

            try {
                setLoadingAuth(true);
                setIsAppLoading(true);

                if (!googleUserData && storedGoogleUserData) {
                    const parsedData = JSON.parse(storedGoogleUserData);

                    console.log('parsedData', parsedData);

                    setGoogleUserData(parsedData);
                    setIsLoggedIn(true);
                    console.log('Rehydrated googleUserData from localStorage:', parsedData);
                }
            } catch (error) {
                console.error("Error initializing auth in User component:", error);
                navigate('/');
                return;
            } finally {
                setLoadingAuth(false);
                setIsAppLoading(false);
            }
        };

        initializeAuth();
    }, []);

    if (isAppLoading || loadingAuth) {
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