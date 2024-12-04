import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { Loading } from '../../Loading/Loading';

export const Passcode = () => {

    const { googleUserData } = useUserContext();
    const { editPasscode } = useUserInfo(googleUserData);

    const [passcodeVal, setPasscodeVal] = useState();
    const [isUpdating, setIsUpdating] = useState(false);

    const handlePasscodeChange = (e) => {
        console.log(e.target.value);
        const input = e.target.value;

        if (/^\d{0,6}$/.test(input)) {
            setPasscodeVal(input);
        }
    }

    const handleUpdate = async (e) => {
        setIsUpdating(true);
        e.preventDefault();
        try {
            console.log('Barev');
            await editPasscode(passcodeVal);
        } catch (error) {
            console.error('Error updating passcode:', error);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <Row>
            <Col>
                <h4>Update Passcode:</h4>
                <p>Update your organization's passcode. The maximum number of digits for your passcode is 6.</p>
            </Col>
            <Col className='d-flex'>
                <Form
                    onSubmit={handleUpdate}
                >
                    <Form.Group
                        controlId='passcodeField'>
                        <Form.Label>
                            Passcode:
                        </Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter your passcode'
                            value={passcodeVal || ''}
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
                        disabled={isUpdating || passcodeVal?.length !== 6}
                        className='settings__update-username-btn'
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                        {isUpdating && <Loading />}
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}
