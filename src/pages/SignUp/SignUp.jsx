import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Row, Col, Image } from 'react-bootstrap';
import { createAuthUser, createUserSession } from '../../lib/context/dbhandler';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import { useUserContext } from '../../lib/context/UserContext';
import { screenUtils } from '../../lib/utils/screenUtils';
import sn_logo from '../../assets/sn_long.png';

const SignUp = () => {

    const {
        setUserId,
        setUserEmail,
        setGivenName,
        setUser,
    } = useUserContext();

    const navigate = useNavigate();

    const { isSmallScreen, isExtraSmallScreen, isMediumScreen, isLargeScreen } = screenUtils();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isAccountGettingCreated, setIsAccountGettingCreated] = useState(false);
    const [doesEmailExist, setDoesEmailExist] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const onEmailPasswordSubmit = async (event) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Name:', name);

        let signupSuccess = false;

        try {
            setIsAccountGettingCreated(true);
            const user = await createAuthUser(email, password, name);

            if (typeof user === 'string') {
                setErrorMsg(user);
                setDoesEmailExist(true);
                return;
            } else {
                console.log('THIS IS USER IN SIGN UP:', user);

                await createUserSession(email, password);

                setUserEmail(user.email);
                setUserId(user.$id);
                setGivenName(user.name);
                setUser(user);

                signupSuccess = true;
            }

        } catch (error) {
            console.error('Error creating the auth user account:', error);
            setErrorMsg('Something went wrong. Please try again.');
        } finally {
            setIsAccountGettingCreated(false);
            if (signupSuccess) {
                navigate('/set-username');
            }
        }
    }

    return (
        <Container className='min-vh-100 d-flex flex-column justify-content-center align-items-center'>
            <Row className={`${!isSmallScreen ? 'w-50' : 'w-100'}`}>
                <Col>
                    <Image src={sn_logo} className='mb-5' fluid />
                </Col>
            </Row>

            <Row className={`${!isSmallScreen ? 'w-50' : 'w-100'}`}>
                <Col>
                    <h2 style={{ maxWidth: isSmallScreen && '350px' }}
                        className={`mb-3 ${!isMediumScreen ? 'ms-auto' : 'ms-auto me-auto'}`}
                    >
                        Sign Up
                    </h2>
                </Col>
            </Row>

            <Row className={`${!isSmallScreen ? 'w-50' : 'w-100'}`}>
                <Form onSubmit={onEmailPasswordSubmit}>

                    <Form.Group as={Col} className='mb-3 d-flex flex-column flex-lg-row align-items-center signin__form--field' controlId="formBasicName">
                        <Form.Label
                            className={`mb-1 mb-lg-0 ${isMediumScreen && 'w-100 d-flex justify-content-start'}`}
                            style={{ maxWidth: isSmallScreen && '350px' }}
                        >
                            Name:
                        </Form.Label>
                        <Form.Control
                            style={{ maxWidth: '350px' }}
                            className={`signup__form--field ${!isMediumScreen ? 'ms-auto' : 'ms-auto me-auto'}`}
                            // placeholder={`${!isMediumScreen ? '' : 'Name'}`}
                            type="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} className='mb-3 d-flex flex-column flex-lg-row align-items-center signin__form--field' controlId="formBasicEmail">
                        <Form.Label
                            className={`mb-1 mb-lg-0 ${isMediumScreen && 'w-100 d-flex justify-content-start'}`}
                            style={{ maxWidth: isSmallScreen && '350px' }}
                        >Email:</Form.Label>
                        <Form.Control
                            style={{ maxWidth: '350px' }}
                            className={`signup__form--field ${!isMediumScreen ? 'ms-auto' : 'ms-auto me-auto'}`}
                            // placeholder={`${!isMediumScreen ? '' : 'Email'}`}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} className='mb-3 d-flex flex-column flex-lg-row align-items-center signin__form--field' controlId="formBasicPassword">
                        <Form.Label
                            className={`mb-1 mb-lg-0 ${isMediumScreen && 'w-100 d-flex justify-content-start'}`}
                            style={{ maxWidth: isSmallScreen && '350px' }}
                        >Password:</Form.Label>

                        <Form.Control
                            style={{ maxWidth: '350px' }}
                            className={`signup__form--field ${!isMediumScreen ? 'ms-auto' : 'ms-auto me-auto'}`}
                            // placeholder={`${!isMediumScreen ? '' : 'Password'}`}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />


                    </Form.Group>

                    <Form.Text as='ul' className={`mt-0 ps-3 d-flex flex-column ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`} style={{ maxWidth: '350px' }}>
                        <li>You passowrd cannot contain fewer than 8 characters.</li>
                        <li>You passowrd cannot contain more than 256 characters.</li>
                    </Form.Text>

                    <Col
                        className={`${!isMediumScreen ? 'd-flex ms-auto' : 'd-flex mx-auto'}`}

                        style={{ maxWidth: '350px' }}
                    >
                        <Button type='submit'
                            disabled={
                                (password?.length < 8) ||
                                (name === '') ||
                                (email === '')}
                            className={`signup-form__btn me-0 ms-auto ${isExtraSmallScreen && 'w-100'}`}
                        >
                            {
                                !isAccountGettingCreated ? 'Continue' : <LoadingSpinner />
                            }

                        </Button>
                        {
                            <Form.Text>
                                {errorMsg}
                                {
                                    doesEmailExist && <Button style={{ backgroundColor: 'transparent' }}>Sign in</Button>
                                }
                            </Form.Text>
                        }
                    </Col>
                </Form>
            </Row>
        </Container>
    )
}

export default SignUp;