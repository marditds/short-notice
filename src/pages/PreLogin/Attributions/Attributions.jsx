import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { attributionsData } from '../../../components/PreLogin/Attributions/attributionsData';

const Attributions = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <ListGroup as={'ul'}>
                        {
                            attributionsData.map((attribute, idx) => {
                                return (
                                    <ListGroup.Item key={idx} as={'li'}>
                                        <h4>{attribute.title}</h4>
                                        <p>{attribute.description}</p>
                                        <a href={attribute.url}>
                                            <i className='bi bi-box-arrow-up-right' />
                                        </a>
                                        <Image src={attribute.icon} width={45} fluid />
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

export default Attributions