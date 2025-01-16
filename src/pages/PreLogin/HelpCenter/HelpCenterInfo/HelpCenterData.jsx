import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCenterArrs } from './HelpCenterArrs';
import { Container, Row, Col, ListGroup, Offcanvas, Nav, Breadcrumb, Button } from 'react-bootstrap';
import { HelpCenterBreadCrumb } from './HelpCenterBreadCrumb';

const HelpCenterData = () => {

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    const { topicTitleByPath, topicDetailsByPath, nextTitle, previousTitle, sectionTopicsByPath, sectionTitleByPath } = HelpCenterArrs();

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    useEffect(() => {
        console.log('sectionTitleByPath:', sectionTitleByPath[helpCenterTitlesPath]);

        console.log('helpCenterTitlesPath', helpCenterTitlesPath);

    }, [topicDetailsByPath]);

    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const handleShowOffcanvas = () => setShowOffcanvas(true);

    return (
        <Container>

            <HelpCenterBreadCrumb
                Link={Link}
                helpCenterDataPath={helpCenterDataPath}
                helpCenterTitlesPath={helpCenterTitlesPath}
                sectionTitleByPath={sectionTitleByPath}
                topicTitleByPath={topicTitleByPath}
            />

            <div className='d-flex flex-column flex-sm-row'>

                <Button className='d-sm-none help-center__offcanvas-btn' onClick={handleShowOffcanvas}>
                    <i className='bi bi-list' />
                </Button>

                <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} className='help-center__offcanvas'>
                    <Offcanvas.Body className='help-center__offcanvas-body'>
                        <ListGroup as='ul' className='help__center-titles-list'>
                            {
                                sectionTopicsByPath[helpCenterTitlesPath].map((title, idx) => {
                                    return (
                                        <ListGroup.Item as={'li'} className='help__center-titles-list-item' key={idx}>
                                            <Link to={`help-center/${helpCenterTitlesPath}/${title.path}`} onClick={handleCloseOffcanvas}>
                                                {title.header}
                                            </Link>
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                    </Offcanvas.Body>
                </Offcanvas>

                <ListGroup as='ul' className='help__center-titles-list d-none d-sm-block'>
                    {
                        sectionTopicsByPath[helpCenterTitlesPath].map((title, idx) => {
                            return (
                                <ListGroup.Item as={'li'} className='help__center-titles-list-item' key={idx}>
                                    <Link to={`help-center/${helpCenterTitlesPath}/${title.path}`}>
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
                                    to={`help-center/${helpCenterTitlesPath}/${previousTitle}`}
                                    className='help-center__title-switch-btn
                                       d-flex justify-content-start
                                        ps-2 py-3 flex-grow-1'
                                >
                                    <i className='bi bi-arrow-left me-1 me-md-2 d-flex align-items-center' />
                                    <span className='text-start'>
                                        {topicTitleByPath[helpCenterTitlesPath][previousTitle]}
                                    </span>
                                </Button>
                            )}
                        </Col>
                        <Col className='mt-2 mt-md-0'>
                            {nextTitle && (
                                <Button as={Link}
                                    to={`help-center/${helpCenterTitlesPath}/${nextTitle}`}
                                    className='help-center__title-switch-btn 
                                    d-flex justify-content-end 
                                    pe-2 py-3 flex-grow-1'
                                >
                                    <span className='text-end'>
                                        {topicTitleByPath[helpCenterTitlesPath][nextTitle]}
                                    </span>
                                    <i className='bi bi-arrow-right ms-1 ms-md-2 d-flex align-items-center' />
                                </Button>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    )
}

export default HelpCenterData;