import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export const CreateUsername = ({ accountType, username, onUsernameChange }) => {
    return (
        <Form.Group className='mb-3' controlId='user__username--field'>
            <Form.Label>
                {
                    accountType === 'personal' ?
                        'Please enter your username' :
                        'Please enter your organization\'s name'
                }
            </Form.Label>
            <Form.Control
                type='username'
                placeholder={
                    accountType === 'personal' ?
                        'username' :
                        'organization\'s name'
                }
                value={username || ''}
                onChange={onUsernameChange}
            />
            <Form.Text className='text-muted'>
                {
                    accountType === 'personal' ?
                        'Your userame must be unique.' :
                        'Your organization\'s name must be unique.'
                }

            </Form.Text>
        </Form.Group>
    )
}
