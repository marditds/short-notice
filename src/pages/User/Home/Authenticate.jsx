import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthSession, getUserByEmail } from '../../../lib/context/dbhandler';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { useUserContext } from '../../../lib/context/UserContext';
import { useLogin } from '../../../lib/hooks/useLogin';
import sn_logo from '../../../assets/sn_long.png';

const Authenticate = () => {

    const navigate = useNavigate();

    const {
        setIsLoggedIn,
        userId, setUserId,
        userEmail, setUserEmail,
        setGivenName,
        user, setUser,
        isSessionInProgress,
        isCheckEmailExistanceLoading, setIsCheckEmailExistanceLoading,
    } = useUserContext();

    const { isSetupCancellationLoading, cancelAccountSetup } = useLogin();

    const hasAuthenticated = useRef(false);
    const [emailExistsInCollection, setEmailExistsInCollection] = useState(false);


    // Authenticating User
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
        const secret = params.get('secret');

        console.log('THESE ARE THE PARAMS:', params);

        if (params.size === 0) {
            navigate('/');
        }

        const authenticateUser = async () => {
            if (hasAuthenticated.current || !userId || !secret) {
                return;
            }

            hasAuthenticated.current = true;

            try {
                console.log('Starting authenticateUser in <Authenticate/>.');

                const authenticatedUser = await handleOAuthSession(userId, secret);
                console.log('THIS IS authenticatedUser:', authenticatedUser);

                setUserEmail(authenticatedUser.email);
                setUserId(authenticatedUser.$id);
                // setUsername(authenticatedUser.name);
                setGivenName(authenticatedUser.name);
                setUser(authenticatedUser);

            } catch (err) {
                console.error('Authentication failed. Please try again.', err);
            } finally {
                console.log('Finishing authenticateUser in <Authenticate/>.');
            }
        };

        if (!isSessionInProgress) {
            console.log('CALLING authenticateUser.');
            authenticateUser();
            console.log('FINISHED CALLING authenticateUser.');
        }
    }, [isSessionInProgress]);

    // Check Emaik in Collection
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
                console.error('Error checking email in collection:', error);
            } finally {
                setIsCheckEmailExistanceLoading(false);
                console.log('Finish checking email existance.');
            }
        }
        if (user) {
            console.log('CALLING checkEmailExistsInCollection().');
            checkEmailExistsInCollection();
            console.log('DONE calling checkEmailExistsInCollection().');
        }
    }, [user])

    // Redirect to /user/feed if email in collection
    // useEffect(() => {
    //     if (emailExistsInCollection) {
    //         console.log('DOES EMAIL EXIST?', emailExistsInCollection);

    //         setIsLoggedIn(true);
    //         navigate('/user/feed');
    //     }
    // }, [emailExistsInCollection])

    useEffect(() => {
        console.log('userId in Authenticate:', userId);
    }, [userId])

    const onContinueClick = () => {
        navigate('/set-username');
    };

    const onCancelClick = async () => {
        await cancelAccountSetup(userId);
    }

    // Getting things ready
    if (isCheckEmailExistanceLoading || isSetupCancellationLoading || userEmail === null) {
        return <div className='min-vh-100'>
            <Container className='min-vh-100 flex-grow-1'>
                <Row className='min-vh-100 flex-grow-1  justify-content-center align-items-center'>
                    <Col className='d-flex justify-content-center align-items-center'>
                        <Loading classAnun='me-2' />
                        {
                            (isCheckEmailExistanceLoading || userEmail === null) && 'Getting things ready. Hang tight.'
                        }
                        {
                            isSetupCancellationLoading && 'Cancelling your account creation. Please wait...'
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    }

    return (
        <Container>
            <div className='d-flex justify-content-center align-items-center'>
                Hello!
                <br />

                {/* Navigate to /set-username or cancel */}
                {(!emailExistsInCollection) ?
                    <>
                        Thank you for choosing ShortNotice. Please press continue to set up your account.
                        <br />
                        <Button onClick={onContinueClick} disabled={userEmail === null}>
                            Continue
                        </Button>
                        <Button onClick={onCancelClick} disabled={userEmail === null}>
                            Cancel
                        </Button>
                    </>
                    :
                    <>
                        Welcome to
                        <Image
                            src={sn_logo}
                            height={'25px'}
                            alt='logo'
                            className='ms-2 align-items-center'
                        />.
                    </>
                }
            </div>
        </Container>
    );
}

export default Authenticate