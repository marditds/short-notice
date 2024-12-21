import React, { useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import { Row, Col, Form, Button } from 'react-bootstrap';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { Loading } from '../../Loading/Loading';

export const Info = ({ accountType }) => {

    const { googleUserData,
        username,
        setUsername,
        setRegisteredUsername } = useUserContext();

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
                setRegisteredUsername(localUsername)
            }
        } catch (error) {
            console.error('Username cannot be empty.');
        } finally {
            setIsUpdating(false);
        }

    };

    // let usrnm = accountType === 'personal' ? 'username' : 'organization\'s name';

    let usrnm = (accountType === 'personal' && 'Username') || (accountType === 'business' && 'Business Name') || (accountType === 'organization' && 'Organization\'s Name')

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4 className=''>Update {usrnm}:</h4>
                <p className='mb-0'>Update your {usrnm.toLocaleLowerCase()}. The maximum number of characters for your {usrnm.toLowerCase()} is 16.</p>
            </Col>
            <Col className='mt-3 mt-sm-0 d-flex justify-content-end align-items-center settings__username-col'>
                <Form
                    as={Row}
                    onSubmit={handleSubmit}
                    className='w-100 m-0 flex-column settings__username-form'
                >
                    <Form.Group
                        as={Col}
                        className='pe-sm-0 settings__username-form-group'
                        controlId='usernameField'>
                        <Form.Label>
                            {usrnm}:
                        </Form.Label>
                        <Form.Control
                            type='username'
                            placeholder='Enter your username'
                            value={localUsername || ''}
                            onChange={handleUsernameChange}
                            className='settings__username-field'
                        />
                        <Form.Text className='settings__username-unique'>
                            Your {usrnm} must be unique.
                        </Form.Text>
                    </Form.Group>
                    <Col className='settings__update-username-btn-col'>
                        <Button
                            type='submit'
                            disabled={isUpdating || localUsername === '' ? true : false}
                            className='settings__update-username-btn'
                        >
                            {isUpdating ? 'Updating...' : 'Update'}
                            {isUpdating && <Loading />}
                        </Button>
                    </Col>
                </Form>
            </Col>
        </Row>
    )
}
