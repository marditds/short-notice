import React from 'react';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { AttributionsData } from '../../../components/PreLogin/Attributions/AttributionsData';

const Attributions = () => {

    let { attributesData } = AttributionsData();

    let { isSmallScreen } = screenUtils();

    return (
        <Container>
            <Row className='my-5'>
                {
                    attributesData.map((attribute, idx) => {
                        return (
                            <Col xs={12} sm={6} key={idx} className='mb-2 mb-sm-2'>
                                <div className='mb-2 d-flex align-items-center'>
                                    {/* <h4 className='mb-0 me-2'>{attribute.title}</h4> */}

                                    <Image src={attribute.icon}
                                        style={{ maxHeight: !isSmallScreen ? '38px' : '21.875px' }}
                                        fluid />

                                </div>

                                <div>
                                    <p className='attributions__attribute-p'>
                                        {attribute.description}
                                        <a href={attribute.url} className='ms-2 attributions__attribute-link'>
                                            <i className='bi bi-box-arrow-up-right' />
                                        </a>
                                    </p>
                                </div>

                            </Col>
                        )
                    })
                }

            </Row>
        </Container >
    )
}

export default Attributions