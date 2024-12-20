import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { GeneralFeedGuide } from './GeneralFeedGuide';
import { FeedToggle } from './FeedToggle';
import '../Feed.css'



export const FeedHeader = ({ isTagSelected, isFeedToggled, handleFeedToggle, handleRefresh }) => {
    return (
        <Row className='fixed-top ms-auto me-auto user-feed__header'>
            <Col
                className={!isTagSelected ? 'd-block' : 'd-none'}
            >
                <GeneralFeedGuide
                    isTagSelected={isTagSelected}
                />
            </Col>
            <Col>
                <FeedToggle
                    isFeedToggled={isFeedToggled}
                    handleFeedToggle={handleFeedToggle}
                    handleRefresh={handleRefresh}
                />
            </Col>
        </Row>
    )
}
