import React, { useEffect, useState } from 'react';
import { useUserInfo } from '../../../lib/hooks/useUserInfo';
import { Col, Form, Row, Button } from 'react-bootstrap';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from './UpdateMessage';

export const UserPassword = () => {

    const { updateAuthPassword } = useUserInfo();

    const [oldPasswordVal, setOldPasswordVal] = useState();
    const [newPasswordVal, setNewPasswordVal] = useState();
    const [confirmPasswordVal, setConfirmPasswordVal] = useState();
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleOldPasswordChange = (e) => {
        const input = e.target.value;

        if (input.length <= 256) {
            setOldPasswordVal(input);
        }
    };

    const handleNewPasswordChange = (e) => {
        const input = e.target.value;

        if (input.length <= 256) {
            setNewPasswordVal(input);
        }
    }

    const handleConfirmPasswordChange = (e) => {
        const input = e.target.value;

        if (input.length <= 256) {
            setConfirmPasswordVal(input);
        }
    };

    const handleUpdatePassword = async (e) => {

        e.preventDefault();

        if (newPasswordVal !== confirmPasswordVal) {
            setErrorMsg('New passwords do not match.');
            return;
        }

        setIsUpdating(true);
        try {
            const res = await updateAuthPassword(newPasswordVal, oldPasswordVal);

            if (typeof res === 'string') {
                setErrorMsg(res);
                return;
            }

            setErrorMsg('');
            setSuccessMsg('Password updated successfully.')
            setOldPasswordVal('');
            setNewPasswordVal('');
            setConfirmPasswordVal('');
        } catch (error) {
            console.error('Error updating password:', error);
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
                            <ul className='mb-1 mb-md-2 ps-3'>
                                <li>Your password must contain at least 8 characters.</li>
                                <li>Your password must not exceed 256 characters.</li>
                            </ul>
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId='confirmPasswordField'>
                        <Form.Control
                            type='password'
                            placeholder='Re-enter your new password'
                            value={confirmPasswordVal || ''}
                            onChange={handleConfirmPasswordChange}
                            className='settings__username-field mb-1 mb-md-2'
                        />
                    </Form.Group>
                    <Button
                        type='submit'
                        disabled={isUpdating ||
                            newPasswordVal?.length < 8 ||
                            newPasswordVal === undefined ||
                            oldPasswordVal?.length < 8 ||
                            oldPasswordVal === undefined ||
                            confirmPasswordVal?.length < 8 ||
                            confirmPasswordVal === undefined
                        }
                        className='settings__update-username-btn mt-1 mt-md-2'
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                        {isUpdating && <LoadingSpinner />}
                    </Button>

                    <SuccessMessage message={successMsg} />
                    <ErrorMessage message={errorMsg} />

                </Form>
            </Col>
        </Row>
    )
}