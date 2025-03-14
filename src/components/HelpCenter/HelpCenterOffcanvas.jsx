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
            <Button className='d-sm-none help-center__offcanvas-btn' onClick={handleShowOffcanvas}>
                <i className='bi bi-list' />
            </Button>

            <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} className='help-center__offcanvas'>
                <Offcanvas.Body className='help-center__offcanvas-body'>
                    <ListGroup as='ul' className='help__center-titles-list'>
                        <h6>{helpCenterTitlesPath && sectionTitleByPath[helpCenterTitlesPath]}</h6>
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
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
