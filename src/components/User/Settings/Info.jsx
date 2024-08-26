import React from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import { Form, Button } from 'react-bootstrap';


export const Info = () => {

    const { googleUserData, username, setUsername } = useUserContext();

    return (
        <Form>
            <Form.Group className='mb-3' controlId='user__username--field'>
                {/* <Form.Label>Please enter your username:</Form.Label> */}
                <Form.Control
                    type='username'
                    placeholder='Enter your username'
                    value={username || ''}
                />
                <Form.Text className='text-muted'>
                    Your userame must be unique.
                </Form.Text>
            </Form.Group>
            <Button>
                Update
            </Button>
        </Form>
    )
}
