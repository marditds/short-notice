import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Container, ListGroup } from 'react-bootstrap';

const HelpCenterData = () => {

    let { helpCenterPath } = useParams();
    const location = useLocation();

    const data = {
        'getting-started': 'aaaaaaaaaaaaaaa',
        'manage-account': 'bbbbbbbbbbbbbbb'
    }

    useEffect(() => {
        console.log('Pathname:', location.pathname);
    })


    useEffect(() => {
        console.log('helpCenterPath', helpCenterPath);
    }, [helpCenterPath])

    // useEffect(() => {
    //     console.log('getting-started', data[helpCenterPath]);
    // }, [helpCenterPath])

    const gettingStartedTitles = [
        {
            header: 'How to create a ShortNotice account',
            path: 'how-to'
        },
        {
            header: 'Account verification',
            path: 'account-verification'
        },
        {
            header: 'Log in/out of your account',
            path: 'login-information'
        },
        {
            header: 'Requirements to join ShortNotice',
            path: 'platform-requirements'
        }
    ]

    return (
        <Container>
            {data[helpCenterPath]}
            <h4 className='help__center-data-title fw-bold'>Getting Started</h4>
            <ListGroup as='ul' className='help__center-data-list'>
                {
                    gettingStartedTitles.map((title, idx) => {
                        return (
                            <ListGroup.Item as={'li'} className='help__center-data-list-item' key={idx}>
                                <Link to={`help-center/getting-started/${title.path}`}>
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

export default HelpCenterData;