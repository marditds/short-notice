import React, { useState, useEffect } from 'react';
import { Container, Stack, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useNavigation } from 'react-router-dom';
import { useUserContext } from '../../lib/context/UserContext';
import { getUserByUsername, getAccount, updateAuthUser } from '../../lib/context/dbhandler';
import { AccountType } from '../../components/Setup/AccountType';
import './CreateAccount.css';
import { keysProvider } from '../../lib/context/keysProvider';
import ReCAPTCHA from 'react-google-recaptcha';
import { CreateUsername } from '../../components/Setup/CreateUsername';
import { SetPasscode } from '../../components/Setup/SetPasscode';
import { useUserInfo } from '../../lib/hooks/useUserInfo';
import { forbiddenUsrnms, usrnmMaxLngth } from '../../lib/utils/usernameUtils';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import TOSList from '../../components/Legal/TOSList';
import CommunityGuidelinesList from '../../components/Support/CommunityGuidelinesList';
import PrivacyList from '../../components/Legal/PrivacyList';
import { useLogin } from '../../lib/hooks/useLogin';
import { SignFormLayout } from '../../components/LoginForm/SignFormLayout';
import { screenUtils } from '../../lib/utils/screenUtils';


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

    const {
        isSetUserLoading,
        isSetupCancellationLoading,
        createUserInCollection,
        cancelAccountSetup
    } = useLogin();

    const { isSmallScreen, isExtraSmallScreen, isMediumScreen } = screenUtils();

    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const [captchaKey, setCaptchaKey] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    const [passcode, setPasscode] = useState('');

    const [isHandleDoneClickLoading, setIsHandleDoneClickLoading] = useState(false);


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

            setUsername(username);
            setUserEmail(authenticatedUser.email);
            setUserId(authenticatedUser.$id);
            setGivenName(authenticatedUser.name);

            // Adding the user to the users collection
            await createUserInCollection();

            // Updating the name in Auth section to match username
            await updateAuthUser(username);

            const usr = await getUserByUsername(username);

            console.log('usr id in <CreateAccount />', usr.$id);
            console.log('passcode in <CreateAccount />', passcode);
            console.log('accountType in <CreateAccount />', accountType);

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

    useEffect(() => {
        // console.log('captchaKey:', captchaKey);
        if (isCaptchaVerified === false) {
            setCaptchaKey(null);
        }
    }, [captchaKey, isCaptchaVerified])


    // Getting things ready
    // if (isSetupCancellationLoading || userEmail === null) {
    //     return <div className='min-vh-100'>
    //         <Container className='min-vh-100 flex-grow-1'>
    //             <Row className='min-vh-100 flex-grow-1  justify-content-center align-items-center'>
    //                 <Col className='d-flex justify-content-center align-items-center'>
    //                     <LoadingSpinner classAnun='me-2' />
    //                     {
    //                         (userEmail === null) && 'Getting things ready. Hang tight.'
    //                     }
    //                     {
    //                         isSetupCancellationLoading && 'Cancelling your account creation. Please wait...'
    //                     }
    //                 </Col>
    //             </Row>
    //         </Container>
    //     </div>
    // }

    return (
        <Container
            className='createUsername__container d-flex justify-content-center align-items-center min-vh-100'
        >
            <div className="d-flex flex-column justify-content-evenly align-items-center p-4 signup-form--bg"
                style={{ width: '696px' }}
            >
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleDoneClickCreateAccount();
                    }}
                    className={`my-5 my-sm-0 ${isSmallScreen ? 'w-100' : ''}`}>
                    <Stack gap={3} className=''>

                        <AccountType setAccountType={setAccountType} accountType={accountType} />

                        {/* Username and Password */}
                        {
                            accountType !== '' &&
                            <Row xs={1} sm={2} className='align-items-start bbbbbb'>
                                <Col className=''>
                                    <CreateUsername accountType={accountType} username={username} onUsernameChange={onUsernameChange} />

                                    {errorMessage && <Alert variant="danger" className='alert'>{errorMessage}</Alert>}
                                </Col>
                                {
                                    accountType === 'organization' &&
                                    <Col>
                                        <SetPasscode accountType={accountType} passcode={passcode} onPasscodeChange={onPasscodeChange} />
                                    </Col>
                                }
                            </Row>
                        }


                        {/* Create Account Buttons  */}
                        <div className='mb-5 mb-sm-0 d-flex justify-content-between justify-content-sm-end'>

                            <Button
                                type='button'
                                onClick={async () => {
                                    await cancelAccountSetup(userId);
                                }}
                                className='createAccount__btn'>
                                Cancel
                            </Button>

                            <Button
                                type='submit'
                                disabled={!isCaptchaVerified || !username || username.trim() === '' || username.includes(' ') || username === 'profile' || (accountType === 'organization' && passcode.length < 6) || !accountType || isHandleDoneClickLoading}
                                className='createAccount__btn  ms-sm-2'
                            >
                                {
                                    (isSetUserLoading || isHandleDoneClickLoading) ?
                                        <LoadingSpinner /> :
                                        'Done'
                                }
                            </Button>
                        </div>
                    </Stack>
                </Form>
            </div>
        </Container>

    )
};

export default CreateAccount;