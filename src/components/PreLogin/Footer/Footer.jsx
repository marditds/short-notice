import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { footerData } from './FooterData.jsx';
import { screenUtils } from '../../../lib/utils/screenUtils.js';
import snLogo from '../../../assets/sn_long.png';
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


console.log(footerData[2]);


const Footer = () => {

    const { isSmallScreen } = screenUtils();

    return (
        <Container fluid className='footer__container'>
            <Container>
                <Row xs={1} sm={3} lg={6} className='flex-columns'>

                    {/* LOGO */}
                    <Col className='d-flex flex-column'>
                        <Image src={snLogo} alt='shortnotice_logo' height='26px' width={!isSmallScreen ? 'auto' : '149.5px'} className='mb-2' fluid />
                        {footerData.copyright}
                    </Col>

                    {/* COMPANY */}
                    <Col className=''>
                        <h4>Company</h4>
                        {
                            footerData.company.map((companyData, idx) => {
                                return (
                                    <Link key={idx} to={companyData.url}>

                                        <h6>{companyData.name}</h6>
                                    </Link>

                                )
                            })
                        }
                    </Col>

                    {/* SUPPORT */}
                    <Col className=''>
                        <h4>Support</h4>
                        {
                            footerData.support.map((supportData, idx) => {
                                return (
                                    <Link key={idx} to={supportData.url}>
                                        <h6>{supportData.name}</h6>
                                    </Link>
                                )
                            })
                        }
                    </Col>

                    {/* EXPLORE */}
                    <Col className=''>
                        <h4>Explore</h4>
                        {
                            footerData.explore.map((exploreData, idx) => {
                                return (
                                    <Link key={idx} to={exploreData.url}>
                                        <h6>{exploreData.name}</h6>
                                    </Link>
                                )
                            })
                        }
                    </Col>

                    {/* Socials */}
                    <Col className=''>
                        <h4>Socials</h4>
                        {
                            footerData.followUs.map((followUsData, idx) => {
                                return (
                                    <Link key={idx} to={followUsData.url}>
                                        <h6>{followUsData.name}</h6>
                                    </Link>
                                )
                            })
                        }
                    </Col>

                    {/* LEGAL */}
                    <Col className=''>
                        <h4>Legal</h4>
                        {
                            footerData.legal.map((legalData, idx) => {
                                return (
                                    <Link key={idx} to={legalData.url}>
                                        <h6>{legalData.name}</h6>
                                    </Link>
                                )
                            })
                        }
                    </Col>
                </Row>

                {/* COPYRIGHT */}
                <Row md={12} className='flex-column justify-content-center pt-2 pb-4'>
                    {/* <Col className='footer__col d-flex justify-content-center'>
                        {footerData.copyright}
                    </Col> */}
                    <Col className='footer__col d-flex justify-content-center'>
                        {footerData.developer}
                    </Col>
                </Row>

            </Container>
        </Container>
    )
}

export default Footer