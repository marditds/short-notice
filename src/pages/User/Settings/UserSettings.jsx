import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../../lib/context/UserContext.jsx';
import { Avatar } from '../../../components/User/Settings/Avatar.jsx';
import { Info } from '../../../components/User/Settings/Info.jsx';
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

const UserSettings = () => {

    const { accountType } = useUserContext();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    })

    useEffect(() => {
        console.log('accountType in UserSetting:', accountType);
    }, [accountType])


    if (isLoading) {
        return <LoadingComponent />
    }

    return (
        <Container fluid className='settings'>
            <Stack className='settings__sections'>
                <Avatar />
                <hr className='settings__hr' />
                <Info />
                <hr className='settings__hr' />
                {accountType === 'organization' &&
                    <>
                        <Passcode />
                        <hr />
                    </>
                }
                <UserWebsite />
                <hr className='settings__hr' />
                <Interests />
                <hr className='settings__hr' />
                <BlockedAccounts />
                <hr className='settings__hr' />
                <DeleteAllNotices />
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