import React from 'react';
import TOSList from '../../../components/Legal/TOSList';
import PrivacyList from '../../../components/Legal/PrivacyList';
import { Container, Stack } from 'react-bootstrap';
import '../../../components/Legal/Legal.css'

const UserLegal = () => {
    return (
        <Container fluid className='legal'>
            <Stack className='legal__sections'>
                <TOSList />
                <hr className='legal__hr' />
                <PrivacyList />
                <hr className='legal__hr' />
            </Stack>
        </Container>
    )
}

export default UserLegal;