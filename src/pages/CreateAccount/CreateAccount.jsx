import React, { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { Container, Stack, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../lib/context/UserContext';
import { getUserByUsername } from '../../lib/context/dbhandler';
import { AccountType } from '../../components/Setup/AccountType';
import './CreateAccount.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { CreateUsername } from '../../components/Setup/CreateUsername';
import { SetPasscode } from '../../components/Setup/SetPasscode';
import useUserInfo from '../../lib/hooks/useUserInfo';

const CreateAccount = ({ setUser }) => {

    const navigate = useNavigate();

    const {
        username,
        setUsername,
        setHasUsername,
        setGoogleUserData,
        setIsLoggedIn,
        accountType,
        setAccountType
    } = useUserContext();

    const { makePasscode } = useUserInfo();

    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const [captchaKey, setCaptchaKey] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    const [passcode, setPasscode] = useState('');

    const [tosCheck, setTosCheck] = useState(false);

    const [privacyPolicyCheck, setPrivacyPolicyCheck] = useState(false);

    const [showTOSModal, setShowTOSModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const onUsernameChange = (e) => {
        console.log('Input changed:', e.target.value);

        const usrnm = e.target.value.replace(/\s/g, '');
        setUsername(usrnm);
        setErrorMessage('');
    };

    const onPasscodeChange = (e) => {
        const input = e.target.value;

        if (input.length === 6) {
            setPasscode(input);
            setErrorMessage('');
        } else {
            setErrorMessage('Passcode must be exactly 6 characters long.');
        }
    }

    const handleTOSCheck = () => {
        setTosCheck(preVal => !preVal)
    }

    const handlePrivacyPolicyCheck = () => {
        setPrivacyPolicyCheck(preVal => !preVal)
    }

    const handleDoneClick = async () => {

        if (!isCaptchaVerified) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }

        if (!username || username.trim() === '') {
            setErrorMessage('Username cannot be empty. Please enter a valid username.');
            return;
        }

        if (username.includes(' ')) {
            setErrorMessage('Username cannot contain spaces. Please remove any spaces.');
            return;
        }

        if (username === 'profile') {
            setErrorMessage('The username \'profile\' is not allowed. Please choose a different username.');
            return;
        }

        try {
            const existingUser = await getUserByUsername(username);
            if (existingUser) {
                setErrorMessage('Username already taken. Please choose another one.');
                return;
            }

            console.log('Going for setUser');

            await setUser();

            const usr = await getUserByUsername(username);

            console.log('usr id', usr.$id);
            console.log('passcode', passcode);
            console.log('accountType', accountType);


            if (accountType === 'organization' && passcode) {
                await makePasscode(usr.$id, passcode, accountType);
                console.log('Passcode stored successfully.');
            }

            if (username) {
                setHasUsername(true);

                console.log('BEFORE NAVIGATION - Username after setUser:', username);

                navigate('/user/profile');

                console.log('AFTER NAVIGATION - Username after setUser:', username);

            }
        } catch (error) {
            console.error('Error checking username:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const onCaptchaChange = (value) => {

        if (value || value !== null) {
            // console.log(value);
            setCaptchaKey(value);
            setIsCaptchaVerified(true);
        }

        if (value === null) {
            setIsCaptchaVerified(false);
        }

    };

    const handleShowTOSModal = () => {
        setShowTOSModal(true);
    }

    const handleCloseTOSModal = () => {
        setShowTOSModal(false);
    }

    const handleShowPrivacyModal = () => {
        setShowPrivacyModal(true);
    }

    const handleClosePrivacyModal = () => {
        setShowPrivacyModal(false);
    }

    useEffect(() => {
        // console.log('captchaKey:', captchaKey);
        if (isCaptchaVerified === false) {
            setCaptchaKey(null);
        }
    }, [captchaKey, isCaptchaVerified])



    return (
        <Container className='
        createUsername__container 
        '>
            <Form className='my-5 my-sm-0'>
                <Stack gap={3}>

                    <AccountType setAccountType={setAccountType} accountType={accountType} />

                    {/* Text Fields */}
                    <Row xs={1} sm={2} className='align-items-end'>
                        <Col>
                            <CreateUsername accountType={accountType} username={username} onUsernameChange={onUsernameChange} />

                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        </Col>
                        <Col>
                            <SetPasscode accountType={accountType} passcode={passcode} onPasscodeChange={onPasscodeChange} />
                        </Col>
                    </Row>

                    <Row className='flex-column'>
                        {/* TOS */}
                        <Col>
                            <Form.Check
                                label={<span>I have read and understood the <Button onClick={handleShowTOSModal} className='ms-1'>terms of services</Button>.</span>}
                                type='checkbox'
                                id='tosCheckbox'
                                onChange={handleTOSCheck}
                                className='createUsername__checkbox 
                                 
                                '
                            />
                        </Col>

                        {/* PRivacy Policy */}
                        <Col>
                            <Form.Check
                                label={<span>I have read and understood the <Button onClick={handleShowPrivacyModal} className='ms-1'>privacy policy</Button>.</span>}
                                type='checkbox'
                                id='privacyPolicyCheckbox'
                                onChange={handlePrivacyPolicyCheck}
                                className='createUsername__checkbox 
                                 
                                '
                            />
                        </Col>
                    </Row>

                    {/* ReCAPTCHA */}
                    <div className='mb-3'>
                        <ReCAPTCHA
                            className='hakobos'
                            sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
                            onChange={(value) => onCaptchaChange(value)}
                            onExpired={() => setIsCaptchaVerified(false)}
                            onErrored={() => {
                                setIsCaptchaVerified(false);
                                setErrorMessage('ReCAPTCHA verification failed. Please try again.');
                            }}
                        />
                    </div>

                    <div className='mb-5 mb-sm-0 d-flex justify-content-between justify-content-sm-start'>
                        <Button
                            onClick={handleDoneClick}
                            disabled={!isCaptchaVerified || !username || username.trim() === '' || username.includes(' ') || username === 'profile' || (accountType === 'organization' && passcode.length !== 6) || tosCheck !== true || privacyPolicyCheck !== true}
                            className='createAccount__btn'
                        >
                            Done
                        </Button>
                        <Button
                            onClick={() => {
                                googleLogout();
                                setIsLoggedIn(preVal => false)
                                setGoogleUserData(null);
                                localStorage.removeItem('accessToken');
                                console.log('Logged out successfully.');
                                window.location.href = '/';

                            }}
                            className='createAccount__btn ms-sm-2'>
                            Cancel
                        </Button>
                    </div>
                </Stack>
            </Form>

            {/* TOS Modal */}
            <Modal show={showTOSModal} onHide={handleCloseTOSModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTOSModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Privacy Policy Modal */}
            <Modal show={showPrivacyModal} onHide={handleClosePrivacyModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePrivacyModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


        </Container>

    )
};

export default CreateAccount;