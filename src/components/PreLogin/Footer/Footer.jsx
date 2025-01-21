import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { footerData } from './footerData.jsx';
import './Footer.css';


// About | Contact | Privacy Policy | Terms of Service | Help Center  
// Follow Us: [Facebook][Twitter][Instagram]  
// Download our app: [App Store Icon][Google Play Icon]  
// © 2024 SocialMediaApp.All rights reserved.  



// --------------------------------------------------
// | Home | About | Contact | Privacy | Terms | Help |
//     --------------------------------------------------
//         Follow Us: [FB][IG][X][YT]
//         © 2024 SocialApp.All rights reserved.
// --------------------------------------------------


const Footer = () => {
    return (
        <Container fluid className='footer__container'>
            <Container>
                {/* LINKS */}
                <Row md={12} className='pt-4 pb-2 pb-sm-4 pt-md-0 pt-md-4  justify-content-between'>
                    {/* <Col>
                        <img src={snLogo} alt='shortnotice_logo' height='26px' />
                    </Col> */}
                    {footerData.navigationLinks.map((nav, index) => {
                        return (
                            <Col key={index}
                                xs={12} sm={3} xl={1}
                                className='footer__col d-flex justify-content-center'>
                                <Link to={nav.url} className='text-decoration-none'>
                                    <h6 className='my-1 my-sm-2 my-xl-0'>
                                        {nav.name}
                                    </h6>
                                </Link>
                            </Col>
                        )
                    }
                    )
                    }
                </Row>

                {/* SOCIAL */}
                <Row className='justify-content-center pb-2 pt-2 pt-sm-0'>
                    {footerData.socialLinks.map((social, index) => {
                        return (
                            <Col xs={1} key={index}
                                className='footer__col d-flex justify-content-center mx-2 mx-sm-0'>
                                <Link to={social.url}>
                                    {social.icon}
                                </Link>
                            </Col>
                        )
                    })}
                </Row>

                {/* COPYRIGHT */}
                <Row md={12} className='flex-column justify-content-center pt-2 pb-4'>
                    <Col className='footer__col d-flex justify-content-center'>
                        {footerData.copyright}
                    </Col>
                    <Col className='footer__col d-flex justify-content-center'>
                        {footerData.developer}
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default Footer