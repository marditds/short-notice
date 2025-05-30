import { Container } from 'react-bootstrap';
import CommunityGuidelinesList from '../../../components/Support/CommunityGuidelinesList';

const UserSupport = () => {
    return (
        <Container fluid className='legal'>
            <CommunityGuidelinesList />
            <hr className='legal__hr pb-5' />
        </Container>
    )
}

export default UserSupport;