import React, { useState } from 'react';
import { createAuthPasswordRecovery } from '../../lib/context/dbhandler';
import { Col, Container, Row } from 'react-bootstrap';
import { SignFormLayout } from '../../components/LoginForm/SignFormLayout';
// import sn_logo from '../../assets/sn_long.png';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
    const [forgotPsswdErrorMsg, setForgotPsswdErrorMsg] = useState(null);

    const onForgotPassword = async (e) => {
        try {
            setIsForgotPasswordLoading(true);

            console.log('onForgotPassword clicked.');

            const res = await createAuthPasswordRecovery(email, 'http://localhost:5173/reset-password');

            console.log(res);


            setForgotPsswdErrorMsg('');
        } catch (error) {
            console.error('Error onForgotPassword:', error);
        } finally {
            setIsForgotPasswordLoading(false);
        }
    }

    const formFields = [
        {
            label: 'Email:',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            controlId: 'forgotPasswordFormEmail',
        }
    ]

    return (
        <Container>
            <Row>
                <Col>
                    <SignFormLayout
                        type="forgot"
                        // titleText="Forgot your password?"
                        titleText="Recover password"
                        // logo={sn_logo}
                        onSubmit={onForgotPassword}
                        formFields={formFields}
                        submitButtonText="Get Recovery Email"
                        isLoading={isForgotPasswordLoading}
                        errorMsg={forgotPsswdErrorMsg}
                        isSubmitDisabled={email === ''}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default ForgotPassword