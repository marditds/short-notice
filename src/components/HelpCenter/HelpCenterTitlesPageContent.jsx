import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCenterBreadCrumb } from './HelpCenterBreadCrumb';
import { ListGroup } from 'react-bootstrap';
import { HelpCenterArrs } from './HelpCenterArrs';

const HelpCenterTitlesPageContent = ({ isLoggedIn }) => {

    let { helpCenterTitlesPath } = useParams();

    const { topicTitleByPath, sectionTitleByPath, sectionTopicsByPath } = HelpCenterArrs();

    return (
        <>
            <HelpCenterBreadCrumb
                Link={Link}
                helpCenterTitlesPath={helpCenterTitlesPath}
                sectionTitleByPath={sectionTitleByPath}
                topicTitleByPath={topicTitleByPath}
                isLoggedIn={isLoggedIn}
            />

            <h4 className='help__center-titles-title fw-bold mt-2'>
                {sectionTitleByPath[helpCenterTitlesPath] || 'Help Center'}
            </h4>
            <ListGroup as='ul' className='help__center-titles-list'>
                {
                    sectionTopicsByPath[helpCenterTitlesPath].map((title, idx) => {
                        return (
                            <ListGroup.Item as={'li'} className='help__center-titles-list-item' key={idx}>
                                <Link to={`./${title.path}`}>
                                    {/* <Link to={`../help-center/${helpCenterTitlesPath}/${title.path}`}> */}
                                    {/* <Link to={`${title.path}`}> */}
                                    {title.header}
                                </Link>
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
        </>
    )
}

export default HelpCenterTitlesPageContent