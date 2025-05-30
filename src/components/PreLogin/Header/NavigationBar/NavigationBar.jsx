import { Link } from 'react-router-dom';
import { screenUtils } from '../../../../lib/utils/screenUtils';
import { Nav, Navbar, Image, Button } from 'react-bootstrap';
import snLogo from '../../../../assets/sn_long.png';
import './NavigationBar.css';

const NavigationBar = () => {

    const { isExtraSmallScreen, isSmallScreen } = screenUtils();

    return (
        <Navbar expand='md' className='px-sm-4 navigationbar' sticky='top' aria-label='Main navigation'>
            <Navbar.Brand href="/" className='py-2'>
                <Image src={snLogo} alt='ShortNotice logo' height={!isExtraSmallScreen && !isSmallScreen ? '23px' : '20px'} className='navigation__logo' />
            </Navbar.Brand>
            <Navbar.Toggle className='navigation__toggle-btn' aria-controls='basic-navbar-nav' aria-label='Toggle navigation menu'>
                <i className='bi bi-three-dots-vertical navigation__burger-menu' />
            </Navbar.Toggle>
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='ms-auto me-lg-auto w-100' role='navigation' aria-label='Main menu'>
                    <div className='d-flex flex-column flex-md-row ms-md-auto'>
                        <Nav.Link as={Link} to='/' className='pb-0 pb-md-auto ms-0 navigation__nav-link' aria-current='page'>Home</Nav.Link>
                        <Nav.Link as={Link} to='/sn-plus' className='pb-0 pb-md-auto ms-md-2 ms-lg-4 d-inline d-md-none d-lg-inline navigation__nav-link'>SN Plus</Nav.Link>
                        <Nav.Link as={Link} to='/about' className='pb-0 pb-md-auto ms-md-2 ms-lg-4 navigation__nav-link'>About</Nav.Link>
                        <Nav.Link as={Link} to='/contact' className='pb-0 pb-md-auto ms-md-2 ms-lg-4 navigation__nav-link'>Contact</Nav.Link>
                    </div>
                    <Nav.Item className='mt-2 my-md-auto ms-md-auto'>
                        <Button as={Link} className='signin__btn--nav' to='signin'>Sign In</Button>
                    </Nav.Item>
                    <Nav.Item className='my-2 my-md-auto ms-md-2 ms-lg-4'>
                        <Button as={Link} className='signup__btn--nav' to='signup'>Sign Up</Button>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar