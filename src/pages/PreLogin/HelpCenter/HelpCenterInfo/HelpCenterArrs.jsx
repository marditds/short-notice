import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const HelpCenterArrs = () => {

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    const helpCenterHeaders = [
        {
            title: 'Getting Started',
            description: 'How to get started in ShortNotice.',
            path: 'getting-started'
        },
        {
            title: 'Manage Account',
            description: 'How to manage your ShortNotice account.',
            path: 'manage-account'
        },
        {
            title: 'Navigation Guide',
            description: 'How to navigate within the ShortNotice environment.',
            path: 'navigation-guide'
        }
    ];

    const sectionTitleByPath = {
        'getting-started': 'Getting Started',
        'manage-account': 'Manage Account',
        'navigation-guide': 'Navigation Guide',
    };

    const sectionTopicsByPath = {
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
            { header: 'Set/update interests', path: 'set-update-interests' },
            { header: 'Account visibility', path: 'account-visibility' },
            { header: 'Deleting account', path: 'deleting-account' }
        ],
        'navigation-guide': [
            { header: 'Create notice', path: 'create-notice' },
            { header: 'Edit notice', path: 'edit-notice' },
            { header: 'Delete notice', path: 'delete-notice' },
            { header: 'Post reaction to others\' notices', path: 'post-reaction-to-notices' },
            { header: 'Interact with others\' notices', path: 'interact-with-notices' },
            { header: 'Report others\' notices', path: 'report-others-notices' },
            { header: 'View saved and liked notices', path: 'view-saved-liked' },
            { header: 'Follow other users', path: 'follow-other-users' },
        ],
    };

    const topicTitleByPath = {
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
            'set-update-interests': 'Set/update interests',
            'account-visibility': 'Account visibility',
            'deleting-account': 'Deleting account'
        },
        'navigation-guide': {
            'create-notice': 'Create notice',
            'edit-notice': 'Edit notice',
            'delete-notice': 'Delete notice',
            'post-reaction-to-notices': 'Post reaction to others\' notices',
            'interact-with-notices': 'Interact with others\' notices',
            'report-others-notices': 'Report others\' notices',
            'view-saved-liked': 'View saved and liked notices',
            'follow-other-users': 'Follow other users'
        }
    };

    const topicDetailsByPath = {
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
        'set-update-interests': {
            intro: 'To set or update your interests, follow these steps:',
            steps: [
                <span>Click or tap the three dots <i className='bi bi-three-dots-vertical' /> located in the top-right corner of the screen.</span >,
                'Select "Settings."',
                'Click or tap the categories listed in the "Update Interests" section.',
                'Click or tap "Update Interests."'
            ],
            outro: 'By following these steps, you can set or update your interests. Without setting your interests, your general feed will only include your notices.'
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
                <span>Click or tap the three dots <i className='bi bi-three-dots-vertical'></i> located in the top-right corner of the screen.</span>,
                'Select "Settings."',
                'Click or tap "Delete Account" in the "Delete Account" section.',
                'Click or tap "Yes, Delete My Account."',
            ],
            outro: <span>By following these steps, you will be able to delete your ShortNotice account. <strong>This is an irreversible action and cannot be undone.</strong></span>
        },
        'create-notice': {
            intro: 'To create a notice, follow these steps:',
            steps: [
                <span>Click or tap the three dots <i className='bi bi-three-dots-vertical' /> located in the top-right corner of the screen.</span>,
                'Select "Profile."',
                'Click or tap the text field below the avatar.',
                'Enter your text.',
                <span>Click or tap the <i className='bi bi-filetype-gif' /> icon to add a GIF (optional).</span>,
                <span>Click or tap one of the accordion buttons to add tags.{' '}<small>At leat one tag is require per notice.</small></span>,
                'Click or tap the dropdown menu and select the duration for which you want your notice to remain live.',
                'Click or tap "Notify."',
            ],
            outro: <span>By following these steps, you will successfully create a notice that will appear in the personal feeds of your followers. Your notice will also be visible in the general feed of users who share interests matching your notice's tags. To learn more about setting your interests, <Link to='/help-center/manage-account/set-update-interests' className='help-center__data-link text-decoration-none'>click here</Link>.</span>
        },
        'edit-notice': {
            intro: 'To edit a notice, follow these steps:',
            steps: [
                <span>Click or tap the three dots <i className='bi bi-three-dots-vertical' /> located in the top-right corner of the screen.</span>,
                'Select "Profile."',
                'Find the notice text you wish to edit.',
                <span>Click or tap the pencil <i className='bi bi-pencil' /> icon.</span>,
                'Modify the text in the opened modal.',
                'Click or tap "Save."'
            ],
            outro: 'By following these steps, you will successfully edit the text of your notice.'
        },
        'delete-notice': {
            intro: 'To delete notice, follow these steps:',
            steps: [
                <span>Click or tap the three dots <i className='bi bi-three-dots-vertical' /> located in the top-right corner of the screen.</span>,
                'Select "Profile."',
                'Find the notice you wish to delete.',
                <span>Click or tap the trash can <i className='bi bi-trash3' /> icon.</span>,
            ],
            outro: 'By following these steps, you will successfully delete your notice.'
        },
        'post-reaction-to-notices': {
            intro: 'To post a reaction to others\' notices, follow these steps:',
            steps: [
                'Click or tap the notice to which you wish to post a reaction.',
                'Enter your text in the text filed located below the notice.',
                <span>Click or tap the <i className='bi bi-filetype-gif' /> icon to add a GIF (optional).</span>,
                'Click or tap "React."',
            ],
            outro: 'By following these steps, you will successfully post your reaction to the notice(s) shared by others.'
        },
        'interact-with-notices': {
            intro: 'To interact with the notice(s) shared by others, follow these steps:',
            steps: [
                'Find the notice you wish to interact with.',
                <span>Click or tap the thumbs up <i className='bi bi-hand-thumbs-up' /> icon to like the notice.</span>,
                <span>Click or tap the floppy disk <i className='bi bi-floppy' /> to save the notice.</span>
            ],
            outro: 'By following these steps, you will successfully interact with the notice(s) shared by others.'
        },
        'report-others-notices': {
            intro: 'To report the notice(s) shared by others, follow these steps:',
            steps: [
                'Find the notice you wish to report.',
                <span>Click or tap the exclamation icon <i className='bi bi-exclamation-circle' />.</span>,
                'Select the reason you believe the notice should be reported.',
                'Click or tap "Report."'
            ],
            outro: 'By following these steps, you will successfully report the notice(s) shared by others.'
        },
        'view-saved-liked': {
            intro: 'To view your saved and liked notices, follow these steps:',
            steps: [
                <span>Click or tap the three dots <i className='bi bi-three-dots-vertical' /> located in the top-right corner of the screen.</span>,
                'Select "Profile."',
                'Click or tap "Saves" to view your saved notices located at the bottom-center of the page.',
                'Click or tap "Likes" to view your liked notices located at the bottom-right of page.'
            ],
            outro: 'By following these steps, you will be able to view your saved and liked notices.'
        },
        'follow-other-users': {
            intro: 'To follow other users, follow these steps:',
            steps: [
                'Click or tap the avatar of the user you wish to follow.',
                'Click or tap "Follow" located on the right side of the user\'s avatar.'
            ],
            outro: 'By following these steps, you will follow other users, and their notices will appear in your "Personal Feed."'
        }
    };

    const keys = Object.keys(topicTitleByPath[helpCenterTitlesPath] || {});

    const values = Object.values(topicTitleByPath[helpCenterTitlesPath] || {});

    const topicPaths = keys;

    const topicTitles = values;

    const [nextTitle, setNextTitle] = useState(null);

    const [previousTitle, setPreviousTitle] = useState(null);

    useEffect(() => {

        // console.log('keys', keys);

        // console.log('values', values);

        const currentIndex = keys.indexOf(helpCenterDataPath);

        setPreviousTitle(currentIndex > 0 ? keys[currentIndex - 1] : null)

        setNextTitle(currentIndex < keys.length - 1 ? keys[currentIndex + 1] : null);

    }, [helpCenterDataPath])

    return { helpCenterHeaders, sectionTitleByPath, sectionTopicsByPath, topicTitleByPath, topicDetailsByPath, nextTitle, previousTitle, topicTitles, topicPaths }
}
