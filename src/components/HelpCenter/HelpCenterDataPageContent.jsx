import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { HelpCenterOffcanvas } from './HelpCenterOffcanvas';
import { HelpCenterBreadCrumb } from './HelpCenterBreadCrumb';
import { HelpCenterArrs } from './HelpCenterArrs';

const HelpCenterDataPageContent = ({ isLoggedIn }) => {

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
                isLoggedIn={isLoggedIn}
            />

            <div className='d-flex flex-column flex-sm-row'>

                <HelpCenterOffcanvas
                    helpCenterTitlesPath={helpCenterTitlesPath}
                    sectionTitleByPath={sectionTitleByPath}
                    sectionTopicsByPath={sectionTopicsByPath}
                />

                {/* Side menu */}
                <section
                    aria-labelledby='help-center-topics-title'
                    className='d-none d-sm-block p-0 help__center-titles-list-section'
                >
                    <h2 id='help-center-topics-title' className='visually-hidden'>
                        Help Center Topics
                    </h2>

                    <ListGroup as='ul' className='help__center-titles-list' role='list'>
                        {sectionTopicsByPath[helpCenterTitlesPath].map((title, idx) => (
                            <ListGroup.Item
                                as='li'
                                key={idx}
                                className='help__center-titles-list-item'
                            >
                                <Link to={`../${title.path}`}>
                                    {title.header}
                                </Link>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </section>

                {/* Content */}
                <section
                    aria-labelledby="help-topic-title"
                    className="w-100 d-flex flex-column"
                >
                    <Row>
                        <Col>
                            <h4 id="help-topic-title">
                                {topicTitleByPath[helpCenterTitlesPath]?.[helpCenterDataPath] || 'Title not found'}
                            </h4>

                            <div>
                                <p className='mb-2 help__center-data-content-intro'>
                                    {topicDetailsByPath[helpCenterDataPath].intro}
                                </p>
                                <ListGroup as='ol' className='help__center-data-list'>
                                    {topicDetailsByPath[helpCenterDataPath].steps.map((step, idx) => (
                                        <ListGroup.Item key={idx} as='li' className='help__center-data-list-item'>
                                            <strong>{idx + 1}.</strong> {' '}{step}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <p className='mt-2 help__center-data-content-outro'>
                                    {topicDetailsByPath[helpCenterDataPath].outro}
                                </p>
                            </div>
                        </Col>
                    </Row>

                    <hr className='mb-2' />

                    <Row xs={1} md={2} className='h-100 d-flex align-items-center'>
                        <Col>
                            {previousTitle && (
                                <Button
                                    as={Link}
                                    to={`../${previousTitle}`}
                                    className='help-center__title-switch-btn d-flex flex-column justify-content-center ps-2 py-3 flex-grow-1 h-100'
                                    aria-label={`Previous topic: ${topicTitleByPath[helpCenterTitlesPath][previousTitle]}`}
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
                                <Button
                                    as={Link}
                                    to={`../${nextTitle}`}
                                    className='help-center__title-switch-btn d-flex flex-column justify-content-center pe-2 py-3 flex-grow-1 h-100'
                                    aria-label={`Next topic: ${topicTitleByPath[helpCenterTitlesPath][nextTitle]}`}
                                >
                                    <div className='d-flex justify-content-end'>
                                        <span className='text-end'>
                                            {topicTitleByPath[helpCenterTitlesPath][nextTitle]}
                                        </span>
                                        <i className='bi bi-arrow-right ms-1 ms-md-2 d-flex align-items-center' />
                                    </div>
                                </Button>
                            )}
                        </Col>
                    </Row>
                </section>

            </div>
        </>
    )
}

export default HelpCenterDataPageContent;