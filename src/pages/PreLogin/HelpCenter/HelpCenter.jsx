import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { HelpCenterArrs } from '../../../components/PreLogin/HelpCenter/HelpCenterArrs.jsx';
import sn_small from '../../../assets/sn_long.png';

const HelpCenter = () => {

    const { isSmallScreen } = screenUtils();

    const { helpCenterHeaders } = HelpCenterArrs();

    return (
        <Container>
            <div className='help-center__welcome-msg mt-4 mt-sm-5 mt-lg-0 mb-3 mb-sm-4 mb-md-5'>
                <h2 className='help-center__h2 mb-0'>
                    Hello,
                </h2>

                <h3 className='help-center__h3 text-break'>
                    You have arrived at
                    <Image src={sn_small} width={!isSmallScreen ? 218 : 137} className='ms-1 ms-sm-2 help-center__img' fluid />
                    's help center.
                </h3>

                <h3 className='help-center__h3'>
                    {' '}Here, you will find the answers to your questions.
                </h3>
            </div>

            <Row xs={1} sm={3} className='h-100'>
                {
                    helpCenterHeaders.map((header, idx) => {
                        return (
                            <Col key={idx} className='help-center__header-col d-flex flex-column'>
                                <Link to={`../help-center/${header.path}`} className='help-center__header-a help-center__header-inner-div d-flex flex-column flex-grow-1 justify-content-evenly px-3 py-3 text-center'>
                                    <h4 className='help-center__header-title mb-3'>
                                        {header.title}
                                    </h4>
                                    <p className='mb-0'>{header.description}</p>
                                </Link>
                            </Col>
                        );
                    })
                }
            </Row>

        </Container>
    )
}

export default HelpCenter