import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import CommunityGuidelinesList from '../../../components/Support/CommunityGuidelinesList';
import ContactList from '../../../components/Support/ContactList';

const UserSupport = () => {
    return (
        <Container fluid className='legal'>
            {/* <Stack className='legal__sections'> */}
            <CommunityGuidelinesList />
            <hr className='legal__hr' />
            <ContactList />
            <hr className='legal__hr pb-5' />

            {/* </Stack> */}
        </Container>
    )
}

export default UserSupport;