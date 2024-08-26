import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';


export const Visibility = () => {

    const [privacyStatus, setPrivacyStatus] = useState('Public');

    return (
        <Row>
            <Col>
                <h4>Privacy:</h4>
                <p>Set your account's visibility to private.</p>
            </Col>
            <Col className='d-flex'>
                <h4
                    style={{ width: '100px' }}
                    className='me-5'
                >
                    {privacyStatus}
                </h4>
                <Form>
                    <Form.Check
                        type="switch"
                        id="visibility-switch"
                        label="Switch to private"
                        disabled
                    />
                    <Form.Text>
                        Feature currently unavailable.
                    </Form.Text>
                </Form>
            </Col>
        </Row>
    )
}
