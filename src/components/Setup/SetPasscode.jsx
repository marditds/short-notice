import React from 'react';
import { Form } from 'react-bootstrap';


export const SetPasscode = ({ passcode, onPasscodeChange }) => {
    return (
        <Form.Group className='mb-3' controlId='user__passcode--field'>
            <Form.Label>
                Please enter your organization's passcode.
            </Form.Label>
            <Form.Control
                type='password'
                value={passcode || ''}
                onChange={onPasscodeChange}
            />
            <Form.Text className='text-muted'>
                Your organization's passcode must be 6 digits.
            </Form.Text>
        </Form.Group>
    )
}
