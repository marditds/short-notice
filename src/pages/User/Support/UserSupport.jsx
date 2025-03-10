import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import CommunityGuidelinesList from '../../../components/Support/CommunityGuidelinesList';

const UserSupport = () => {
    return (
        <Container fluid className='legal'>
            {/* <Stack className='legal__sections'> */}
            <CommunityGuidelinesList />
            <hr className='legal__hr' />

            <hr className='legal__hr' />
            {/* </Stack> */}
        </Container>
    )
}

export default UserSupport