import React, { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { Container, Stack, Row, Col, Form, Button, Alert, Modal, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../lib/context/UserContext';
import { getUserByUsername } from '../../lib/context/dbhandler';
import { AccountType } from '../../components/Setup/AccountType';
import './CreateAccount.css';
import { keysProvider } from '../../lib/context/keysProvider';
import ReCAPTCHA from 'react-google-recaptcha';
import { CreateUsername } from '../../components/Setup/CreateUsername';
import { SetPasscode } from '../../components/Setup/SetPasscode';
import useUserInfo from '../../lib/hooks/useUserInfo';
import { tosData } from '../PreLogin/TOS/tosData';
import { reportCategories, commGuideParags } from '../../components/PreLogin/ComunityGuidelines/communityGuidelines';
import PrivacyData from '../../components/PreLogin/Privacy/PrivacyData';
import { Loading } from '../../components/Loading/Loading';

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
    const [captchaSiteKey, setCaptchaSiteKey] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    const [passcode, setPasscode] = useState('');

    const [tosCheck, setTosCheck] = useState(false);

    const { privacyPolicyData } = PrivacyData();
    const [privacyPolicyCheck, setPrivacyPolicyCheck] = useState(false);

    const [showTOSModal, setShowTOSModal] = useState(false);
    const [showCommGuideModal, setShowCommGuideModal] = useState(false);
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
            <Form className='my-5 my-sm-0'>
                <Stack gap={3}>

                    <AccountType setAccountType={setAccountType} accountType={accountType} />

                    {/* Username and Password */}
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
            <Modal show={showTOSModal} onHide={handleCloseTOSModal} className='createAccount__agreement-modal'>
                <Modal.Header className='border-bottom-0 pb-0'>
                    <Modal.Title>
                        <h4 className='mb-0 px-0 px-sm-2'>Terms of Service</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='createAccount__agreement-modal-body px-0 px-md-2'>
                    <ListGroup className='createAccount__agreement-list-group'>
                        {
                            tosData.map((term, idx) => {
                                return (
                                    <ListGroup.Item key={idx} className='createAccount__agreement-list-item'>
                                        <h5>{idx + 1}. {term.title}</h5>
                                        <p>{term.description}</p>
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer className='border-top-0 pt-0'>
                    <Button onClick={handleCloseTOSModal} className='mx-0 createAccount__btn'>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Community Guidelines */}
            <Modal show={showCommGuideModal} onHide={handleCloseCommGuideModal} className='createAccount__agreement-modal'>
                <Modal.Header className='border-bottom-0 pb-0 px-0 px-md-2'>
                    <Modal.Title>
                        <h4 className='mb-0 mx-3'>Community Guidelines</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='createAccount__agreement-modal-body px-0 px-md-2'>
                    <p className='mb-1 mx-3'>
                        {commGuideParags.intro}
                    </p>
                    <p className='mb-1 mx-3'>
                        {commGuideParags.pargraph}
                    </p>
                    <ListGroup className='createAccount__agreement-list-group'>
                        {
                            reportCategories.map((category, idx) => {
                                return (
                                    <ListGroup.Item key={idx} className='createAccount__agreement-list-item'>
                                        {idx + 1}. {category.name}
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
                    <p className='mb-1 mx-3'>
                        {commGuideParags.outro}
                    </p>
                </Modal.Body>
                <Modal.Footer className='border-top-0 pt-0'>
                    <Button onClick={handleCloseCommGuideModal} className='mx-0 createAccount__btn'>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Privacy Policy Modal */}
            <Modal show={showPrivacyModal} onHide={handleClosePrivacyModal} className='createAccount__agreement-modal'>
                <Modal.Header className='border-bottom-0 pb-0'>
                    <Modal.Title>
                        <h4 className='mb-0 px-0 px-sm-3'>Privacy Policy</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='createAccount__agreement-modal-body'>
                    <ListGroup as={'ul'} className='createAccount__agreement-list-group'>
                        {
                            privacyPolicyData.map((privacyPolicy, idx) => {
                                return (
                                    <ListGroup.Item as={'li'} key={idx} className='createAccount__agreement-list-item my-1 px-0 px-sm-3'>
                                        <h5 className='mb-1'>{privacyPolicy.title}</h5>
                                        {privacyPolicy.description}
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
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