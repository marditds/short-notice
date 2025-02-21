import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FeedToggle } from './FeedToggle';
import '../Feed.css';



export const FeedBody = ({ isTagSelected, isFeedToggled, handleFeedToggle, handleRefresh, isAnyTagSelected, sideContent, children }) => {


    return (
        <>
            <Row className='fixed-top w-100 ms-auto me-auto user-feed__header'>
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


            {/* Side section */}
            <Row className='position-relative'>
                {/* Feed tag selection */}
                <Col xs={3} className='flex-column d-xl-block d-none fixed-top w-25'
                    style={{
                        position: 'sticky', top: '100px', height: 'calc(100vh - 100px)', overflowY: 'auto'
                    }}>
                    {sideContent}
                </Col>

                {/* Feed Notices */}
                <Col xl={9} xs={12} className={`ms-auto`}>
                    {children}
                </Col>
            </Row>

        </>
    )
}
