import React from 'react';
import { Form } from 'react-bootstrap';

export const CreateUsername = ({ accountType, username, onUsernameChange }) => {
    return (
        <Form.Group className='mb-3' controlId='user__username--field'>
            <Form.Label>
                {
                    accountType === '' && 'Please select an account type'
                }
                {
                    accountType === 'personal' && 'Enter your username'
                }
                {
                    accountType === 'business' && 'Enter the name of your business.'
                }
                {
                    accountType === 'organization' && 'Enter the name of your organization/team.'
                }
            </Form.Label>
            <Form.Control
                type='username'
                placeholder={
                    accountType === ''
                        ? ''
                        : (
                            (accountType === 'personal' && 'username') ||
                            (accountType === 'business' && 'business name') ||
                            (accountType === 'organization' && 'organization/team name')
                        )
                }
                value={username || ''}
                onChange={onUsernameChange}
                disabled={accountType === ''}
                className='createUsername__username-field'
            />
            <Form.Text className='text-muted'>
                {
                    accountType === ''
                        ? 'Your account name must be unique'
                        : (
                            (accountType === 'personal' && 'Your username must be unique.') ||
                            (accountType === 'business' && 'Your business name must be unique.') ||
                            (accountType === 'organization' && 'Your organization\'s name must be unique.')
                        )
                }
            </Form.Text>
        </Form.Group>
    )
}
