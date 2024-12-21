import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../../lib/context/UserContext.jsx';
import { Loading } from '../../../components/Loading/Loading.jsx'
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

const UserSettings = () => {

    const { accountType } = useUserContext();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    })

    if (isLoading) {
        return <div><Loading /></div>;
    }

    return (
        <Container fluid className='settings'>
            <Stack className='settings__sections'>
                <Avatar />
                <hr />
                <Info accountType={accountType} />
                <hr />
                {accountType === 'organization' &&
                    <>
                        <Passcode />
                        <hr />
                    </>
                }
                <Interests />
                <hr />
                <BlockedAccounts />
                <hr />
                <DeleteAllNotices />
                <hr />
                <Visibility />
                <hr />
                <DeleteAccount />
                <hr />
            </Stack>
        </Container>
    )
}

export default UserSettings