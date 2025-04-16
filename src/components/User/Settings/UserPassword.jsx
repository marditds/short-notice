import React, { useEffect, useState } from 'react';
import { useUserInfo } from '../../../lib/hooks/useUserInfo';
import { Col, Form, Row, Button } from 'react-bootstrap';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';

export const UserPassword = () => {

    const { updateAuthPassword } = useUserInfo();

    const [oldPasswordVal, setOldPasswordVal] = useState();
    const [newPasswordVal, setNewPasswordVal] = useState();
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleOldPasswordChange = (e) => {
        console.log(e.target.value);
        const input = e.target.value;

        console.log('input', input);

        if (input.length <= 256) {
            setOldPasswordVal(input);

            if (input.length > 0 && input.length < 8) {
                return;
            }
        }
    };

    const handleNewPasswordChange = (e) => {
        console.log(e.target.value);
        const input = e.target.value;

        console.log('input', input);

        if (input.length <= 256) {
            setNewPasswordVal(input);

            if (input.length > 0 && input.length < 8) {
                return;
            }
        }
    }

    const handleUpdatePassword = async (e) => {
        setIsUpdating(true);
        e.preventDefault();
        try {
            const res = await updateAuthPassword(newPasswordVal, oldPasswordVal);

            if (typeof res === 'string') {
                setErrorMsg(res);
                return;
            }

            setErrorMsg('');
            setSuccessMsg('Passowrd updated successfully.')
        } catch (error) {
            console.error('Error updating passcode:', error);
            setErrorMsg('Something went wrong. Please try again later.');
        } finally {
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        console.log('newPasswordVal', newPasswordVal);
    }, [newPasswordVal])

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4>Update Password:</h4>
                <p>Update your password. The minimum number of characters for your password is 8. The maximum number of characters for your password is 256.</p>
            </Col>
            <Col className='d-flex'>
                <Form
                    onSubmit={handleUpdatePassword}
                    className='w-100'
                >
                    <Form.Group controlId='oldPasswordField'>
                        <Form.Label>
                            Password:
                        </Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter your current password'
                            value={oldPasswordVal || ''}
                            onChange={handleOldPasswordChange}

                            className='settings__username-field mb-1 mb-md-2'
                        />
                    </Form.Group>
                    <Form.Group controlId='newPasswordField'>
                        <Form.Control
                            type='password'
                            placeholder='Enter your new password'
                            value={newPasswordVal || ''}
                            onChange={handleNewPasswordChange}

                            className='settings__username-field mb-1 mb-md-2'
                        />
                        <Form.Text className='settings__username-unique'>
                            <ul className='mb-0 ps-3'>
                                <li>Your passcode must contain at least 8 characters.</li>
                                <li>Your passcode cannot be longer than 256 characters.</li>
                            </ul>
                        </Form.Text>
                    </Form.Group>
                    <Button
                        type='submit'
                        disabled={isUpdating || newPasswordVal?.length < 8 || newPasswordVal === undefined || oldPasswordVal?.length < 8 || oldPasswordVal === undefined}
                        className='settings__update-username-btn mt-1 mt-md-2'
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                        {isUpdating && <LoadingSpinner />}
                    </Button>

                    {errorMsg &&
                        <div className='mt-1 mt-md-2'>
                            <Form.Text style={{ color: 'var(--main-caution-color)' }}>
                                {errorMsg}
                            </Form.Text>
                        </div>
                    }
                    {successMsg &&
                        <div className='mt-1 mt-md-2'>
                            <Form.Text style={{ color: 'var(--main-accent-color-hover)' }}>
                                {successMsg}
                            </Form.Text>
                        </div>
                    }
                </Form>
            </Col>
        </Row>
    )
}