import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FeedToggle } from './FeedToggle';
import '../Feed.css'



export const FeedHeader = ({ isTagSelected, isFeedToggled, handleFeedToggle, handleRefresh, isAnyTagSelected }) => {

    return (
        <Row className='fixed-top w-100 ms-auto me-auto user-feed__header'>
            {/* <Col  >
                fgfgdfgdf
            </Col> */}
            <Col>
                <FeedToggle
                    isTagSelected={isTagSelected}
                    isAnyTagSelected={isAnyTagSelected}
                    isFeedToggled={isFeedToggled}
                    handleFeedToggle={handleFeedToggle}
                    handleRefresh={handleRefresh}
                />
            </Col>
        </Row>
    )
}
