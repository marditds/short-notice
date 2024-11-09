import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export const CreateUsername = ({ accountType, username, onUsernameChange }) => {
    return (
        <Form.Group className='mb-3' controlId='user__username--field'>
            <Form.Label>
                {
                    accountType === ''
                        ? 'Please select an account type'
                        : (accountType === 'personal'
                            ? 'Please enter your username'
                            : 'Please enter your organization\'s name')
                }
            </Form.Label>
            <Form.Control
                type='username'
                placeholder={
                    accountType === ''
                        ? ''
                        : (accountType === 'personal'
                            ? 'username'
                            : 'organization\'s name')
                }
                value={username || ''}
                onChange={onUsernameChange}
                disabled={accountType === ''}
            />
            <Form.Text className='text-muted'>
                {
                    accountType === ''
                        ? 'Your account name must be unique'
                        : (accountType === 'personal'
                            ? 'Your userame must be unique.'
                            : 'Your organization\'s name must be unique.')

                }
            </Form.Text>
        </Form.Group>
    )
}
