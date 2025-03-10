import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { reportCategories, commGuideParags } from '../../../components/Support/communityGuidelines';
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