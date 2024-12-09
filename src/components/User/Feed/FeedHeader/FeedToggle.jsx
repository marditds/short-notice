import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export const FeedToggle = ({ isFeedToggled, handleFeedToggle, handleRefresh }) => {
    return (
        <Form className='d-flex justify-content-center align-items-center'
        >
            <Form.Group as={Row} className='align-items-center'>
                <Col xs='auto' className='d-flex align-items-center'>
                    <Button
                        className='py-0 px-1 mx-1 user-feed__refresh-btn'
                        style={{ visibility: !isFeedToggled ? 'visible' : 'hidden', height: '26px' }}
                        onClick={!isFeedToggled ? handleRefresh : null}
                    >
                        <i className='bi bi-arrow-clockwise'></i>
                    </Button>
                    <Form.Label className='mb-0'>Personal Feed</Form.Label>
                </Col>

                <Col xs='auto px-0'>
                    <Form.Check
                        type='switch'
                        id='feed-switch'
                        label=''
                        checked={isFeedToggled}
                        onChange={handleFeedToggle}
                        className='d-flex justify-content-center user-feed__toggle-btn'
                    />
                </Col>

                <Col xs='auto' className='d-flex align-items-center'>
                    <Form.Label className='mb-0'>General Feed</Form.Label>
                    <Button
                        className='py-0 px-1 mx-1 user-feed__refresh-btn'
                        style={{ visibility: isFeedToggled ? 'visible' : 'hidden', height: '26px' }}
                        onClick={isFeedToggled ? handleRefresh : null}
                    >
                        <i className='bi bi-arrow-clockwise'></i>
                    </Button>
                </Col>
            </Form.Group>
        </Form>
    )
}
