import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { tos } from './tos.js';

const TOS = () => {
    return (
        <Container className={'tos__contianer'}>
            <Row className={'tos__row'}>
                <Col className={'tos__col'}>
                    <ListGroup as={'ol'} className={'my-3 my-md-5 tos__list-group'}>
                        {
                            tos.map((term, idx) => {
                                return (
                                    <ListGroup.Item key={idx} as={'li'} className={'tos__list-group-item'}>
                                        <h5 className='mb-1'>{idx + 1}. {term.title}</h5>
                                        <p>{term.description}</p>
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default TOS