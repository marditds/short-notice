import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

export const Interests = () => {

    const handleSubmit = () => {
        console.log('Interests.');
    }

    return (
        <Row>
            <Col>
                <h4>Update Interests:</h4>
                <p>Update your username. The maximum number of characters for your username is 16.</p>
            </Col>
            <Col className='d-flex'>
                <h4
                    style={{ width: '100px' }}
                    className='me-5'
                >
                    Hakobos
                </h4>
                Wow
            </Col>
        </Row>
    )
}
