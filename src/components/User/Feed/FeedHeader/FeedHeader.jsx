import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { GeneralFeedGuide } from './GeneralFeedGuide';
import { FeedToggle } from './FeedToggle';
import '../Feed.css'



export const FeedHeader = ({ isTagSelected, isFeedToggled, handleFeedToggle }) => {
    return (
        <Row className='fixed-top ms-auto me-auto d-flex align-items-center user-feed__header'>
            <Col>
                <GeneralFeedGuide
                    isTagSelected={isTagSelected}
                />
            </Col>
            <Col>
                <FeedToggle
                    isFeedToggled={isFeedToggled}
                    handleFeedToggle={handleFeedToggle}
                />
            </Col>
            <Col className='col d-none d-lg-block'></Col>
        </Row>
    )
}
