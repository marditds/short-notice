import React from 'react';
import { Nav } from 'react-bootstrap';

export const HelpCenterBreadCrumb = ({ Link, helpCenterTitlesPath, sectionTitleByPath, helpCenterDataPath, topicTitleByPath }) => {
    return (
        <>
            <Nav className='d-inline-flex align-items-center help-center__breadcrumb'>
                <Nav.Item>
                    <Nav.Link as={Link} to={`/help-center`} className='help-center__breadcrumb-link'>
                        Help Center
                    </Nav.Link>
                </Nav.Item>
                <span className='px-3'>/</span>
                <Nav.Item>
                    <Nav.Link as={Link} to={`/help-center/${helpCenterTitlesPath}`} className='help-center__breadcrumb-link'>
                        {sectionTitleByPath[helpCenterTitlesPath]}
                    </Nav.Link>
                </Nav.Item>
                {
                    helpCenterDataPath !== undefined || null ?
                        <>
                            <span className='px-3'>/</span>
                            <Nav.Item>
                                {topicTitleByPath[helpCenterTitlesPath]?.[helpCenterDataPath]}
                            </Nav.Item>
                        </>
                        : null
                }
            </Nav>
            <hr className='mt-0 mb-0 mb-sm-2' />
        </>
    )
}
