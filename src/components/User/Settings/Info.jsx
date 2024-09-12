import React, { useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import { Row, Col, Form, Button } from 'react-bootstrap';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { Loading } from '../../Loading/Loading';

export const Info = () => {

    const { googleUserData, username, setUsername } = useUserContext();
    const { handleUpdateUser } = useUserInfo(googleUserData);

    const [currUsername, setCurrUsername] = useState(username);
    const [localUsername, setLocalUsername] = useState(username);
    const [isUpdating, setIsUpdating] = useState(false);


    const handleUsernameChange = (e) => {
        setLocalUsername(e.target.value);
    };

    const handleSubmit = async (e) => {

        setIsUpdating(true);

        e.preventDefault();

        try {
            if (localUsername.trim()) {
                await handleUpdateUser(localUsername);
                setCurrUsername(localUsername);
                setUsername(localUsername);
            }
        } catch (error) {
            console.error('Username cannot be empty.');
        } finally {
            setIsUpdating(false);
        }

    };

    return (
        <Row>
            <Col>
                <h4>Update Username:</h4>
                <p>Update your username. The maximum number of characters for your username is 16.</p>
            </Col>
            <Col className='d-flex'>
                <h4
                    style={{ width: '100px' }}
                    className='me-5'
                >
                    {currUsername}
                </h4>
                <Form
                    onSubmit={handleSubmit}
                >
                    <Form.Group
                        controlId='usernameField'>
                        <Form.Label>
                            Username:
                        </Form.Label>
                        <Form.Control
                            type='username'
                            placeholder='Enter your username'
                            value={localUsername || ''}
                            onChange={handleUsernameChange}
                            style={{ maxWidth: '320px' }}
                            className='settings__username-field'
                        />
                        <Form.Text className='settings__username-unique'>
                            Your userame must be unique.
                        </Form.Text>
                    </Form.Group>
                    <Button
                        type='submit'
                        disabled={isUpdating || localUsername === '' ? true : false}
                        className='settings__update-username-btn'
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                        {isUpdating && <Loading />}
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}
