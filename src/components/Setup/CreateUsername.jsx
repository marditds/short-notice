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
                    accountType === 'personal' && 'Please enter your username'
                }
                {
                    accountType === 'business' && 'Please enter the name of your business.'
                }
                {
                    accountType === 'organization' && 'Please enter the name of your organization/team.'
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
