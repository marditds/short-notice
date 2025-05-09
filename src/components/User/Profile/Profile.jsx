import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Row, Col, Button, Dropdown } from 'react-bootstrap';
import { getAvatarUrl } from '../../../lib/utils/avatarUtils.js';
import defaultAvatar from '../../../assets/default.png';
import { screenUtils } from '../../../lib/utils/screenUtils.js';
import { BlockModal, ReportModal, FollowModal } from '../Modals.jsx';
import { LoadingSpinner } from '../../Loading/LoadingSpinner.jsx';

export const Profile = ({ username, avatarUrl, isAvatarLoading, website, handleFollow, handleBlock, currUserId, followingCount, followersCount, isFollowing, followingAccounts, followersAccounts, isFollowingUserLoading, isGetFollwedByUserCountLoading,
    isGetFollowingTheUserCountLoading, isBlocked, isOtherUserBlocked, handleUserReport, hasMoreFollowing, hasMoreFollowers, loadFollowing, loadFollowers, isLoadingMoreFollowing, isLoadingMoreFollowers, isOtherUserFollowingMe, isProcessingBlock, userWebsite }) => {

    const location = useLocation();

    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);

    const [showReportUserModal, setShowReportUserModal] = useState(false);
    const [reportReason, setReportReason] = useState(null);
    const [showReportUserConfirmation, setShowReportUserConfirmation] = useState(false);
    const [isProcessingReport, setIsProcessingReport] = useState(false);

    const { isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen } = screenUtils();

    const handleShowFollowersModal = () => {
        setShowFollowersModal(true);
    }

    const handleCloseFollowersModal = () => {
        setShowFollowersModal(false);
    }

    const handleShowFollowingModal = () => {
        setShowFollowingModal(true);
    }

    const handleCloseFollowingModal = () => {
        setShowFollowingModal(false);
    }

    const handleShowBlockModal = () => {
        setShowBlockModal(true);
    }

    const handleCloseBlockModal = () => {
        setShowBlockModal(false);
    }

    // Repoting User
    const handleReportUser = () => {
        setShowReportUserModal(true);
        setShowReportUserConfirmation(false);
    }

    const handleReportUserSubmission = async () => {
        if (reportReason) {
            setIsProcessingReport(true);

            try {
                await handleUserReport(currUserId, reportReason);

                setShowReportUserConfirmation(true);
                setTimeout(() => {
                    setShowReportUserModal(false);
                }, 2000);
            } catch (error) {
                console.error("Error reporting user:", error);
            } finally {
                setIsProcessingReport(false);
            }
        }
    };

    const handleCloseReportUserModal = () => {
        setShowReportUserModal(false);
        setReportReason(null);
    }

    return (
        <div className='user-profile__body'>
            <Row className='user-profile fixed-top'>
                {/* <Row className='user-profile'> */}

                {/* Folllowes/Following Count Col */}
                <Col xs={{ span: 6, order: location.pathname !== '/user/profile' ? 3 : 2 }}
                    sm={{ span: 4, order: 1 }}
                    className={`d-flex flex-sm-column ${location.pathname !== '/user/profile' && isExtraSmallScreen ? 'justify-content-sm-evenly' : 'justify-content-center'}  user-profile__follow-count-col ${location.pathname !== '/user/profile' && isExtraSmallScreen ? 'h-50' : ''}`}>

                    {
                        isBlocked ?
                            null :
                            <>
                                <Button
                                    onClick={() => {
                                        handleShowFollowersModal();
                                        loadFollowers()
                                    }}
                                    className='user-profile__follow-number d-flex flex-row flex-sm-column align-items-start p-0'
                                >
                                    {(followersCount === null || isGetFollowingTheUserCountLoading) ?
                                        <LoadingSpinner />
                                        :
                                        <>
                                            Followers <br />
                                            <strong className='ms-2 ms-sm-0'>
                                                {followersCount}
                                            </strong>
                                        </>
                                    }
                                </Button>

                                <Button
                                    onClick={async () => {
                                        handleShowFollowingModal();
                                        await loadFollowing()
                                    }}
                                    className='user-profile__follow-number d-flex flex-row flex-sm-column align-items-start p-0'
                                >
                                    {(followingCount === null || isGetFollwedByUserCountLoading) ?
                                        <LoadingSpinner />
                                        :
                                        <>
                                            Following
                                            <strong className='ms-2 ms-sm-0'>
                                                {followingCount}
                                            </strong>
                                        </>
                                    }
                                </Button>

                            </>
                    }
                </Col>

                {/* Avatar and username Col */}
                <Col xs={{ span: 6, order: 1 }}
                    sm={{ span: 4, order: 2 }}
                    className={`d-flex flex-column justify-content-center align-items-sm-center align-items-end user-profile__avatar-col ${location.pathname !== '/user/profile' && isExtraSmallScreen ? 'pt-3' : ''}`}>
                    <div>
                        {/* Avatar */}
                        <div className='d-flex justify-content-center align-items-center'>
                            {
                                !isAvatarLoading ?
                                    <>
                                        <img
                                            src={avatarUrl ? avatarUrl : defaultAvatar}
                                            alt="Profile"
                                            className='user-profile__avatar'
                                        />
                                    </>
                                    :
                                    <LoadingSpinner />
                            }
                        </div>

                        {/* Username */}
                        <p className='mb-0 mt-0 mt-md-1 text-center position-relative d-flex flex-column flex-sm-row justify-content-center align-items-center'>
                            <strong>
                                {username}
                            </strong>
                            {isOtherUserFollowingMe &&
                                <span className='w-100 user-profile__follow-status ms-0 ms-sm-2'>
                                    Follows you
                                </span>
                            }
                        </p>
                        <p className='my-0 text-center'>
                            {
                                website &&
                                <>
                                    <a href={website} target='_blank' className='text-decoration-none user-profile__website'>
                                        <i className='bi bi-link-45deg me-1' />
                                        {website
                                            .replace(/^https?:\/\//, '')
                                            .replace(/^www\./, '')
                                        }
                                    </a>
                                </>
                            }
                            {(userWebsite === null || userWebsite === '') &&
                                <>
                                    <Link to='/user/settings' className='user-profile__website'>
                                        <i className='bi bi-link-45deg' />
                                        Add a website
                                    </Link>
                                </>
                            }
                        </p>
                    </div>
                </Col>

                {/* Follow/Block/Report Col */}
                {location.pathname !== '/user/profile' ?
                    <Col xs={{ span: 6, order: 2 }}
                        sm={{ span: 4, order: 3 }}
                        className='d-flex justify-content-start flex-sm-column align-items-end justify-content-sm-center user-profile__follow-block-report-col'
                    >
                        <>
                            {
                                isBlocked ? null :
                                    <Button
                                        className={`user-profile__interaction-btn
                                ${isFollowing ? 'following' : ''} mb-2 ms-sm-auto`}
                                        onClick={() => handleFollow(currUserId)}
                                        style={{
                                            height: 'fit-content', width: 'fit-content',
                                        }}
                                        disabled={isOtherUserBlocked ? true : false}
                                    >
                                        {isFollowingUserLoading ? <LoadingSpinner /> :
                                            <>
                                                {isFollowing ? 'Following' : 'Follow'}
                                            </>
                                        }
                                    </Button>
                            }

                            {isExtraSmallScreen ?
                                <Dropdown className={`mb-2 ${isBlocked ? 'ms-0' : 'ms-2'} user-profile__interaction-dropdown`}>
                                    <Dropdown.Toggle id='dropdown-block-report'>
                                        <i className='bi bi-three-dots' />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='p-0'>
                                        <Dropdown.Item className='p-0 mb-1'>
                                            <Button
                                                onClick={handleShowBlockModal}
                                                className='user-profile__interaction-btn'
                                                style={{
                                                    height: 'fit-content', width: '100%',
                                                }}
                                                disabled={isOtherUserBlocked ? true : false}
                                            >
                                                {isOtherUserBlocked ? 'Blocked' : 'Block'}
                                            </Button>
                                        </Dropdown.Item>
                                        <Dropdown.Item className='p-0'>
                                            <Button
                                                onClick={handleReportUser}
                                                className='user-profile__interaction-btn'
                                                style={{
                                                    height: 'fit-content', width: '100%',
                                                }}>
                                                Report
                                            </Button>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                :
                                <>
                                    <Button
                                        onClick={handleShowBlockModal}
                                        className='user-profile__interaction-btn'
                                        style={{
                                            height: 'fit-content', width: 'fit-content', marginLeft: 'auto'
                                        }}
                                        disabled={isOtherUserBlocked ? true : false}
                                    >
                                        {isOtherUserBlocked ? 'Blocked' : 'Block'}
                                    </Button>
                                    <Button
                                        onClick={handleReportUser}
                                        className='user-profile__interaction-btn mt-2'
                                        style={{
                                            height: 'fit-content', width: 'fit-content', marginLeft: 'auto'
                                        }}>
                                        Report
                                    </Button>
                                </>
                            }
                        </>
                    </Col>
                    :
                    null
                }


            </Row>

            {/* Followers modal */}
            <FollowModal
                followModalTitle={'Followers'}
                showFollowModal={showFollowersModal}
                defaultAvatar={defaultAvatar}
                followAccounts={followersAccounts}
                hasMoreFollow={hasMoreFollowers}
                isLoadingMoreFollow={isLoadingMoreFollowers}
                loadFollowers={loadFollowers}
                getAvatarUrl={getAvatarUrl}
                handleCloseFollowModal={handleCloseFollowersModal}
            />

            {/* Following modal */}
            <FollowModal
                followModalTitle={'Following'}
                showFollowModal={showFollowingModal}
                defaultAvatar={defaultAvatar}
                followAccounts={followingAccounts}
                hasMoreFollow={hasMoreFollowing}
                isLoadingMoreFollow={isLoadingMoreFollowing}
                loadFollowing={loadFollowing}
                getAvatarUrl={getAvatarUrl}
                handleCloseFollowModal={handleCloseFollowingModal}
            />

            {/* Block modal */}
            <BlockModal
                username={username}
                currUserId={currUserId}
                showBlockModalFunction={showBlockModal}
                isProcessing={isProcessingBlock}
                handleBlock={handleBlock}
                handleCloseBlockModalFunction={handleCloseBlockModal}
            />

            {/* User report modal */}
            <ReportModal
                showReportModalFunction={showReportUserModal}
                showReportConfirmationCheck={showReportUserConfirmation}
                isProcessing={isProcessingReport}
                setReportReason={setReportReason}
                handleCloseReportModalFunction={handleCloseReportUserModal}
                handleReportSubmissionFunction={handleReportUserSubmission}
            />

        </div >
    )
}
