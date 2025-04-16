import React from 'react';
import { Row, Col, Form, Button } from "react-bootstrap";
import { LoadingSpinner } from '../Loading/LoadingSpinner';

export const Passcode = ({ passcode, setPasscode, checkPasscode, isCheckingPasscode, isPasscodeIncorrect }) => {

    const onPasscodeChange = (e) => {
        const input = e.target.value;

        if (/^\d{0,25}$/.test(input)) {
            setPasscode(input);
            console.log(input);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (passcode.length === 6) {
                checkPasscode();
            }
        }
    };

    return (
        <div className='user-profile__organization-passcode'>
            <div>
                <Form className='d-flex align-items-end'>
                    <Row className='flex-column'>
                        <Col>
                            <Form.Group
                                controlId="formOrganizationPasscode">

                                <Form.Label>Passcode: </Form.Label>
                                <Form.Control
                                    type="password"
                                    value={passcode}
                                    onChange={onPasscodeChange}
                                    onKeyDown={handleKeyDown}
                                    className='user-profile__organization-passcode-field'
                                />
                            </Form.Group>
                        </Col>
                        <Col className='mt-2'>
                            <Button
                                variant="primary"
                                onClick={checkPasscode}
                                disabled={passcode.length < 6}
                                className='user-profile__organization-passcode-btn'
                            >
                                {!isCheckingPasscode ? 'Submit' : <LoadingSpinner />}
                            </Button>
                        </Col>
                        <Col>
                            <Form.Text>
                                Don't have a passcode? Contact your manager.
                            </Form.Text>
                        </Col>
                    </Row>
                </Form>
                <p className='mb-0 mt-2 position-absolute fw-bold' style={{ color: 'var(--main-caution-color)' }}>
                    {
                        isPasscodeIncorrect && 'Invalid passcode. Please try again or contact your leader.'
                    }
                </p>

            </div>
        </div>
    )
}
