import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthSession, deleteUserSession, getUserByEmail } from '../../../lib/context/dbhandler';
import { Button, Container } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { useUserContext } from '../../../lib/context/UserContext';

const Authenticate = () => {

    const navigate = useNavigate();

    const {
        setIsLoggedIn,
        setUserId,
        userEmail, setUserEmail,
        setGivenName,
        user, setUser,
        isSessionInProgress,
        isCheckEmailExistanceLoading, setIsCheckEmailExistanceLoading,
    } = useUserContext();

    const hasAuthenticated = useRef(false);
    const [emailExistsInCollection, setEmailExistsInCollection] = useState(false);

    // Authenticating User
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
        const secret = params.get('secret');

        const authenticateUser = async () => {
            if (hasAuthenticated.current || !userId || !secret) return;

            hasAuthenticated.current = true;

            try {
                console.log('Starting authenticateUser in <Authenticate/>.');

                const authenticatedUser = await handleOAuthSession(userId, secret);
                console.log('THIS IS authenticatedUser:', authenticatedUser);

                setUserEmail(authenticatedUser.email);
                setUserId(authenticatedUser.$id);
                setGivenName(authenticatedUser.name);

                setUser(authenticatedUser);

            } catch (err) {
                console.error('Authentication failed. Please try again.', err);
            } finally {
                console.log('Finishing authenticateUser in <Authenticate/>.');
            }
        };

        if (!isSessionInProgress) {
            authenticateUser();
        }
    }, [isSessionInProgress]);

    const handleContinue = () => {
        navigate('/set-username');
    };

    useEffect(() => {
        console.log('USER EMAIL,', userEmail);

        const checkEmailExistsInCollection = async () => {
            try {
                console.log('Checking email existance.');
                setIsCheckEmailExistanceLoading(true);

                const res = await getUserByEmail(userEmail);
                if (res) {
                    console.log('Email found in collection.');
                    setEmailExistsInCollection(true);
                } else {
                    console.log('Email not found in collection.');
                }
            } catch (error) {
                console.error('Erro checking email in collection:', error);
            } finally {
                setIsCheckEmailExistanceLoading(false);
                console.log('Finish fhecking email existance.');
            }
        }
        if (user) {
            checkEmailExistsInCollection();
        }
    }, [user])

    useEffect(() => {
        if (emailExistsInCollection) {
            console.log('DOES EMAIL EXIST?', emailExistsInCollection);

            setIsLoggedIn(true);
            navigate('/user/feed');
        }
    }, [emailExistsInCollection])


    // Getting things ready
    if (isCheckEmailExistanceLoading) {
        return (
            <Container>
                <Loading classAnun='me-2' /> Getting things ready. Hang tight.
            </Container>
        )
    }

    return (
        <Container>
            <div className='d-flex justify-content-center align-items-center'>
                Hello!
                <br />

                {/* Navigate to /set-username or cancel */}
                {(!emailExistsInCollection) ?
                    <>
                        Please press continue to set up your account.
                        <br />
                        <Button onClick={handleContinue}>
                            Continue
                        </Button>
                        <Button onClick={async () => {
                            await deleteUserSession();
                            navigate('/')
                        }}>
                            Cancel
                        </Button>
                    </>
                    :
                    <>
                        Welcome to ShortNotice.
                    </>
                }
            </div>
        </Container>
    );
}

export default Authenticate