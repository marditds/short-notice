import { screenUtils } from '../../../lib/utils/screenUtils';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { AttributionsData } from '../../../components/PreLogin/Attributions/AttributionsData';

const Attributions = () => {

    let { attributesData } = AttributionsData();

    let { isExtraSmallScreen, isSmallScreen } = screenUtils();

    return (
        <Container as='section' aria-labelledby='attributions-heading' className='d-grid gap-5'>
            <Row className='mt-5'>
                <Col xs={12}>
                    <h3 id='attributions-heading' className='mb-3'>Attributions</h3>
                </Col>

                {attributesData.map((attribute, idx) => (
                    <Col xs={12} sm={6} key={idx} className='mb-2'>
                        <div className='mb-2 d-flex align-items-center'>
                            <Image
                                src={attribute.icon}
                                alt={attribute.title + ' icon'}
                                style={{
                                    maxHeight:
                                        !isExtraSmallScreen && !isSmallScreen ? '38px' : '21.875px',
                                }}
                                fluid
                            />
                        </div>

                        <div>
                            <p className='attributions__attribute-p'>
                                {attribute.description}
                                <a
                                    href={attribute.url}
                                    className='ms-2 attributions__attribute-link'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    aria-label={`Visit source for ${attribute.title}`}
                                >
                                    <i className='bi bi-box-arrow-up-right' aria-hidden='true' />
                                </a>
                            </p>
                        </div>
                    </Col>
                ))}
            </Row>

            <Row className='my-2'>
                <Col>
                    <p>
                        <strong>Disclaimer</strong>: ShortNotice is neither sponsored by nor affiliated with any of the services mentioned on this page.
                    </p>
                </Col>
            </Row>
        </Container>

    )
}

export default Attributions