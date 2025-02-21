import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Image, Button } from 'react-bootstrap';
// import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { UserSearch } from './UserSearch';
import { screenUtils } from '../../../lib/utils/screenUtils';
import snLogo from '../../../assets/sn_long.png'
import { ComposeNoticeModal, InterestsModal } from '../Modals';
import { ComposeNotice } from '../ComposeNotice';
import useNotices from '../../../lib/hooks/useNotices';
import { InterestsTags } from '../Settings/InterestsTags';
import { Loading } from '../../Loading/Loading';

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
        isGeminiLoading,
        isInterestsLoading,
        tagCategories,
        selectedTags,
        isInterestsUpdating,
        isAnyTagSelected,
        toggleInterestsTag,
        addNotice,
        onGeminiRunClick,
        updateInterests,
        deselectAllInterestTags,
        fetchUserInterests
    } = useNotices(googleUserData);

    const { isSmallScreen, isExtraLargeScreen, isLargeScreen } = screenUtils();

    // console.log('NAVIGATION - selectedTags', selectedTags);


    //Compose Notice
    const [noticeText, setNoticeText] = useState('');
    const [showComposeNoticeModalFunction, setShowComposeNoticeModalFunction] = useState(false);
    const [showTagsModalFunction, setShowTagsModalFunction] = useState(false);

    // useEffect(() => {
    //     fetchUserInterests();
    // }, [userId, tagCategories]);

    const onShowInterestsTagsClick = () => {
        setShowTagsModalFunction(true),
            fetchUserInterests()
        console.log('NAVIGATION - selectedTags', selectedTags);

    }

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
                                {/* Update Interests Button */}
                                <Button
                                    onClick={onShowInterestsTagsClick}
                                    className='navigation__compose-btn d-xl-none d-block my-auto 
                                    ms-auto'
                                >
                                    <i className='bi bi-tag d-flex justify-content-center align-items-center' />
                                </Button>

                                {/* Compose Notice Button */}
                                <Button
                                    onClick={() => setShowComposeNoticeModalFunction(true)}
                                    className='navigation__compose-btn d-xl-none d-block my-auto 
                                    ms-2'
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
                                        onGemeniRunClick={async () => await onGeminiRunClick(setNoticeText)}

                                    />
                                </ComposeNoticeModal>

                                {/* Interests Tags Modal */}
                                <InterestsModal
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
                                        <div className='d-flex justify-content-center my-2'><Loading /></div>
                                    }
                                </InterestsModal>

                            </>
                    }


                    <NavDropdown
                        drop='down'
                        id="dropdown-basic-button"
                        className={`my-auto userhome__body--profile--tools--dropdown 
                            ${location.pathname === '/user/profile' ? 'ms-auto' :
                                (!isLargeScreen ? 'ms-auto' : 'ms-2')

                            }
                            `}

                        // className={`my-auto ms-auto
                        //     ${location.pathname === '/user/profile' ? 'ms-auto' : (isSmallScreen ? 'ms-0' : 'ms-2')}
                        //      userhome__body--profile--tools--dropdown`}

                        // className={`my-auto ${location.pathname === '/user/profile' ? 'ms-auto' : 'ms-2'} userhome__body--profile--tools--dropdown`}
                        title={<i className='bi bi-three-dots-vertical navigation__three-dots d-flex justify-content-center align-items-center' />}>
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
