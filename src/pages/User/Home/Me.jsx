import React, { useEffect, useRef, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { handleOAuthSession, getAccount, deleteUserSession, getUserByEmail } from '../../../lib/context/dbhandler';
import { Button } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { useUserContext } from '../../../lib/context/UserContext';

const Me = () => {

    const navigate = useNavigate();

    const { googleUserData, setGoogleUserData,
        isLoggedIn, setIsLoggedIn,
        userId, setUserId,
        userEmail, setUserEmail,
        username, setUsername,
        givenName, setGivenName,
        registeredUsername, setRegisteredUsername,
        hasUsername, setHasUsername,
        accountType, setAccountType,
        hasAccountType, setHasAccountType,
        isAppLoading, setIsAppLoading } = useUserContext();

    const [user, setUser] = useState(null);
    const [isSessionInProgress, setIsSessionInProgress] = useState(false);
    const hasAuthenticated = useRef(false);
    const [emailExistsInCollection, setEmailExistsInCollection] = useState(false);

    // Checkig Session Status
    useEffect(() => {
        const checkingSessionStatus = async () => {
            try {
                const usr = await getAccount();
                if (usr) {
                    console.log('Session in progress.');
                    setIsSessionInProgress(true);
                    setUserEmail(usr.email);
                    setUserId(usr.$id);
                    setGivenName(usr.name);
                    setUser(usr);
                } else {
                    setIsSessionInProgress(false);
                }
            } catch (error) {
                console.error('Error checking session status:', error);
            }
        };
        checkingSessionStatus();
    }, [])

    // Authenticating User
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
        const secret = params.get('secret');

        const authenticateUser = async () => {
            if (hasAuthenticated.current || !userId || !secret) return;

            hasAuthenticated.current = true;

            try {
                const authenticatedUser = await handleOAuthSession(userId, secret);
                console.log('THIS IS authenticatedUser:', authenticatedUser);

                setUserEmail(authenticatedUser.email);
                setUserId(authenticatedUser.$id);
                setGivenName(authenticatedUser.name);

                setUser(authenticatedUser);

            } catch (err) {
                console.error('Authentication failed. Please try again.', err);
            }
        };

        if (!isSessionInProgress) {
            authenticateUser();
        }
    }, [isSessionInProgress]);

    useEffect(() => {
        console.log('USER IN ME:', user);
    }, [user])

    useEffect(() => {
        console.log('isSessionInProgress:', isSessionInProgress);
    }, [isSessionInProgress])

    const handleContinue = () => {
        navigate('/set-username');
    };

    useEffect(() => {
        console.log('USER EMAIL,', userEmail);

        const checkEmailExistsInCollection = async () => {
            const res = await getUserByEmail(userEmail);
            if (res) {
                setEmailExistsInCollection(true);
            }
        }
        checkEmailExistsInCollection();
    }, [])

    return (
        <div style={{ marginTop: '250px' }}>
            Hello! Welcome to ShortNotice.
            <br />
            Please press continue to set up your account.
            <br />
            {!emailExistsInCollection ?
                <><Button onClick={handleContinue}>Continue</Button>
                    <Button onClick={deleteUserSession}>Cancel</Button></>
                : 'Getting things ready. Hang tight.'}

        </div>
    );
}

export default Me