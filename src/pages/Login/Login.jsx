import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';
import { createUserSession, getAccount } from '../../lib/context/dbhandler';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import { useUserContext } from '../../lib/context/UserContext';

const Login = () => {

    const {
        setUserId,
        setUserEmail,
        setGivenName,
        setUser,
        setIsLoggedIn
    } = useUserContext();

    const navigate = useNavigate();

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

                console.log('THIS IS USER in LOGIN:', user);

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
                        !isLoggingInLoading ? 'Login' : <LoadingSpinner />
                    }

                </Button>
                {
                    <Form.Text>
                        {errorMsg}
                    </Form.Text>
                }
            </Form>
        </Container>
    )
}

export default Login