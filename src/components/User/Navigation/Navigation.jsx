import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { UserSearch } from './UserSearch';
import snLogo from '../../../assets/sn_long.png'

export const Navigation = ({ googleLogout, removeSession, setIsLoggedIn, setGoogleUserData, userId }) => {


    return (
        <>
            <Nav className='userhome__body--profile--tools 
                w-100 
                d-flex 
                fixed-top
                
                '>
                <Container fluid className='d-flex'>
                    <Navbar.Brand href='./feed' className='mt-auto mb-auto ms-2'>
                        <Image src={snLogo} alt='short_notice_logo' className='navigation__logo' fluid />
                    </Navbar.Brand>


                    <UserSearch userId={userId} />

                    <NavDropdown
                        drop='down'
                        id="dropdown-basic-button"
                        className='ms-auto userhome__body--profile--tools--dropdown'
                        title={<i className='bi bi-three-dots-vertical navigation__three-dots'></i>}>
                        <NavDropdown.Item
                            as={Link}
                            to='/user/feed'
                            className='userhome__body--btn w-100'
                        >
                            Feed
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            as={Link}
                            to='/user/profile'
                            className='userhome__body--btn w-100'
                        >
                            Profile
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            as={Link}
                            to='/user/settings'
                            className='userhome__body--btn w-100'
                        >
                            Settings
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            as={Link}
                            to='/'
                            onClick={
                                async () => {
                                    await removeSession();
                                    googleLogout();
                                    setIsLoggedIn(preVal => false);
                                    setGoogleUserData(null);
                                    localStorage.removeItem('accessToken');
                                    console.log('Logged out successfully.');
                                    window.location.href = '/';
                                }
                            }
                            className='userhome__body--btn w-100'
                        >
                            Log out
                        </NavDropdown.Item>
                    </NavDropdown>
                </Container>
            </Nav>
        </>
    )
}
