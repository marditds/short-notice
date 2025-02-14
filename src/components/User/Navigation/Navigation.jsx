import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Image, Button } from 'react-bootstrap';
// import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { UserSearch } from './UserSearch';
import snLogo from '../../../assets/sn_long.png'
import { ComposeNoticeModal } from '../Modals';
import { ComposeNotice } from '../ComposeNotice';
import useNotices from '../../../lib/hooks/useNotices';

export const Navigation = ({
    googleUserData,
    userId,
    removeSession,
    googleLogout,
    setGoogleUserData,
    setIsLoggedIn,
    accountType }) => {

    const location = useLocation();

    const {
        isAddingNotice,
        addNotice,
    } = useNotices(googleUserData);

    //Compose Notice
    const [noticeText, setNoticeText] = useState('');
    const [showComposeNoticeModalFunction, setShowComposeNoticeModalFunction] = useState(false);

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


                    {
                        location.pathname === '/user/profile' ? null :
                            <>
                                {/* Compose Notice Button */}
                                <Button
                                    onClick={() => setShowComposeNoticeModalFunction(true)}
                                    className='user-feed__compose-btn ms-auto'
                                >
                                    <i class='bi bi-plus-square' />
                                </Button>

                                {/* Compose Notice Modal */}
                                <ComposeNoticeModal
                                    showComposeNoticeModalFunction={showComposeNoticeModalFunction}
                                    handleCloseComposeNoticeModalFunction={() => setShowComposeNoticeModalFunction(false)}
                                >
                                    <ComposeNotice
                                        isAddingNotice={isAddingNotice}
                                        noticeText={noticeText}
                                        noticeType={accountType}
                                        setNoticeText={setNoticeText}
                                        addNotice={addNotice}
                                    />
                                </ComposeNoticeModal>
                            </>
                    }


                    <NavDropdown
                        drop='down'
                        id="dropdown-basic-button"
                        className={`${location.pathname === '/user/profile' ? 'ms-auto' : 'ms-2'} userhome__body--profile--tools--dropdown`}
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
