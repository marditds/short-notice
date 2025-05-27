import { Row, Col, Form, Button } from "react-bootstrap";
import { LoadingSpinner } from '../Loading/LoadingSpinner';

export const Passcode = ({ passcode, setPasscode, checkPasscode, isCheckingPasscode, isPasscodeIncorrect }) => {

    const onPasscodeChange = (e) => {
        const input = e.target.value;

        if (input.length <= 25) {
            setPasscode(input);
        }
    }

    return (
        <div className='user-profile__organization-passcode'>
            <div>
                <Form onSubmit={(e) => { e.preventDefault(); checkPasscode(); }} className='d-flex align-items-end' aria-describedby={isPasscodeIncorrect ? 'passcode-error' : undefined}>
                    <Row className='flex-column'>
                        <Col>
                            <Form.Group
                                controlId="formOrganizationPasscode">
                                <Form.Label>Passcode: </Form.Label>
                                <Form.Control
                                    type="password"
                                    value={passcode}
                                    onChange={onPasscodeChange}
                                    className='user-profile__organization-passcode-field'
                                    aria-required='true'
                                    aria-invalid={isPasscodeIncorrect}
                                    aria-describedby={isPasscodeIncorrect ? 'passcode-error' : undefined}
                                />
                            </Form.Group>
                        </Col>
                        <Col className='mt-2'>
                            <Button
                                type='submit'
                                disabled={passcode.length < 6}
                                className='user-profile__organization-passcode-btn'
                                aria-label='Submit passcode'
                            >
                                {!isCheckingPasscode ?
                                    'Submit' :
                                    <>
                                        <LoadingSpinner />
                                        <span className="visually-hidden">Checking passcode...</span>
                                    </>}
                            </Button>
                        </Col>
                        <Col>
                            <Form.Text>
                                Don't have a passcode? Contact your manager.
                            </Form.Text>
                        </Col>
                    </Row>
                </Form>
                {isPasscodeIncorrect && (
                    <p
                        id='passcode-error'
                        className='mb-0 mt-2 position-absolute fw-bold'
                        style={{ color: 'var(--main-caution-color)' }}
                        role='alert'
                    >
                        Invalid passcode. Please try again or contact your leader.
                    </p>
                )}
            </div>
        </div>
    )
}
