import React, { useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../lib/context/UserContext';
import { getUserByUsername } from '../../lib/context/dbhandler';

import ReCAPTCHA from 'react-google-recaptcha';

const CreateUsername = ({ setUser }) => {

    const navigate = useNavigate();


    const { username, setUsername, setHasUsername, setGoogleUserData, setIsLoggedIn } = useUserContext();

    const [captchaVerified, setCaptchaVerified] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const onUsernameChange = (e) => {
        console.log('Input changed:', e.target.value);
        setUsername(e.target.value);
        setErrorMessage('');
    };


    const handleDoneClick = async () => {

        if (!captchaVerified) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }

        if (!username || username.trim() === '') {
            setErrorMessage('Username cannot be empty. Please enter a valid username.');
            return;
        }

        try {
            const existingUser = await getUserByUsername(username);
            if (existingUser) {
                setErrorMessage('Username already taken. Please choose another one.');
                return;
            }

            await setUser();

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
            setCaptchaVerified(true);
        }
    };

    return (
        <Container>
            <Form>
                {!captchaVerified && (
                    <div className='mb-3'>
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
                            onChange={onCaptchaChange}
                        />
                    </div>
                )}

                {captchaVerified && (
                    <>
                        <Form.Group className='mb-3' controlId='user__username--field'>
                            <Form.Label>Please enter your username:</Form.Label>
                            <Form.Control type='username' placeholder='Enter your username' value={username || ''} onChange={onUsernameChange} />
                            <Form.Text className='text-muted'>
                                Your userame must be unique.
                            </Form.Text>
                        </Form.Group>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <Button onClick={handleDoneClick}>
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

                            }}>Log out</Button>
                    </>

                )}
            </Form>
        </Container>
    )
};

export default CreateUsername;