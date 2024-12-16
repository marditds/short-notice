import React from 'react';
import { Row, Col } from 'react-bootstrap';

export const CallToAction = ({ joinNowTexts, children }) => {
    return (
        <Row>
            <Col className='d-flex justify-content-evenly align-items-center cta-col py-5'>
                <div>
                    <h2>{joinNowTexts}</h2>
                </div>
                <div>
                    {children}
                </div>
            </Col>
        </Row>
    )
}
