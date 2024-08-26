import React, { useState, useEffect } from 'react';
import { Loading } from '../../../components/Loading/Loading.jsx'
import { Avatar } from '../../../components/User/Settings/Avatar.jsx';
import { Info } from '../../../components/User/Settings/Info.jsx';
import { Visibility } from '../../../components/User/Settings/Visibility.jsx';
import { Stack, Container } from 'react-bootstrap';

const UserSettings = () => {


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    })


    if (isLoading) {
        return <div><Loading /></div>;
    }

    return (
        <Container fluid>
            <Stack gap={5}>
                <Avatar />

                <Info />

                <Visibility />
            </Stack>
        </Container>
    )
}

export default UserSettings