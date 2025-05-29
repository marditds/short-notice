import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Offcanvas, ListGroup } from 'react-bootstrap';

export const HelpCenterOffcanvas = ({ sectionTitleByPath, helpCenterTitlesPath, sectionTopicsByPath, }) => {

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const handleShowOffcanvas = () => setShowOffcanvas(true);

    useEffect(() => {
        console.log('sectionTopicsByPath', sectionTopicsByPath);
        console.log('helpCenterTitlesPath', helpCenterTitlesPath);
        console.log('sectionTopicsByPath[helpCenterTitlesPath]', sectionTopicsByPath[helpCenterTitlesPath]);

    }, [showOffcanvas])

    return (
        <>
            <Button
                className='d-sm-none help-center__offcanvas-btn'
                onClick={handleShowOffcanvas}
                aria-controls='help-center-offcanvas'
                aria-expanded={showOffcanvas}
                aria-label='Open help topics menu'
            >
                <i className='bi bi-list' />
            </Button>

            <Offcanvas
                show={showOffcanvas}
                onHide={handleCloseOffcanvas}
                className='help-center__offcanvas'
                id='help-center-offcanvas'
                aria-labelledby='offcanvas-title'
            >
                <Offcanvas.Body className='help-center__offcanvas-body'>
                    <section aria-labelledby='offcanvas-title' className='d-flex align-items-center justify-content-center flex-column'>
                        <h6 id='offcanvas-title' className='mb-3 text-right'>
                            {helpCenterTitlesPath && sectionTitleByPath[helpCenterTitlesPath]}
                        </h6>
                        <ListGroup as='ul' className='help__center-titles-list'>
                            {
                                sectionTopicsByPath[helpCenterTitlesPath]?.map((title, idx) => {
                                    return (
                                        <ListGroup.Item as={'li'} className='help__center-titles-list-item' key={idx}>
                                            <Link to={`../${title.path}`} onClick={handleCloseOffcanvas}>
                                                {/* <Link to={`../help-center/${helpCenterTitlesPath}/${title.path}`} onClick={handleCloseOffcanvas}> */}
                                                {title.header}
                                            </Link>
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                    </section>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
