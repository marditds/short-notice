import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row, Form } from 'react-bootstrap';
import { SignFormLayout } from '../../components/LoginForm/SignFormLayout';
import sn_logo from '../../assets/sn_long.png';

const ResetPassword = () => {

    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
    const [resetPsswdErrorMsg, setResetPsswdErrorMsg] = useState(null);


    const formFields = [
        {
            label: 'New Password:',
            type: 'password',
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
            controlId: 'resetPasswordFormPassword',
        }
    ]

    // http://localhost:5173/reset-password?userId='27aaaaaaaaaaaaaaaa'&secret='27bbbbbbbbbbbbbbbbbb'&email='hakop@ccasfsdsdfds.com'

    // Get Reset Details
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
        const secret = params.get('secret');
        const email = params.get('email');

        console.log('THESE ARE THE PARAMS:', params);

        if (params.size === 0) {
            navigate('/');
        }

        const FunctionInResetPasswrodComponent = async () => {
            if (!userId || !secret || !email) {
                return;
            }

            try {
                console.log('Starting FunctionInResetPasswrodComponent in <ResetPassword/>.');

                await new Promise(resolve => setTimeout(resolve, 1500));

                console.log('FunctionInResetPasswrodComponent in process.');
            } catch (err) {
                console.error('Authentication failed. Please try again.', err);
            } finally {
                console.log('Finishing FunctionInResetPasswrodComponent in <ResetPassword/>.');
            }
        };

        FunctionInResetPasswrodComponent();

    }, []);

    const onPasswrodChange = async (event) => {

        event.preventDefault();

        try {
            setIsResetPasswordLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Password change clicked.');

            setResetPsswdErrorMsg('');

        } catch (error) {
            console.error('Error resetting passowrd:', error);
        } finally {
            setIsResetPasswordLoading(false);
        }
    }


    return (
        <Container>
            <Row>
                <Col>
                    <SignFormLayout
                        type="reset"
                        titleText="Reset password for"
                        logo={sn_logo}
                        onSubmit={onPasswrodChange}
                        formFields={formFields}
                        submitButtonText="Reset Password"
                        isLoading={isResetPasswordLoading}
                        errorMsg={resetPsswdErrorMsg}
                        isSubmitDisabled={newPassword === '' || newPassword.length < 8}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default ResetPassword