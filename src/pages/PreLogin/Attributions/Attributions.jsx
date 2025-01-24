import React from 'react';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { AttributionsData } from '../../../components/PreLogin/Attributions/AttributionsData';

const Attributions = () => {

    let { attributesData } = AttributionsData();

    let { isSmallScreen } = screenUtils();

    return (
        <Container className='d-grid gap-5'>
            <Row className='mt-5'>
                <h3 className='mb-3'>Attributions</h3>
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
            <Row className='my-2'>
                <Col>
                    <p>
                        <strong>Disclaimer</strong>: ShortNotice is neither sponsored by nor affiliated with any of the services mentioned on this page.

                    </p>

                </Col>
            </Row>
        </Container >
    )
}

export default Attributions