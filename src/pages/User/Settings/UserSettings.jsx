import React, { useState, useEffect } from 'react';
import { Loading } from '../../../components/Loading/Loading.jsx'
import { Avatar } from '../../../components/User/Settings/Avatar.jsx';
import { Info } from '../../../components/User/Settings/Info.jsx';
import { DeleteAllNotices } from '../../../components/User/Settings/DeleteAllNotices.jsx';
import { Visibility } from '../../../components/User/Settings/Visibility.jsx';
import { Interests } from '../../../components/User/Settings/Interests.jsx';
import { Stack, Container } from 'react-bootstrap';
import { DeleteAccount } from '../../../components/User/Settings/DeleteAccount.jsx';
import './UserSettings.css';

const UserSettings = () => {


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    })


    if (isLoading) {
        return <div><Loading /></div>;
    }

    return (
        <Container fluid className='settings'>
            <Stack gap={5}>
                <Avatar />

                <Info />

                <Interests />

                <DeleteAllNotices />

                <Visibility />

                <DeleteAccount />
            </Stack>
        </Container>
    )
}

export default UserSettings