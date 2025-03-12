import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CommunityGuidelinesList from '../../../components/Support/CommunityGuidelinesList';

const CommunityGuidelines = () => {
    return (
        <Container>
            <Row className='flex-column my-3 my-sm-5'>
                <Col>
                    <CommunityGuidelinesList />
                </Col>
            </Row>
        </Container>
    )
}

export default CommunityGuidelines;