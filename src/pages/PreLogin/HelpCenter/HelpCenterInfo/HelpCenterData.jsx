import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, ListGroup, ListGroupItem } from 'react-bootstrap';

const HelpCenterData = () => {

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    const titleMapping = {
        'getting-started': {
            'how-to': 'How to create a ShortNotice account',
            'account-verification': 'Account verification',
            'login-information': 'Log in to your account',
            'logout-information': 'Logout of your account',
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
            intro: 'To create a ShortNotice account, follow these simple steps:',
            steps: [
                'Click or tap "Sign in with Google."',
                'Enter the email or phone number associated with your Google account.',
                'Click or tap "Next."',
                'Enter your password.',
                'Click or tap "Next."',
                'Click or tap "Continue."',
                'Select your account type.',
                'Enter your username.',
                'If your account type is "Organization," enter your passcode.',
                'Click or tap "Done."'
            ],
            outro: 'By following these steps, you will successfully create your ShortNotice account.'
        },
        'account-verification': {
            intro: 'For now, ShortNotice does not require users to verify their accounts.',
            steps: [
                'Users do not need to take any steps to verify their accounts.'
            ],
            outro: 'If there are any changes, users will be notified promptly.'
        },
        'login-information': {
            intro: 'To login to your account, follow these steps:',
            steps: [
                'Click or tap "Sign in with Google."',
                'Enter the email or phone number associated with your ShortNotice account.',
                'Click or tap "Next."',
                'Enter your password.',
                'Click or tap "Next."',
                'Click or tap"Continue."'
            ],
            outro: 'By following these steps, you will log in to your ShortNotice account.'
        },
        'logout-information': {
            intro: 'To logout of your account, follow these steps:',
            steps: [
                <span>Click or tap the three dots <i className="bi bi-three-dots-vertical"></i> located in the top-right corner of the screen.</span>,
                'Select "Log out."'
            ],
            outro: 'By following these steps, you will log out of your ShortNotice account.'
        },
        'platform-requirements': {
            intro: 'To access ShortNotice, you will need the following:',
            steps: [
                'A mobile device or personal compter/laptop.',
                'An internet collection.',
                'Either of the modern browsers: Chrome, Opera, Edge, Brave, etc.'
            ],
            outro: 'For now, you do not need to download ShortNotice from any application stores.'
        },
        'email-change': {
            intro: 'Currently, you cannot change the email associated with your ShortNotice account.',
            steps: [
                'To update your email, you will need to create a new account using a different email address.'
            ],
            outro: 'If this policy changes, users will be notified promptly.'
        },
        'username-change': {
            intro: 'To change your username, follow these steps:',
            steps: [
                <span>
                    Click or tap the three dots <i className="bi bi-three-dots-vertical"></i> located in the top-right corner of the screen.
                </span>,
                'Select "Settings."',
                'Click or tap the "Username" field in the "Update Username" section.',
                'Enter your new username',
                'Click or tap "Update."'
            ],
            outro: 'By following these steps, you can successfully change your username.'
        },
        'avatar-change': {
            intro: 'To change your avatar, follow these steps:',
            steps: [
                <span>Click or tap the three dots <i className="bi bi-three-dots-vertical"></i> located in the top - right corner of the screen.</span >,
                'Select "Settings."',
                'Click or tap the "Upload Avatar" field in the "Update Avatar" section.',
                'Select your avatar.',
                'The avatar will update automatically.',
                <span className='fst-italic'>To <strong>delete</strong> your avatar, Click or tap on "Delete Avatar" in the "Upload Avatar" section.</span>
            ],
            outro: 'By following these steps, you can successfully change your avatar.'
        },
        'account-visibility': {
            intro: 'Currently, you cannot change the visibility of your personal account.',
            steps: [
                'Accounts for organizations and teams require passcodes. Their notices are not visible to the general public.'
            ],
            outro: 'If there are any changes, users will be notified promptly.'
        },
        'deleting-account': {
            intro: 'To delete your ShortNotice account, follow these steps:',
            steps: [
                <span>Click or tap the three dots <i className="bi bi-three-dots-vertical"></i> located in the top-right corner of the screen.</span>,
                'Select "Settings."',
                'Click or tap "Delete Account" in the "Delete Account" section.',
                'Click or tap "Yes, Delete My Account."',
            ],
            outro: <span>By following these steps, you will be able to delete your ShortNotice account. <strong>This is an irreversible action and cannot be undone.</strong></span>
        },
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
                            {'  '}{step}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <p className='mt-2'>{titlesMap[helpCenterDataPath].outro}</p>
            </div>

        </Container>
    )
}

export default HelpCenterData;