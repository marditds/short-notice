import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Avatar } from '../../../components/User/Settings/Avatar.jsx';
import { Info } from '../../../components/User/Settings/Info.jsx';
import { UserPassword } from '../../../components/User/Settings/UserPassword.jsx';
import { DeleteAllNotices } from '../../../components/User/Settings/DeleteAllNotices.jsx';
import { Visibility } from '../../../components/User/Settings/Visibility.jsx';
import { Interests } from '../../../components/User/Settings/Interests.jsx';
import { Stack, Container } from 'react-bootstrap';
import { DeleteAccount } from '../../../components/User/Settings/DeleteAccount.jsx';
import '../../../components/User/Settings/Settings.css';
import { Passcode } from '../../../components/User/Settings/Passcode.jsx';
import { BlockedAccounts } from '../../../components/User/Settings/BlockedAccounts.jsx';
import { UserWebsite } from '../../../components/User/Settings/UserWebsite.jsx';
import { LoadingComponent } from '../../../components/Loading/LoadingComponent.jsx';
import Permissions from '../../../components/User/Settings/Permissions.jsx';

const UserSettings = () => {

    const {
        userId,
        username,
        userWebsite,
        accountType,
        userAvatarId,
        setUsername,
        setRegisteredUsername,
        setUserWebsite
    } = useOutletContext();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    })

    if (isLoading) {
        return <LoadingComponent />
    }

    return (
        <Container fluid className='settings'>
            <Stack className='settings__sections'>
                <Avatar
                    userId={userId}
                    userAvatarId={userAvatarId}
                />
                <hr className='settings__hr' />
                <Info
                    username={username}
                    accountType={accountType}
                    setUsername={setUsername}
                    setRegisteredUsername={setRegisteredUsername}
                />
                <hr className='settings__hr' />
                <UserPassword />
                <hr className='settings__hr' />
                {accountType === 'organization' &&
                    <>
                        <Passcode />
                        <hr />
                    </>
                }
                <UserWebsite
                    username={username}
                    userWebsite={userWebsite}
                    setUserWebsite={setUserWebsite}
                />
                <hr className='settings__hr' />
                <Interests
                    userId={userId}
                />
                <hr className='settings__hr' />
                <BlockedAccounts
                    userId={userId}
                    username={username}
                />
                <hr className='settings__hr' />
                <Permissions
                    userId={userId}
                />
                <hr className='settings__hr' />
                <DeleteAllNotices
                    userId={userId}
                />
                <hr className='settings__hr' />
                <Visibility />
                <hr className='settings__hr' />
                <DeleteAccount />
                <hr className='settings__hr' />
            </Stack>
        </Container>
    )
}

export default UserSettings