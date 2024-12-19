import React, { useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { Container, Stack, Form, Button, Alert, } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../lib/context/UserContext';
import { getUserByUsername } from '../../lib/context/dbhandler';
import { AccountType } from '../../components/Setup/AccountType';
import { AccountTypeDesc } from '../../components/Setup/AccountTypeDesc';
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

    const [errorMessage, setErrorMessage] = useState('');

    const [passcode, setPasscode] = useState('');

    const onUsernameChange = (e) => {
        console.log('Input changed:', e.target.value);

        const usrnm = e.target.value.replace(/\s/g, '');
        setUsername(usrnm);
        setErrorMessage('');
    };

    const onPasscodeChange = (e) => {
        const input = e.target.value;

        if (/^\d{0,6}$/.test(input)) {
            setPasscode(input);
        }

        if (input.length === 6) {
            setErrorMessage('');
        }
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
        if (value) {
            setIsCaptchaVerified(true);
        }
    };

    return (
        <Container className='
        createUsername__container 
        '>
            <Form>
                <Stack gap={3}>

                    <AccountType setAccountType={setAccountType} />

                    <AccountTypeDesc accountType={accountType} />

                    <CreateUsername accountType={accountType} username={username} onUsernameChange={onUsernameChange} />

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <SetPasscode accountType={accountType} passcode={passcode} onPasscodeChange={onPasscodeChange} />

                    <div className='mb-3'>
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
                            onChange={onCaptchaChange}
                        />
                    </div>

                    <div>
                        <Button
                            onClick={handleDoneClick}
                            disabled={!isCaptchaVerified || !username || username.trim() === '' || (accountType === 'organization' && passcode.length !== 6)}
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

                            }}>
                            Cancel
                        </Button>
                    </div>
                </Stack>

            </Form>
        </Container>
    )
};

export default CreateAccount;