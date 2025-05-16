import { Container } from 'react-bootstrap';
import HelpCenterHomePageContent from '../../../components/HelpCenter/HelpCenterHomePageContent';
import { Outlet, useLocation } from 'react-router-dom';

const HelpCenter = () => {

    const location = useLocation();

    return (
        <Container>
            {location.pathname === '/help-center' && <HelpCenterHomePageContent />}
            <Outlet />
        </Container>
    )
}

export default HelpCenter