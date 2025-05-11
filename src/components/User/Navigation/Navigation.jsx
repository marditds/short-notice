import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Image, Button } from 'react-bootstrap';
import { UserSearch } from './UserSearch';
import { screenUtils } from '../../../lib/utils/screenUtils';
import snLogo from '../../../assets/sn_long.png'
import { ComposeNoticeModal } from '../Modals';
import { ComposeNotice } from '../ComposeNotice';
import { useNotices } from '../../../lib/hooks/useNotices';

export const Navigation = ({
    username,
    removeSession,
    accountType,
    setIsLoggedIn,
    setUser,
    setUserId,
    setUserEmail,
    setUsername,
    setGivenName,
    setHasUsername,
    setAccountType,
    setIsAppLoading }) => {

    const location = useLocation();

    const {
        isAddingNotice,
        isGeminiLoading,
        addNotice,
        onGeminiRunClick
    } = useNotices();

    const { isLargeScreen, isExtraSmallScreen } = screenUtils();

    //Compose Notice
    const [noticeText, setNoticeText] = useState('');
    const [showComposeNoticeModalFunction, setShowComposeNoticeModalFunction] = useState(false);

    const dropdownItems = [
        {
            title: 'Feed',
            icon: 'bi bi-rss',
            onClick: () => console.log('Feed clicked'),
            url: '/user/feed',
            disabled: location.pathname === '/user/feed' ? true : false
        },
        {
            title: 'Profile',
            icon: 'bi bi-person-square',
            onClick: () => console.log('Profile clicked'),
            url: '/user/profile',
            disabled: location.pathname === '/user/profile' ? true : false
        },
        {
            title: 'Settings',
            icon: 'bi bi-gear',
            onClick: () => console.log('Settings clicked'),
            url: '/user/settings',
            disabled: location.pathname === '/user/settings' ? true : false
        },
        {
            title: 'Help Center',
            icon: 'bi bi-question-square',
            onClick: () => console.log('Support clicked'),
            url: '/user/help-center',
            disabled: location.pathname === '/user/help-center' ? true : false
        },
        {
            title: 'Legal',
            icon: 'bi bi-shield-shaded',
            onClick: () => console.log('Legal clicked'),
            url: '/user/legal',
            disabled: location.pathname === '/user/legal' ? true : false
        },
        {
            title: 'Sign out',
            icon: 'bi bi-box-arrow-left',
            onClick: async () => {
                try {
                    setIsAppLoading(true);
                    await removeSession();
                    localStorage.removeItem('authToken');
                    setIsLoggedIn(false);
                    setUserId(null);
                    setUserEmail(null);
                    setUsername('');
                    setHasUsername(false);
                    setGivenName('');
                    setAccountType('');
                    setUser(null);
                    console.log('Signed out successfully.');
                    window.location.href = '/';
                } catch (error) {
                    console.error('Error logging out:', error);
                } finally {
                    setIsAppLoading(false);
                }
            },
            url: '/'
        }
    ]

    // const shouldUseAutoMargin = (
    //     (
    //         (location.pathname === '/user/profile' || location.pathname === '/user/settings')
    //         && !isExtraSmallScreen
    //     ) || isExtraLargeScreen || isDoubleExtraLargeScreen
    // );

    return (
        <>
            <Nav className='userhome__body--profile--tools w-100 d-flex fixed-top'>
                <Container fluid className='d-flex'>
                    <Navbar.Brand href='./feed' className='mt-auto mb-auto ms-2 me-2'>
                        <Image src={snLogo} alt='short_notice_logo' className='navigation__logo' fluid />
                    </Navbar.Brand>

                    <UserSearch username={username} />

                    {
                        location.pathname !== '/user/feed' ? null :
                            <>
                                {/* Compose Notice Button */}
                                <Button
                                    onClick={() => setShowComposeNoticeModalFunction(true)}
                                    className='navigation__compose-btn d-xl-none d-block my-auto ms-sm-auto ms-2'
                                >
                                    <i className='bi bi-plus-square d-flex justify-content-center align-items-center' />
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
                                        isGeminiLoading={isGeminiLoading}
                                        onGeminiRunClick={async (templateSubject) => {
                                            console.log('templateSubject - Navigation.jsx', templateSubject);
                                            await onGeminiRunClick(templateSubject, setNoticeText)
                                        }}
                                    />
                                </ComposeNoticeModal>
                            </>
                    }

                    {/* Menu dropdown */}
                    <NavDropdown
                        drop='down'
                        id="dropdown-basic-button"
                        className={`my-auto userhome__body--profile--tools--dropdown 
                           ${(location.pathname === '/user/feed' && !isLargeScreen) ? 'ms-auto' : 'ms-1'} 
                            ${(location.pathname !== '/user/feed' && !isExtraSmallScreen) ? 'ms-auto' : 'ms-1'}
                            `}

                        title={<i className='bi bi-three-dots-vertical navigation__three-dots d-flex justify-content-center align-items-center' />}>
                        {
                            dropdownItems.map((dropdownItem, idx) => {
                                return (
                                    <NavDropdown.Item
                                        key={idx}
                                        as={Link}
                                        to={dropdownItem.url}
                                        disabled={dropdownItem.disabled}
                                        onClick={dropdownItem.onClick} className='userhome__body--btn w-100'
                                    >
                                        <div className='position-relative'
                                            style={{ color: dropdownItem.disabled ? 'var(--main-accent-color-hover)' : '' }}>
                                            <i className={`${dropdownItem.icon} mx-2`} />
                                            <span>
                                                {dropdownItem.title}
                                            </span>
                                        </div>
                                    </NavDropdown.Item>
                                )
                            })
                        }
                    </NavDropdown>
                </Container>
            </Nav>
        </>
    )
}
