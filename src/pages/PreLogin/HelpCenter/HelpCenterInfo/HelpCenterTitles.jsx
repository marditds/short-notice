import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, ListGroup } from 'react-bootstrap';
import { HelpCenterArrs } from './HelpCenterArrs.jsx';

const HelpCenterTitles = () => {

    let { helpCenterTitlesPath } = useParams();

    const { titleMapping, titlesMap } = HelpCenterArrs();

    return (
        <Container>
            <h4 className='help__center-titles-title fw-bold'>
                {titleMapping[helpCenterTitlesPath] || 'Help Center'}
            </h4>
            <ListGroup as='ul' className='help__center-titles-list'>
                {
                    titlesMap[helpCenterTitlesPath].map((title, idx) => {
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
        </Container>
    )
}

export default HelpCenterTitles;