import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import PrivacyList from '../../../components/Legal/PrivacyList';

const PrivacyPolicy = () => {

    // const { privacyPolicyData } = PrivacyData();

    return (
        <Container className='privacyPolicy__container'>
            <Row className='privacyPolicy__row my-3 my-sm-5'>
                <Col className='privacyPolicy__col'>
                    <PrivacyList />
                </Col>
            </Row>
        </Container>
    )
}

export default PrivacyPolicy;