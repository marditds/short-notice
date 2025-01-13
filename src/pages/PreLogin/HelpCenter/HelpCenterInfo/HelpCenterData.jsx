import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, ListGroup, ListGroupItem } from 'react-bootstrap';

const HelpCenterData = () => {

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    const titleMapping = {
        'getting-started': {
            'how-to': 'How to create a ShortNotice account',
            'account-verification': 'Account verification',
            'login-information': 'Log in/out of your account',
            'platform-requirements': 'Requirements to join ShortNotice'
        },
        'manage-account': {
            'email-change': 'Email change',
            'username-change': 'Username change',
            'avatar-change': 'Avatar change',
            'account-visibility': 'Account visibility',
            'deleting-account': 'Deleting account'
        }
    };

    const titlesMap = {
        'how-to': {
            intro: 'To create a ShortNotice account, follow these steps:',
            steps: [
                'Click/Tap on "Sign in with Google',
                'Enter your email or phone number associated with your Google account.',
                'Click/Tap on "Next."',
                'Enter your password.',
                'Click/Tap on "Next."',
                'Click/Tap on "Continue."'
            ],
            outro: 'By following these steps, you will be able to create your account for ShortNotice.'
        },
        'account-verification': {
            intro: 'To create a ShortNotice account, follow these steps:',
            steps: [
                'Click/Tap on "Sign in with Google',
                'Enter your email or phone number associated with your Google account.',
                'Click/Tap on "Next."',
                'Enter your password.',
                'Click/Tap on "Next."',
                'Click/Tap on "Continue."'
            ],
            outro: 'By following these steps, you will be able to create your account for ShortNotice.'
        },
        'login-information': {
            intro: 'To create a ShortNotice account, follow these steps:',
            steps: [
                'Click/Tap on "Sign in with Google',
                'Enter your email or phone number associated with your Google account.',
                'Click/Tap on "Next."',
                'Enter your password.',
                'Click/Tap on "Next."',
                'Click/Tap on "Continue."'
            ],
            outro: 'By following these steps, you will be able to create your account for ShortNotice.'
        },
        'platform-requirements': {
            intro: 'To create a ShortNotice account, follow these steps:',
            steps: [
                'Click/Tap on "Sign in with Google',
                'Enter your email or phone number associated with your Google account.',
                'Click/Tap on "Next."',
                'Enter your password.',
                'Click/Tap on "Next."',
                'Click/Tap on "Continue."'
            ],
            outro: 'By following these steps, you will be able to create your account for ShortNotice.'
        }

    };

    useEffect(() => {
        console.log('gettingStartedPath', helpCenterDataPath);
    }, [helpCenterDataPath])

    return (
        <Container>
            This is {helpCenterDataPath}.
            <h4> {
                titleMapping[helpCenterTitlesPath]?.[helpCenterDataPath]
                || 'Title not found'
            }</h4>

            <div>
                <p>{titlesMap[helpCenterDataPath].intro}</p>
                <ListGroup>
                    {titlesMap[helpCenterDataPath].steps.map((step, idx) => (
                        <ListGroup.Item key={idx}>{step}</ListGroup.Item>
                    ))}
                </ListGroup>
                <p>{titlesMap[helpCenterDataPath].outro}</p>
            </div>

        </Container>
    )
}

export default HelpCenterData;