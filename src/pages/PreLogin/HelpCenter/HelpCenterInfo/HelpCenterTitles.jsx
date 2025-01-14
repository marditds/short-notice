import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, ListGroup } from 'react-bootstrap';

const HelpCenterTitles = () => {

    let { helpCenterTitlesPath } = useParams();

    const titleMapping = {
        'getting-started': 'Getting Started',
        'manage-account': 'Manage Account'
    };

    const titlesMap = {
        'getting-started': [
            { header: 'How to create a ShortNotice account', path: 'how-to' },
            { header: 'Account verification', path: 'account-verification' },
            { header: 'Log in to your account', path: 'login-information' },
            { header: 'Log out of your account', path: 'logout-information' },
            { header: 'Requirements to join ShortNotice', path: 'platform-requirements' }
        ],
        'manage-account': [
            { header: 'Email change', path: 'email-change' },
            { header: 'Username change', path: 'username-change' },
            { header: 'Avatar change', path: 'avatar-change' },
            { header: 'Account visibility', path: 'account-visibility' },
            { header: 'Deleting account', path: 'deleting-account' }
        ],
        'navigation-guide': [
            { header: 'Compose notice', path: 'compose-notice' },
            { header: 'Edit notice', path: 'edit-notice' },
            { header: 'Delete notice', path: 'delete-notice' },
            { header: 'Post reaction to others\' notices', path: 'post-reaction-to-notices' },
            { header: 'Interact with others\' notices', path: 'interact-with-notices' },
            { header: 'Report others\' notices', path: 'report-others-notices' },
            { header: 'View saved and liked notices', path: 'view-saved-liked' },
            { header: 'Follow other users', path: 'follow-other-users' },
        ],
    };

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