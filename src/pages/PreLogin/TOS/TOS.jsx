import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TOSList from '../../../components/Legal/TOSList';

const TOS = () => {
    return (
        <Container className={'tos__contianer'}>
            <Row className={'tos__row my-3 my-md-5'}>
                <Col className={'tos__col'}>
                    <TOSList />
                </Col>
            </Row>
        </Container>
    )
}

export default TOS;