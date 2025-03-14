import React from 'react';
import { Container } from 'react-bootstrap';
import HelpCenterTitlesPageContent from '../../../../components/HelpCenter/HelpCenterTitlesPageContent';
import { Outlet, useParams } from 'react-router-dom';

const HelpCenterTitles = () => {

    let { helpCenterTitlesPath } = useParams();

    return (
        <Container>
            {location.pathname === `/help-center/${helpCenterTitlesPath}` && <HelpCenterTitlesPageContent />}
            <Outlet />
        </Container>
    )
}

export default HelpCenterTitles;