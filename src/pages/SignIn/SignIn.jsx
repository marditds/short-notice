import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { createUserSession, getAccount } from '../../lib/context/dbhandler';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import { useUserContext } from '../../lib/context/UserContext';
import { screenUtils } from '../../lib/utils/screenUtils';

const SignIn = () => {

    const {
        setUserId,
        setUserEmail,
        setGivenName,
        setUser,
        setIsLoggedIn
    } = useUserContext();

    const navigate = useNavigate();

    const { isSmallScreen, isExtraSmallScreen, isMediumScreen, isLargeScreen } = screenUtils();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAccountGettingCreated, setIsAccountGettingCreated] = useState(false);
    const [isLoggingInLoading, setIsLoggingInLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const onUserLogin = async (event) => {

        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);

        let loginSuccess = false;

        try {
            setIsLoggingInLoading(true);

            const userSession = await createUserSession(email, password);

            if (typeof userSession === 'string') {
                setErrorMsg(userSession);
                return;
            } else {
                console.log('THIS IS USER Sesssion:', userSession);

                const user = await getAccount();

                console.log('THIS IS USER in SIGNIN:', user);

                setUserEmail(user.email);
                setUserId(user.$id);
                setGivenName(user.name);
                setUser(user);
                setIsLoggedIn(true);

                loginSuccess = true;
            }

            console.log('Logged in clicked.');
        } catch (error) {
            console.log('Error logging in user:', error);
            setErrorMsg('Something went wrong. Please try again.');
        } finally {
            setIsLoggingInLoading(false);
            if (loginSuccess) {
                navigate('/user/feed');
            }
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form onSubmit={onUserLogin}>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>


                        <Button variant="primary" type="submit"
                            disabled={
                                (password?.length < 8) ||
                                (email === '')}>
                            {
                                !isLoggingInLoading ? 'Sign in' : <LoadingSpinner />
                            }

                        </Button>
                        {errorMsg &&
                            <Form.Text>
                                {errorMsg}
                            </Form.Text>
                        }
                    </Form>
                </Col>
            </Row>
            <Row className='mt-3 w-100'>
                <Col className={`${!isMediumScreen ? 'd-flex ms-auto' : 'd-flex mx-auto'}`} style={{ maxWidth: '350px' }}>
                    <p className={`mb-0 me-0 ms-auto`}>
                        Don't have an account? <Link to='/signup' className='signup-form__signin-btn'>Sign Up</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default SignIn;