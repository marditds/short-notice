import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { HelpCenterOffcanvas } from './HelpCenterOffcanvas';
import { HelpCenterBreadCrumb } from './HelpCenterBreadCrumb';
import { HelpCenterArrs } from './HelpCenterArrs';

const HelpCenterDataPageContent = () => {

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    const { topicTitleByPath, topicDetailsByPath, nextTitle, previousTitle, sectionTopicsByPath, sectionTitleByPath } = HelpCenterArrs();

    useEffect(() => {
        console.log('sectionTitleByPath:', sectionTitleByPath[helpCenterTitlesPath]);

        console.log('helpCenterTitlesPath', helpCenterTitlesPath);

    }, [topicDetailsByPath]);

    return (
        <>
            <HelpCenterBreadCrumb
                Link={Link}
                helpCenterDataPath={helpCenterDataPath}
                helpCenterTitlesPath={helpCenterTitlesPath}
                sectionTitleByPath={sectionTitleByPath}
                topicTitleByPath={topicTitleByPath}
            />

            <div className='d-flex flex-column flex-sm-row'>

                <HelpCenterOffcanvas
                    helpCenterTitlesPath={helpCenterTitlesPath}
                    sectionTitleByPath={sectionTitleByPath}
                    sectionTopicsByPath={sectionTopicsByPath}
                />

                <ListGroup as='ul' className='help__center-titles-list d-none d-sm-block'>
                    {
                        sectionTopicsByPath[helpCenterTitlesPath].map((title, idx) => {
                            return (
                                <ListGroup.Item as={'li'} className='help__center-titles-list-item' key={idx}>
                                    <Link to={`../help-center/${helpCenterTitlesPath}/${title.path}`}>
                                        {title.header}
                                    </Link>
                                </ListGroup.Item>
                            )
                        })
                    }
                </ListGroup>

                <div className='w-100 d-flex flex-column justify-content-between'>
                    <Row>
                        <Col>
                            <h4> {
                                topicTitleByPath[helpCenterTitlesPath]?.[helpCenterDataPath]
                                || 'Title not found'
                            }</h4>

                            <div>
                                <p className='mb-2'>{topicDetailsByPath[helpCenterDataPath].intro}</p>
                                <ListGroup as='ol' className='help__center-data-list'>
                                    {topicDetailsByPath[helpCenterDataPath].steps.map((step, idx) => (
                                        <ListGroup.Item key={idx} as='li' className='help__center-data-list-item aaa'>
                                            <strong>
                                                {topicDetailsByPath[helpCenterDataPath].steps.indexOf(step) + 1}.
                                            </strong>
                                            {'  '}{step}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <p className='mt-2'>{topicDetailsByPath[helpCenterDataPath].outro}</p>
                            </div>
                        </Col>
                    </Row>
                    <hr className='mb-2' />

                    <Row xs={1} md={2} className='h-100'>

                        <Col>
                            {previousTitle && (
                                <Button as={Link}
                                    to={`../help-center/${helpCenterTitlesPath}/${previousTitle}`}
                                    className='help-center__title-switch-btn
                                       d-flex flex-column justify-content-center 
                                        ps-2 py-3 flex-grow-1 h-100'
                                >
                                    <div className='d-flex'>
                                        <i className='bi bi-arrow-left me-1 me-md-2 d-flex align-items-center' />
                                        <span className='text-start'>
                                            {topicTitleByPath[helpCenterTitlesPath][previousTitle]}
                                        </span>
                                    </div>
                                </Button>
                            )}
                        </Col>
                        <Col className='mt-2 mt-md-0'>
                            {nextTitle && (
                                <Button as={Link}
                                    to={`../help-center/${helpCenterTitlesPath}/${nextTitle}`}
                                    className='help-center__title-switch-btn 
                                    d-flex flex-column justify-content-center  
                                    pe-2 py-3 flex-grow-1 h-100'
                                >
                                    <div className='d-flex justify-content-end '>
                                        <span className='text-end'>
                                            {topicTitleByPath[helpCenterTitlesPath][nextTitle]}
                                        </span>
                                        <i className='bi bi-arrow-right ms-1 ms-md-2 d-flex align-items-center' />
                                    </div>
                                </Button>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default HelpCenterDataPageContent;