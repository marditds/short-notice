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
            intro: 'For the time being, ShortNotice does not require its users to verify their accounts.',
            steps: [
                'The users do not need to take any steps to verify their accounts.'
            ],
            outro: 'When there is a change, the users will be notified accordingly.'
        },
        'login-information': {
            intro: 'To login to your account, follow these steps:',
            steps: [
                'Click/Tap on "Sign in with Google',
                'Enter your email or phone number associated with your ShortNotice account.',
                'Click/Tap on "Next."',
                'Enter your password.',
                'Click/Tap on "Next."',
                'Click/Tap on "Continue."'
            ],
            outro: 'By following these steps, you will login to your account for ShortNotice.'
        },
        'platform-requirements': {
            intro: 'To access ShortNotice, you will need the following:',
            steps: [
                'A mobile device or personal compter/laptop.',
                'Internet collection.',
                'Either of the modern browsers: Chrome, Opera, Edge, Brave, etc.'
            ],
            outro: 'For the time being, you do not need to download ShortNotice from any application stores.'
        }

    };

    useEffect(() => {
        console.log('gettingStartedPath', helpCenterDataPath);
    }, [helpCenterDataPath])

    return (
        <Container>
            <h4> {
                titleMapping[helpCenterTitlesPath]?.[helpCenterDataPath]
                || 'Title not found'
            }</h4>

            <div>
                <p className='mb-2'>{titlesMap[helpCenterDataPath].intro}</p>
                <ListGroup as='ol' className='help__center-data-list'>
                    {titlesMap[helpCenterDataPath].steps.map((step, idx) => (
                        <ListGroup.Item key={idx} as='li' className='help__center-data-list-item aaa'>
                            <strong>
                                {titlesMap[helpCenterDataPath].steps.indexOf(step) + 1}.
                            </strong>
                            {step}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <p className='mt-2'>{titlesMap[helpCenterDataPath].outro}</p>
            </div>

        </Container>
    )
}

export default HelpCenterData;