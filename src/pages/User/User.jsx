import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Navigation } from '../../components/User/Navigation/Navigation';
import { useUserContext } from '../../lib/context/UserContext';
import { useUserInfo } from '../../lib/hooks/useUserInfo';
import '../../components/User/Navigation/Navigation.css';
import { LoadingComponent } from '../../components/Loading/LoadingComponent';

const User = () => {

    const {
        setIsLoggedIn,
        userId, setUserId,
        userEmail, setUserEmail,
        setUsername,
        hasUsername, setHasUsername,
        accountType, setAccountType,
        isAppLoading, setIsAppLoading,
        isSessionInProgress
    } = useUserContext();

    const location = useLocation();

    const navigate = useNavigate();

    const { removeSession } = useUserInfo(userEmail);

    // redirect to feed on /user, /user/
    useEffect(() => {
        if (hasUsername) {
            console.log('HAS USERNAME IS TRUE!');

            const currentPath = window.location.pathname;

            if (currentPath === '/user' && isSessionInProgress) {
                navigate('/user/feed');
            }

            if (currentPath === '/user/' && isSessionInProgress) {
                navigate('/user/feed');
            }
        }
    }, [hasUsername, isSessionInProgress]);


    if (isAppLoading) {
        return <LoadingComponent />;
    }

    return (
        <Container fluid className='w-100 p-0 px-lg-1'>
            <Navigation
                userId={userId}
                removeSession={removeSession}
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
                <Outlet />
            </Container>
        </Container>
    );
}

export default User; 