import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';
import { createAuthUser, createUserSession } from '../../lib/context/dbhandler';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import { useUserContext } from '../../lib/context/UserContext';

const SignUp = () => {

    const {
        setUserId,
        setUserEmail,
        setGivenName,
        setUser,
    } = useUserContext();

    const navigate = useNavigate();

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
        <Container>
            <Form onSubmit={onEmailPasswordSubmit}>

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

                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="Name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit"
                    disabled={
                        (password?.length < 8) ||
                        (name === '') ||
                        (email === '')}>
                    {
                        !isAccountGettingCreated ? 'Continue' : <LoadingSpinner />
                    }

                </Button>
                {
                    <Form.Text>
                        {errorMsg}
                        {
                            doesEmailExist && <Button style={{ backgroundColor: 'transparent' }}>Login</Button>
                        }
                    </Form.Text>
                }
            </Form>
        </Container>
    )
}

export default SignUp;