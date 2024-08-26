import React, { useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../lib/context/UserContext';
import ReCAPTCHA from 'react-google-recaptcha';

const CreateUsername = ({ setUser }) => {

    const navigate = useNavigate();

    const { username, setUsername, setHasUsername, setGoogleUserData, setIsLoggedIn } = useUserContext();

    const [captchaVerified, setCaptchaVerified] = useState(false);

    const onUsernameChange = (e) => {
        console.log('Input changed:', e.target.value);
        setUsername(e.target.value);
    };


    const handleDoneClick = async () => {

        if (!captchaVerified) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }

        await setUser();
        if (username) {
            setHasUsername(true);

            console.log('BEFORE NAVIGATION - Username after setUser:', username);

            setTimeout(() => {
                navigate('/user/profile');

                console.log('AFTER NAVIGATION - Username after setUser:', username);
            }, 100);

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