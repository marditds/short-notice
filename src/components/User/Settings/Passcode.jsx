import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import useUserInfo from '../../../lib/hooks/useUserInfo';

export const Passcode = ({ accountType }) => {

    const { editPasscode } = useUserInfo();

    const handlePasscodeChange = (e) => {
        console.log(e.target.value);

    }

    const handleSubmit = async () => {

        // await editPasscode();
        console.log('Barev');
    }

    return (
        <Row>
            <Col>
                <h4>Update Passcode:</h4>
                <p>Update your organization's passcode. The maximum number of digits for your passcode is 6.</p>
            </Col>
            <Col className='d-flex'>
                <Form
                    onSubmit={handleSubmit}
                >
                    {/* <Form.Group
                        controlId='usernameField'>
                        <Form.Label>
                            Passcode:
                        </Form.Label>
                        <Form.Control
                            type='username'
                            placeholder='Enter your username'
                            value={localUsername || ''}
                            onChange={handlePasscodeChange}
                            style={{ maxWidth: '320px' }}
                            className='settings__username-field'
                        />
                        <Form.Text className='settings__username-unique'>
                            Your passcode must contain six digits.
                        </Form.Text>
                    </Form.Group>
                    <Button
                        type='submit'
                        disabled={isUpdating || localUsername === '' ? true : false}
                        className='settings__update-username-btn'
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                        {isUpdating && <Loading />}
                    </Button> */}
                </Form>
            </Col>
        </Row>
    )
}
