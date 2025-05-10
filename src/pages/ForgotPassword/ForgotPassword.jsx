import { useState } from 'react';
import { createAuthPasswordRecovery } from '../../lib/context/dbhandler';
import { Col, Container, Row } from 'react-bootstrap';
import { SignFormLayout } from '../../components/LoginForm/SignFormLayout';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [thanksgivingWish, setThanksgivingWish] = useState('');
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
    const [forgotPsswdSuccessMsg, setForgotPsswdSuccessMsg] = useState(null);
    const [forgotPsswdErrorMsg, setForgotPsswdErrorMsg] = useState(null);


    // Get password recovery email from Appwrite
    const onForgotPassword = async (event) => {

        event.preventDefault();

        if (thanksgivingWish) {
            setErrorMsg('Try again.');
            return;
        }

        try {
            setIsForgotPasswordLoading(true);

            console.log('onForgotPassword clicked.');

            const res = await createAuthPasswordRecovery(email, 'http://localhost:5173/reset-password');

            if (typeof res === 'string') {
                setForgotPsswdErrorMsg(res);
                setForgotPsswdSuccessMsg(null);
                setEmail('');
                return;
            }

            console.log(res);

            setEmail('');
            setForgotPsswdSuccessMsg('A recovery link from Appwrite has been sent to your email. Please check your inbox.');
            setForgotPsswdErrorMsg('');
        } catch (error) {
            console.error('Error onForgotPassword:', error);
            setForgotPsswdErrorMsg('Something went wrong. Please try again later.');
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
                        type='forgot'
                        titleText='Recover password'
                        onSubmit={onForgotPassword}
                        formFields={formFields}
                        submitButtonText='Get Recovery Email'
                        isLoading={isForgotPasswordLoading}
                        errorMsg={forgotPsswdErrorMsg}
                        successMsg={forgotPsswdSuccessMsg}
                        wishValue={thanksgivingWish}
                        onWishChange={(e) => setThanksgivingWish(e.target.value)}
                        isSubmitDisabled={email === ''}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default ForgotPassword;