import React from 'react';
import { Form } from 'react-bootstrap';

export const SetPasscode = ({ accountType, passcode, onPasscodeChange }) => {
    return (
        <>
            {/* {accountType === 'organization' && */}
            <Form.Group className='my-3 my-sm-0' controlId='passocde_field'>
                <Form.Label className='mb-0'>
                    Please enter your organization's passcode.
                </Form.Label>
                <Form.Control
                    type='password'
                    value={passcode || ''}
                    onChange={onPasscodeChange}
                    disabled={accountType !== 'organization'}
                    className='my-1 my-sm-2 setPasscode__passcode-field'
                />
                <Form.Text className='text-muted'>
                    <ul className='mb-0 ps-3'>
                        <li>Your passcode must contain at least six digits.</li>
                        <li>Your passcode cannot be longer than 25 digits.</li>
                    </ul>
                </Form.Text>
            </Form.Group>
            {/* } */}
        </>
    )
}
