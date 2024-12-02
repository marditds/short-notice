import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export const FeedToggle = ({ isFeedToggled, handleFeedToggle }) => {
    return (
        <Form className='d-flex justify-content-center align-items-center'
        >
            <Form.Group as={Row} className="align-items-center">
                <Col xs='auto'>
                    <Form.Label className="mb-0">Personal Feed</Form.Label>
                </Col>

                <Col xs='auto'>
                    <Form.Check
                        type="switch"
                        id="feed-switch"
                        label=""
                        checked={isFeedToggled}
                        onChange={handleFeedToggle}
                        className='d-flex justify-content-center'
                    />
                </Col>

                <Col xs='auto'>
                    <Form.Label className="mb-0">General Feed</Form.Label>
                </Col>
            </Form.Group>
        </Form>
    )
}
