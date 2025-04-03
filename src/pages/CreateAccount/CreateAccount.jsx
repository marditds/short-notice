import React, { useState, useEffect } from 'react';
import { ID } from 'appwrite';
import { googleLogout } from '@react-oauth/google';
import { Container, Stack, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../lib/context/UserContext';
import { createUser, getUserByUsername, getAccount } from '../../lib/context/dbhandler';
import { AccountType } from '../../components/Setup/AccountType';
import './CreateAccount.css';
import { keysProvider } from '../../lib/context/keysProvider';
import ReCAPTCHA from 'react-google-recaptcha';
import { CreateUsername } from '../../components/Setup/CreateUsername';
import { SetPasscode } from '../../components/Setup/SetPasscode';
import useUserInfo from '../../lib/hooks/useUserInfo';
import { forbiddenUsrnms, usrnmMaxLngth } from '../../lib/utils/usernameUtils';
import { Loading } from '../../components/Loading/Loading';
import TOSList from '../../components/Legal/TOSList';
import CommunityGuidelinesList from '../../components/Support/CommunityGuidelinesList';
import PrivacyList from '../../components/Legal/PrivacyList';
import useLogin from '../../lib/hooks/useLogin';


const CreateAccount = () => {

    const navigate = useNavigate();

    const {
        setIsLoggedIn,
        userId, setUserId,
        username, setUsername,
        userEmail, setUserEmail,
        givenName, setGivenName,
        accountType, setAccountType,
        setHasAccountType,
        setHasUsername
    } = useUserContext();

    const {
        makePasscode,
        checkingEmailInAuth,
        registerUser,
        createSession,
        getSessionDetails,
    } = useUserInfo();

    const { isSetUserLoading, createUserInCollection } = useLogin();

    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const [captchaKey, setCaptchaKey] = useState(null);
    const [captchaSiteKey, setCaptchaSiteKey] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    const [passcode, setPasscode] = useState('');

    const [tosCheck, setTosCheck] = useState(false);

    const [privacyPolicyCheck, setPrivacyPolicyCheck] = useState(false);

    const [showTOSModal, setShowTOSModal] = useState(false);
    const [showCommGuideModal, setShowCommGuideModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const [isHandleDoneClickLoading, setIsHandleDoneClickLoading] = useState(false);
    // const [isSetUserLoading, setIsSetUserLoading] = useState(false);

    const onUsernameChange = (e) => {
        console.log('Input changed:', e.target.value);

        const usrnm = e.target.value.replace(/\s/g, '');
        setUsername(usrnm);
        setErrorMessage('');
    };

    const onPasscodeChange = (e) => {
        const input = e.target.value;

        console.log('input', input);

        if (/^\d{0,25}$/.test(input)) {
            setPasscode(input);

            if (input.length > 0 && input.length < 6) {
                return;
            }
        }
    };

    useEffect(() => {
        setPasscode('');
        console.log('ACCOUNT TYPE:', accountType);
        console.log('createUserInCollection type:', typeof createUserInCollection);

    }, [accountType])

    const handleTOSCheck = () => {
        setTosCheck(preVal => !preVal)
    }

    const handlePrivacyPolicyCheck = () => {
        setPrivacyPolicyCheck(preVal => !preVal)
    }

    const handleDoneClickCreateAccount = async () => {

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

        if (forbiddenUsrnms.includes(username)) {
            setErrorMsg(`The username ${username} is not allowed. Please choose a different username.`);
            return;
        }

        if (username.length > usrnmMaxLngth) {
            setErrorMessage(`The username cannot be longer than 16 characters. Please choose a shorter username.`);
            return;
        }

        try {
            setIsHandleDoneClickLoading(true);

            const existingUser = await getUserByUsername(username);
            if (existingUser) {
                setErrorMessage('Username already taken. Please choose another one.');
                return;
            }
            console.log('Going for createUserInCollection');

            console.log('About to call createUserInCollection, type:', typeof createUserInCollection);

            const authenticatedUser = await getAccount();

            console.log('RIGHT BEFORE CALLING SET USER:', username, authenticatedUser.email,
                authenticatedUser.$id,
                authenticatedUser.name);


            setUserEmail(authenticatedUser.email);
            setUserId(authenticatedUser.$id);
            setGivenName(authenticatedUser.name);

            await createUserInCollection();

            const usr = await getUserByUsername(username);

            console.log('usr id', usr.$id);
            console.log('passcode', passcode);
            console.log('accountType', accountType);

            setIsLoggedIn(true);

            if (accountType === 'organization' && passcode) {
                await makePasscode(usr.$id, passcode, accountType);
                console.log('Passcode stored successfully.');
            }

            if (username) {
                setHasUsername(true);

                console.log('BEFORE NAVIGATION - Username after createUserInCollection:', username);

                navigate('/user/profile');

                console.log('AFTER NAVIGATION - Username after createUserInCollection:', username);
            }
        } catch (error) {
            console.error('Error checking username:', error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setIsHandleDoneClickLoading(false);
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

    const handleShowCommGuideModal = () => {
        setShowCommGuideModal(true);
    }

    const handleCloseCommGuideModal = () => {
        setShowCommGuideModal(false);
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

    useEffect(() => {
        keysProvider('captcha', setCaptchaSiteKey);
    }, []);

    return (
        <Container className='
        createUsername__container 
        '>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleDoneClickCreateAccount();
                }}
                className='my-5 my-sm-0'>
                <Stack gap={3}>

                    <AccountType setAccountType={setAccountType} accountType={accountType} />

                    {/* Username and Password */}
                    <Row xs={1} sm={2} className='align-items-start'>
                        <Col>
                            <CreateUsername accountType={accountType} username={username} onUsernameChange={onUsernameChange} />

                            {errorMessage && <Alert variant="danger" className='alert'>{errorMessage}</Alert>}
                        </Col>
                        <Col>
                            <SetPasscode accountType={accountType} passcode={passcode} onPasscodeChange={onPasscodeChange} />
                        </Col>
                    </Row>

                    <Row className='flex-column'>
                        {/* TOS */}
                        <Col>
                            <Form.Check
                                label={
                                    <span className='createAccount__form-check-text'>
                                        I have read and agree to the
                                        <Button onClick={handleShowTOSModal} className='mx-1 createAccount__form-check-text-btn'>
                                            Terms of Services
                                        </Button>
                                        and
                                        <Button onClick={handleShowCommGuideModal} className='ms-1 createAccount__form-check-text-btn'>
                                            Community Guidelines
                                        </Button>
                                        .
                                    </span>}
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
                                label={<span>I have read and agree to the <Button onClick={handleShowPrivacyModal} className='ms-1'>Privacy Policy</Button>.</span>}
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
                        {
                            captchaSiteKey ?
                                <ReCAPTCHA
                                    className='hakobos'
                                    sitekey={captchaSiteKey}
                                    onChange={(value) => onCaptchaChange(value)}
                                    onExpired={() => setIsCaptchaVerified(false)}
                                    onErrored={() => {
                                        setIsCaptchaVerified(false);
                                        setErrorMessage('ReCAPTCHA verification failed. Please try again.');
                                    }}
                                /> :
                                <><Loading /> Loading ReCAPTCHA</>
                        }
                    </div>

                    {/* Create Account Buttons */}
                    <div className='mb-5 mb-sm-0 d-flex justify-content-between justify-content-sm-start'>
                        <Button
                            type='submit'
                            // onClick={handleDoneClick}
                            disabled={!isCaptchaVerified || !username || username.trim() === '' || username.includes(' ') || username === 'profile' || (accountType === 'organization' && passcode.length < 6) || tosCheck !== true || privacyPolicyCheck !== true || !accountType || isHandleDoneClickLoading}
                            className='createAccount__btn'
                        >
                            {
                                (isSetUserLoading || isHandleDoneClickLoading) ?
                                    <Loading /> :
                                    'Done'
                            }
                        </Button>
                        <Button
                            type='button'
                            onClick={() => {
                                // googleLogout();
                                setIsLoggedIn(preVal => false)
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
            <Modal show={showTOSModal} onHide={handleCloseTOSModal} className='createAccount__agreement-modal'>
                {/* <Modal.Header className='border-bottom-0 pb-0'> 
                </Modal.Header> */}
                <Modal.Body className='createAccount__agreement-modal-body px-2'>
                    <TOSList />
                </Modal.Body>
                <Modal.Footer className='border-top-0 pt-0'>
                    <Button onClick={handleCloseTOSModal} className='mx-0 createAccount__btn'>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Community Guidelines */}
            <Modal show={showCommGuideModal} onHide={handleCloseCommGuideModal} className='createAccount__agreement-modal'>
                {/* <Modal.Header className='border-bottom-0 pb-0 px-0 px-md-2'></Modal.Header> */}
                <Modal.Body className='createAccount__agreement-modal-body px-0 px-md-2'>
                    <CommunityGuidelinesList />
                </Modal.Body>
                <Modal.Footer className='border-top-0 pt-0'>
                    <Button onClick={handleCloseCommGuideModal} className='mx-0 createAccount__btn'>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Privacy Policy Modal */}
            <Modal show={showPrivacyModal} onHide={handleClosePrivacyModal} className='createAccount__agreement-modal'>
                {/* <Modal.Header className='border-bottom-0 pb-0'> </Modal.Header> */}
                <Modal.Body className='createAccount__agreement-modal-body'>
                    <PrivacyList />
                </Modal.Body>
                <Modal.Footer className='border-top-0 pt-0'>
                    <Button onClick={handleClosePrivacyModal} className='mx-0 createAccount__btn'>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


        </Container>

    )
};

export default CreateAccount;