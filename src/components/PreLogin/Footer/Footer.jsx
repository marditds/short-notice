import { Link } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { footerData } from './footerData.js';
import { screenUtils } from '../../../lib/utils/screenUtils.js';
import snLogo from '../../../assets/sn_long.png';
import './Footer.css';

const Footer = () => {

    const { isMediumScreen } = screenUtils();

    const copyrightText = footerData.copyright.split('newLine');

    const copyrightTextBreak = isMediumScreen && footerData.copyright.replace('newLine', '');

    return (
        <footer role='contentinfo' aria-label='Site footer'>
            <Container fluid className='footer__container'>
                <Container>
                    <Row xs={1} lg={3} xl={6} className='mt-5'>

                        {/* LOGO */}
                        <Col className='d-flex flex-column footer__col mb-3 mb-lg-0'>
                            <Link to='/' aria-label='Homepage'>
                                <Image
                                    src={snLogo}
                                    alt='ShortNotice logo'
                                    height='26px'
                                    className='mb-2 footer__logo'
                                    fluid
                                />
                            </Link>
                            {
                                !isMediumScreen ? (
                                    <div>
                                        {copyrightText.map((text, idx) => (
                                            <p key={idx} className='mb-0'>{text}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {copyrightTextBreak}
                                    </>
                                )
                            }
                        </Col>

                        {/* COMPANY */}
                        <nav aria-label='Company links' className='footer__col'>
                            <h4>Company</h4>
                            <ul className='footer__list ps-0'>
                                {footerData.company.map((item, idx) => (
                                    <li key={idx} className='list-unstyled ps-0 mb-1'>
                                        <Link to={item.url} className='footer__link'>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* EXPLORE */}
                        <nav aria-label='Explore links' className='footer__col'>
                            <h4>Explore</h4>
                            <ul className='footer__list ps-0'>
                                {footerData.explore.map((item, idx) => (
                                    <li key={idx} className='list-unstyled ps-0 mb-1'>
                                        <Link to={item.url} className='footer__link'>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* LEGAL */}
                        <nav aria-label='Legal links' className='footer__col'>
                            <h4>Legal</h4>
                            <ul className='footer__list ps-0'>
                                {footerData.legal.map((item, idx) => (
                                    <li key={idx} className='list-unstyled ps-0 mb-1'>
                                        <Link to={item.url} className='footer__link'>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* SUPPORT */}
                        <nav aria-label='Support links' className='footer__col'>
                            <h4>Support</h4>
                            <ul className='footer__list ps-0'>
                                {footerData.support.map((item, idx) => (
                                    <li key={idx} className='list-unstyled ps-0 mb-1'>
                                        <Link to={item.url} className='footer__link'>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* SOCIALS */}
                        <nav aria-label='Social media links' className='footer__col'>
                            <h4>Socials</h4>
                            <ul className='footer__list ps-0'>
                                {footerData.followUs.map((item, idx) => (
                                    <li key={idx} className='list-unstyled ps-0 mb-1'>
                                        <a
                                            href={item.url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='footer__link'
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                    </Row>

                    {/* COPYRIGHT */}
                    <Row md={12} className='flex-column justify-content-center mt-3 mb-4'>
                        <Col className='footer__col d-flex justify-content-center'>
                            <a
                                href={footerData.developer[0].link}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='footer__link text-decoration-none'
                            >
                                {footerData.developer[0].text}
                            </a>
                        </Col>
                    </Row>

                </Container>
            </Container>
        </footer>
    )
}

export default Footer