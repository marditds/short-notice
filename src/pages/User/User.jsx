import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { Navigation } from '../../components/User/Navigation/Navigation';
import { useUserContext } from '../../lib/context/UserContext';
import { useUserInfo } from '../../lib/hooks/useUserInfo';
import { Loading } from '../../components/Loading/Loading';
import '../../components/User/Navigation/Navigation.css';

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
    }, [hasUsername]);


    if (isAppLoading) {
        return <div className='d-flex justify-content-center align-items-center'>
            <Loading classAnun={'me-2'} />Loading...
        </div>;
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
                {/* <Button style={{ marginTop: '65px' }} onClick={getSession}>get session details</Button> */}
                <Outlet />
            </Container>
        </Container>
    );
}

export default User; 