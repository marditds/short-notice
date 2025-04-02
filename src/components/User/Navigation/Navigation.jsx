import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Image, Button } from 'react-bootstrap';
// import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { UserSearch } from './UserSearch';
import { screenUtils } from '../../../lib/utils/screenUtils';
import snLogo from '../../../assets/sn_long.png'
import { ComposeNoticeModal } from '../Modals';
import { ComposeNotice } from '../ComposeNotice';
import useNotices from '../../../lib/hooks/useNotices';
// import { InterestsTags } from '../Settings/InterestsTags';
// import { Loading } from '../../Loading/Loading';

export const Navigation = ({
    userId,
    removeSession,
    // googleLogout,
    accountType,
    setIsLoggedIn,
    setUserId,
    setUserEmail,
    setUsername,
    setRegisteredUsername,
    setHasUsername,
    setAccountType,
    setHasAccountType,
    setIsAppLoading }) => {

    const location = useLocation();

    const {
        isAddingNotice,
        isGeminiLoading,
        addNotice,
        onGeminiRunClick,
        // selectedTags,
        // isInterestsLoading,
        // tagCategories,
        // isInterestsUpdating,
        // isAnyTagSelected,
        // toggleInterestsTag, 
        // updateInterests,
        // deselectAllInterestTags,
        // fetchUserInterests
    } = useNotices(userId);

    const { isLargeScreen, isMediumScreen, isSmallScreen, isExtraSmallScreen } = screenUtils();

    //Compose Notice
    const [noticeText, setNoticeText] = useState('');
    const [showComposeNoticeModalFunction, setShowComposeNoticeModalFunction] = useState(false);

    const dropdownItems = [
        {
            title: 'Feed',
            icon: 'bi bi-rss',
            onClick: () => console.log('Feed clicked'),
            url: '/user/feed'
        },
        {
            title: 'Profile',
            icon: 'bi bi-person-square',
            onClick: () => console.log('Profile clicked'),
            url: '/user/profile'
        },
        {
            title: 'Settings',
            icon: 'bi bi-gear',
            onClick: () => console.log('Settings clicked'),
            url: '/user/settings'
        },
        {
            title: 'Help Center',
            icon: 'bi bi-question-square',
            onClick: () => console.log('Support clicked'),
            url: '/user/help-center'
        },
        {
            title: 'Legal',
            icon: 'bi bi-shield-shaded',
            onClick: () => console.log('Legal clicked'),
            url: '/user/legal'
        },
        {
            title: 'Log out',
            icon: 'bi bi-box-arrow-left',
            onClick: async () => {
                try {
                    setIsAppLoading(true);
                    await removeSession();
                    setIsLoggedIn(false);
                    setUserId(null);
                    setUserEmail(null);
                    setUsername('');
                    setHasUsername(false);
                    setAccountType('');
                    console.log('Logged out successfully.');
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

    return (
        <>
            <Nav className='userhome__body--profile--tools w-100 d-flex fixed-top'>
                <Container fluid className='d-flex'>
                    <Navbar.Brand href='./feed' className='mt-auto mb-auto ms-2 me-2'>
                        <Image src={snLogo} alt='short_notice_logo' className='navigation__logo' fluid />
                    </Navbar.Brand>

                    <UserSearch userId={userId} />

                    {
                        location.pathname !== '/user/feed' ? null :
                            <>
                                {/* Update Interests Button */}
                                {/* <Button
                                    onClick={onShowInterestsTagsClick}
                                    className='navigation__compose-btn d-xl-none d-block my-auto ms-sm-auto ms-2'
                                >
                                    <i className='bi bi-tag d-flex justify-content-center align-items-center' />
                                </Button> */}

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

                                {/* Interests Tags Modal */}
                                {/* <InterestsModal
                                    showTagsModalFunction={showTagsModalFunction}
                                    handleCloseTagsModalFunction={() => setShowTagsModalFunction(false)}
                                >
                                    {!isInterestsLoading
                                        ?
                                        <InterestsTags
                                            tagCategories={tagCategories}
                                            selectedTags={selectedTags}
                                            isInterestsUpdating={isInterestsUpdating}
                                            isAnyTagSelected={isAnyTagSelected}
                                            toggleInterestsTag={toggleInterestsTag}
                                            updateInterests={updateInterests}
                                            deselectAllInterestTags={deselectAllInterestTags}
                                        />
                                        :
                                        <div className='d-flex justify-content-center my-2'>
                                            <Loading />
                                        </div>
                                    }
                                </InterestsModal> */}
                            </>
                    }
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
                                        onClick={dropdownItem.onClick} className='userhome__body--btn w-100'
                                    >
                                        <div className='position-relative'>
                                            <i className={`${dropdownItem.icon} mx-2`} />
                                            <span>{dropdownItem.title}</span>
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
