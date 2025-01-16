import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCenterArrs } from './HelpCenterArrs';
import { Container, Row, Col, ListGroup, Nav, Button } from 'react-bootstrap';

const HelpCenterData = () => {

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    const { titleDataMapping, titlesDataMap, nextTitle, previousTitle } = HelpCenterArrs();

    // const keys = Object.keys(titleDataMapping[helpCenterTitlesPath] || {});

    // const [nextTitle, setNextTitle] = useState(null);

    // const [previousTitle, setPreviousTitle] = useState(null);

    // useEffect(() => {
    //     const currentIndex = keys.indexOf(helpCenterDataPath);

    //     setPreviousTitle(currentIndex > 0 ? keys[currentIndex - 1] : null)

    //     setNextTitle(currentIndex < keys.length - 1 ? keys[currentIndex + 1] : null);

    // }, [helpCenterDataPath])

    useEffect(() => {
        console.log('nextTitle', nextTitle);
        console.log('previousTitle', previousTitle);
    }, [titlesDataMap])

    return (
        <Container>
            <Row>
                <Col>
                    <h4> {
                        titleDataMapping[helpCenterTitlesPath]?.[helpCenterDataPath]
                        || 'Title not found'
                    }</h4>

                    <div>
                        <p className='mb-2'>{titlesDataMap[helpCenterDataPath].intro}</p>
                        <ListGroup as='ol' className='help__center-data-list'>
                            {titlesDataMap[helpCenterDataPath].steps.map((step, idx) => (
                                <ListGroup.Item key={idx} as='li' className='help__center-data-list-item aaa'>
                                    <strong>
                                        {titlesDataMap[helpCenterDataPath].steps.indexOf(step) + 1}.
                                    </strong>
                                    {'  '}{step}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <p className='mt-2'>{titlesDataMap[helpCenterDataPath].outro}</p>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    {previousTitle && (
                        <div>
                            <h4 className='mb-0'>Previous</h4>
                            <Button as={Link}
                                to={`help-center/${helpCenterTitlesPath}/${previousTitle}`}
                                className='help-center__title-switch-btn px-0'
                            >
                                <i class='bi bi-arrow-left me-1 me-md-2' />
                                {titleDataMapping[helpCenterTitlesPath][previousTitle]}
                            </Button>
                        </div>
                    )}
                </Col>
                <Col className='d-flex justify-content-end'>
                    {nextTitle && (
                        <div>
                            <h4 className='d-flex justify-content-end mb-0'>Next</h4>
                            <Button as={Link}
                                to={`help-center/${helpCenterTitlesPath}/${nextTitle}`}
                                className='help-center__title-switch-btn px-0'
                            >
                                <div className='d-inline'>
                                    {titleDataMapping[helpCenterTitlesPath][nextTitle]}
                                    <i class='bi bi-arrow-right ms-1 ms-md-2' />
                                </div>
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default HelpCenterData;