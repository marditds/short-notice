import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthSession, getUserByEmail } from '../../../lib/context/dbhandler';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { LoadingSpinner } from '../../../components/Loading/LoadingSpinner';
import { useUserContext } from '../../../lib/context/UserContext';
import { useLogin } from '../../../lib/hooks/useLogin';
import { screenUtils } from '../../../lib/utils/screenUtils';
import sn_logo from '../../../assets/sn_long.png';
import '../../../components/Authenticate/Authenticate.css';

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
        isAppLoading, isFetchingUserinContextLoading
    } = useUserContext();

    const { isSetupCancellationLoading, cancelAccountSetup } = useLogin();

    const hasAuthenticated = useRef(false);
    const [emailExistsInCollection, setEmailExistsInCollection] = useState(false);

    const { isSmallScreen } = screenUtils();


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
    useEffect(() => {
        if (emailExistsInCollection) {
            console.log('DOES EMAIL EXIST?', emailExistsInCollection);

            setIsLoggedIn(true);
            navigate('/user/feed');
        }
    }, [emailExistsInCollection])

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
    if (isCheckEmailExistanceLoading || isSetupCancellationLoading || userEmail === null || isAppLoading || isFetchingUserinContextLoading) {
        return <div className='min-vh-100'>
            <Container className='min-vh-100 flex-grow-1'>
                <Row className='min-vh-100 flex-grow-1  justify-content-center align-items-center'>
                    <Col className='d-flex justify-content-center align-items-center'>
                        <LoadingSpinner classAnun='me-2' />
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
        <div className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Container >
                <Row className='authenticate__hello flex-column  justify-content-center align-items-center'>
                    <Col xs={11} sm={7} md={7} lg={5} xl={4} className='d-flex justify-content-start align-items-end'>
                        Hello!
                        <br />
                    </Col>

                    {/* Navigate to /set-username or cancel */}
                    {(!emailExistsInCollection) ?
                        <Col xs={11} sm={7} md={7} lg={5} xl={4}>
                            <p className='d-flex align-items-baseline authenticate__thank-you'>
                                Thank you for choosing <Image
                                    src={sn_logo}
                                    alt='logo'
                                    className='ms-2 authenticate__thank-you-logo'
                                    fluid
                                />.
                            </p>
                            <p>
                                Please press continue to finish setting up your account.
                            </p>
                            <div className='d-flex'>
                                <Button onClick={onCancelClick} disabled={userEmail === null} className='authenticate__btn'>
                                    Cancel
                                </Button>

                                <Button onClick={onContinueClick} disabled={userEmail === null} className='authenticate__btn'>
                                    Continue
                                </Button>
                            </div>
                        </Col>
                        :
                        <Col xs={11} sm={7} md={7} lg={5} xl={4} className='d-flex align-items-baseline'>
                            Welcome to
                            <Image
                                src={sn_logo}
                                height={!isSmallScreen ? '25px' : '15px'}
                                alt='logo'
                                className='ms-2'
                            />.
                        </Col>
                    }
                </Row>
            </Container>
        </div>
    );
}

export default Authenticate