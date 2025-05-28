import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export const Visibility = () => {

    const [privacyStatus, setPrivacyStatus] = useState('Public');

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4>Privacy:</h4>
                <p>Set your account's visibility to private.</p>
            </Col>
            <Col className='d-flex'>
                <h4
                    style={{ width: '100px' }}
                    className='me-5'
                    id='privacy-status'
                >
                    {privacyStatus}
                </h4>
                <Form aria-describedby='privacy-switch-desc'>
                    <Form.Check
                        type='switch'
                        id='visibility-switch'
                        label='Switch to private'
                        disabled
                        aria-disabled='true'
                        aria-describedby='privacy-switch-desc'
                    />
                    <Form.Text id='privacy-switch-desc' className='settings__username-switch'>
                        Feature currently unavailable.
                    </Form.Text>
                </Form>
            </Col>
        </Row>
    )
}
