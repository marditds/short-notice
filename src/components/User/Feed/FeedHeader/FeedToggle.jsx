import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { screenUtils } from '../../../../lib/utils/screenUtils';

export const FeedToggle = ({ isFeedToggled, handleFeedToggle, handleRefresh, isAnyTagSelected, isTagSelected }) => {

    const { isExtraLargeScreen, isLargeScreen } = screenUtils();

    return (
        <Form className={`d-flex justify-content-center align-items-center ${!isLargeScreen ? 'w-75 ms-auto' : 'w-100'}`}
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
                    <Form.Label onClick={!isFeedToggled ? null : handleFeedToggle} className='mb-0 user-feed__toggle-label'>Personal Feed</Form.Label>
                </Col>

                <Col xs='auto px-0'>
                    <Form.Check
                        type='switch'
                        id='feed-switch'
                        label=''
                        disabled={!isAnyTagSelected}
                        checked={isFeedToggled}
                        onChange={handleFeedToggle}
                        className='d-flex justify-content-center user-feed__toggle-btn'
                    />
                </Col>

                <Col xs='auto' className='d-flex align-items-center'>
                    <Form.Label onClick={isFeedToggled || !isAnyTagSelected ? null : handleFeedToggle} className={`mb-0 user-feed__toggle-label ${!isAnyTagSelected && 'toggle-label-muted'}`}>General Feed</Form.Label>
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
