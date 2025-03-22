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

        console.log('input', input);

        if (/^\d{0,25}$/.test(input)) {
            setPasscodeVal(input);

            if (input.length > 0 && input.length < 6) {
                return;
            }
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
                <p>Update your organization's passcode. The minimum number of digits for your passcode is 6.</p>
            </Col>
            <Col className='d-flex'>
                <Form
                    onSubmit={handleUpdate}
                    className='w-100'
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

                            className='settings__username-field'
                        />
                        <Form.Text className='settings__username-unique'>
                            <ul className='mb-0 ps-3'>
                                <li>Your passcode must contain at least six digits.</li>
                                <li>Your passcode cannot be longer than 25 digits.</li>
                            </ul>
                        </Form.Text>
                    </Form.Group>
                    <Button
                        type='submit'
                        disabled={isUpdating || passcodeVal?.length < 6}
                        className='settings__update-username-btn mt-1 mt-md-2'
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                        {isUpdating && <Loading />}
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}
