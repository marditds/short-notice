import { Form } from 'react-bootstrap';

export const SetPasscode = ({ accountType, passcode, onPasscodeChange }) => {
    return (
        <Form.Group className='my-3 my-sm-0' controlId='passcode_field'>
            <Form.Label className='mb-0'>
                Please enter your organization's passcode.
            </Form.Label>

            <Form.Control
                type='password'
                value={passcode || ''}
                onChange={onPasscodeChange}
                disabled={accountType !== 'organization'}
                placeholder='passcode'
                className='my-1 my-sm-2 setPasscode__passcode-field'
                aria-describedby='passcode-guidance'
            />

            <Form.Text id='passcode-guidance' className='text-muted'>
                <ul className='mb-0 ps-3'>
                    <li>Your passcode must contain at least 6 characters.</li>
                    <li>Your passcode must not exceed 25 characters.</li>
                </ul>
            </Form.Text>
        </Form.Group>

    )
}
