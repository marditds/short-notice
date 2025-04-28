import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateAuthPasswordRecovery } from '../../lib/context/dbhandler';
import { Col, Container, Row } from 'react-bootstrap';
import { SignFormLayout } from '../../components/LoginForm/SignFormLayout';

const ResetPassword = () => {

    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);
    const [secret, setSecret] = useState(null);
    const [email, setEmail] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
    const [resetPsswdSuccessMsg, setResetPsswdSuccessMsg] = useState(null);
    const [resetPsswdErrorMsg, setResetPsswdErrorMsg] = useState(null);

    const formFields = [
        {
            label: 'New Password:',
            type: 'password',
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
            controlId: 'resetPasswordFormPassword',
        },
        {
            label: 'Confirm Password:',
            type: 'password',
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            controlId: 'resetPasswordFormConfirmPassword',
        }
    ]

    // Get Reset Details
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUserId(params.get('userId'));
        setSecret(params.get('secret'));

        console.log('THESE ARE THE PARAMS:', params);

        if (params.size === 0) {
            navigate('/');
        }

        const functionInResetPasswrodComponent = async () => {
            try {
                console.log('Starting FunctionInResetPasswrodComponent in <ResetPassword/>.');

                console.log('FunctionInResetPasswrodComponent in process.');

            } catch (err) {
                console.error('Authentication failed. Please try again.', err);
            } finally {
                console.log('Finishing FunctionInResetPasswrodComponent in <ResetPassword/>.');
            }
        };

        if (userId && secret) {
            functionInResetPasswrodComponent();
        }

    }, [userId, secret]);

    // Change password function
    const onPasswrodChange = async (event) => {

        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setResetPsswdErrorMsg('Passwords do not match.');
            return;
        }

        try {
            setIsResetPasswordLoading(true);

            console.log('Password change clicked.');

            const res = await updateAuthPasswordRecovery(userId, secret, newPassword);

            if (typeof res === 'string') {
                setResetPsswdErrorMsg(res);
                setResetPsswdSuccessMsg(null);
                return;
            }

            console.log('res in onPasswrodChange', res);

            setResetPsswdSuccessMsg('Your password was changed successfully.')
            setResetPsswdErrorMsg('');

        } catch (error) {
            console.error('Error resetting passowrd:', error);
            setResetPsswdErrorMsg('Something went wrong. Please try again later.');
        } finally {
            setIsResetPasswordLoading(false);
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <SignFormLayout
                        type='reset'
                        titleText='Reset password'
                        onSubmit={onPasswrodChange}
                        formFields={formFields}
                        submitButtonText='Reset Password'
                        isLoading={isResetPasswordLoading}
                        errorMsg={resetPsswdErrorMsg}
                        successMsg={resetPsswdSuccessMsg}
                        isSubmitDisabled={newPassword.length < 8 || confirmPassword.length < 8}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default ResetPassword;