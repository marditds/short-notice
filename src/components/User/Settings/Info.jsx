import React, { useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import { Form, Button } from 'react-bootstrap';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { Loading } from '../../Loading/Loading';

export const Info = () => {

    const { googleUserData, username, setUsername } = useUserContext();
    const { handleUpdateUser } = useUserInfo(googleUserData);

    const [isUpdating, setIsUpdating] = useState(false);


    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = async (e) => {

        setIsUpdating(true);

        e.preventDefault();

        try {
            if (username.trim()) {
                await handleUpdateUser(username)
            }
        } catch (error) {
            console.error('Username cannot be empty.');
        } finally {
            setIsUpdating(false);
        }

    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='user__username--field'>
                <Form.Control
                    type='username'
                    placeholder='Enter your username'
                    value={username || ''}
                    onChange={handleUsernameChange}
                />
                <Form.Text className='text-muted'>
                    Your userame must be unique.
                </Form.Text>
            </Form.Group>
            <Button
                type='submit'
                disabled={isUpdating ? true : false}
            >
                {isUpdating ? 'Updating...' : 'Update'}
                {isUpdating && <Loading />}
            </Button>
        </Form>
    )
}
