import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useUserInfo } from '../../../lib/hooks/useUserInfo';
import { forbiddenUsrnms, usrnmMaxLngth } from '../../../lib/utils/usernameUtils';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';

export const Info = () => {

    const {
        username,
        userEmail,
        accountType,
        setUsername,
        setRegisteredUsername } = useUserContext();

    const { handleUpdateUser } = useUserInfo(userEmail);

    const [localUsername, setLocalUsername] = useState(username);
    const [isUpdating, setIsUpdating] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        console.log('accountType in INFO:', accountType);
    }, [accountType])

    useEffect(() => {
        console.log('username in INFO:', username);
        setLocalUsername(username);
        console.log('localUsername in INFO:', localUsername);
    }, [username])

    const handleUsernameChange = (e) => {
        const usrnm = e.target.value.replace(/\s/g, '');
        setLocalUsername(usrnm);
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {

        console.log('dfdfdfd');

        setIsUpdating(true);

        e.preventDefault();

        try {
            if (forbiddenUsrnms.includes(localUsername)) {
                setErrorMsg(`The username ${localUsername} is not allowed. Please choose a different username.`);
                return;
            }

            if (localUsername.length > usrnmMaxLngth) {
                setErrorMsg(`The username cannot be longer than 16 characters. Please choose a shorter username.`);
                return;
            }

            if (localUsername.trim()) {
                setErrorMsg('');
                await handleUpdateUser(localUsername);
                setUsername(localUsername);
                setRegisteredUsername(localUsername)
            }

        } catch (error) {
            console.error('Username cannot be empty.');
        } finally {
            setIsUpdating(false);
        }

    };

    let usrnm = (accountType === 'personal' && 'Username') || (accountType === 'business' && 'Business Name') || (accountType === 'organization' && 'Organization\'s Name')

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4 className=''>Update {usrnm}:</h4>
                <p className='mb-0'>Update your {usrnm && usrnm.toLowerCase()}. The maximum number of characters for your {usrnm && usrnm.toLowerCase()} is 16.</p>
            </Col>
            <Col className='mt-3 mt-sm-0 d-flex justify-content-end align-items-center settings__username-col'>
                <Form
                    as={Row}
                    className='w-100 m-0 flex-column settings__username-form'
                >
                    <Form.Group
                        as={Col}
                        className='pe-sm-0 settings__username-form-group'
                        controlId='usernameField'>
                        <Form.Label className='mb-1 mb-md-2'>
                            {usrnm}:
                        </Form.Label>
                        <Form.Control
                            type='username'
                            placeholder='Enter your username'
                            value={(localUsername && localUsername) || ''}
                            onChange={handleUsernameChange}
                            className='settings__username-field'
                        />
                        <Form.Text className='settings__username-unique'>
                            Your {usrnm && usrnm.toLowerCase()} must be unique.
                        </Form.Text>
                        {errorMsg && <Alert variant="danger" className='alert'>{errorMsg}</Alert>}
                    </Form.Group>
                    <Col className='settings__update-username-btn-col'>
                        <Button
                            type='submit'
                            disabled={isUpdating || localUsername === '' ? true : false}
                            className='settings__update-username-btn mt-1 mt-md-2'
                            onClick={handleSubmit}>
                            {isUpdating ? 'Updating...' : 'Update'}
                            {isUpdating && <LoadingSpinner />}
                        </Button>
                    </Col>
                </Form>
            </Col>
        </Row>
    )
}
