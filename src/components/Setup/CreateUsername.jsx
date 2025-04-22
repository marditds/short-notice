import React from 'react';
import { Form } from 'react-bootstrap';

export const CreateUsername = ({ accountType, username, onUsernameChange }) => {
    return (
        <Form.Group controlId='user__username--field'>
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
                    accountType === 'organization' && 'Enter the name of your organization/group.'
                }
            </Form.Label>
            <div className={(accountType === 'personal' || accountType === 'business') && 'd-flex'}>
                <Form.Control
                    type='username'
                    placeholder={
                        accountType === ''
                            ? ''
                            : (
                                (accountType === 'personal' && 'username') ||
                                (accountType === 'business' && 'business name') ||
                                (accountType === 'organization' && 'organization/group name')
                            )
                    }
                    value={username || ''}
                    onChange={onUsernameChange}
                    disabled={accountType === ''}
                    className='createUsername__username-field'
                />
                <Form.Text className='text-muted'>
                    <ul className='mb-0 ps-3'>
                        {
                            accountType === ''
                                ? <li>
                                    Your account name must be unique
                                </li>
                                : (
                                    (accountType === 'personal' && <li>
                                        Your username must be unique.
                                    </li>) ||
                                    (accountType === 'business' && <li>
                                        Your business name must be unique.</li>) ||
                                    (accountType === 'organization' && <li>Your organization's name must be unique.</li>)
                                )
                        }
                    </ul>
                </Form.Text>
            </div>
        </Form.Group>
    )
}
