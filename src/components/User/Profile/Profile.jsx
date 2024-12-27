import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Row, Col, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { getAvatarUrl } from '../../../lib/utils/avatarUtils.js';
import defaultAvatar from '../../../assets/default.png';
import { SlClose } from "react-icons/sl";
import { Loading } from '../../Loading/Loading.jsx';

export const Profile = ({ username, avatarUrl, handleFollow, handleBlock, currUserId, followingCount, followersCount, isFollowing, followingAccounts, followersAccounts, isFollowingUserLoading, isBlocked, isOtherUserBlocked, handleUserReport, hasMoreFollowing, hasMoreFollowers, loadFollowing, loadFollowers, isLoadingMoreFollowing, isLoadingMoreFollowers }) => {

    const location = useLocation();

    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);

    const reportCategories = [
        { name: "Hate speech", key: "HATE" },
        { name: "Harassment or bullying", key: "BULLY" },
        { name: "Violence or harmful behavior", key: "VIOL" },
        { name: "Misinformation or false information", key: "MISINFO" },
        { name: "Nudity or sexual content", key: "SEX" },
        { name: "Spam or misleading content", key: "SPAM" },
        { name: "Intellectual property violations", key: "COPYRIGHT" },
        { name: "Self-harm or suicide", key: "SELF" },
        { name: "Terrorism or extremism", key: "TERROR" },
        { name: "Scams or fraud", key: "SCAM" },
        { name: "Impersonation or fake accounts", key: "FAKE" },
        { name: "Graphic or violent content", key: "GRPHIC" },
        { name: "Child exploitation", key: "CHILD" },
        { name: "Privacy violation", key: "PRIV" },
        { name: "Animal abuse", key: "ANIM" }
    ];
    const [showReportUserModal, setShowReportUserModal] = useState(false);
    const [reportReason, setReportReason] = useState(null);
    const [showReportUserConfirmation, setShowReportUserConfirmation] = useState(false);

    const [isExtraSmallScreen, setIsExtraSmallScreen] = useState(window.innerWidth < 576);

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
            try {
                await handleUserReport(currUserId, reportReason);

                setShowReportUserConfirmation(true);
                setTimeout(() => {
                    setShowReportUserModal(false);
                }, 2000);
            } catch (error) {
                console.error("Error reporting user:", error);
            }
        }
    };

    const handleCloseReportUserModal = () => {
        setShowReportUserModal(false);
        setReportReason(null);
    }

    // Screen size check
    useEffect(() => {
        const handleResize = () => {
            setIsExtraSmallScreen(window.innerWidth < 576);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='user-profile__body'>
            <Row className='user-profile fixed-top'>

                {/* Folllowes/Following Col */}
                <Col
                    xs={{ span: 6, order: 3 }}
                    sm={{ span: 4, order: 1 }}
                    className='d-flex flex-row flex-sm-column justify-content-evenly user-profile__follow-count-col'>
                    {
                        isBlocked ?
                            null :
                            <>
                                <Button
                                    onClick={() => {
                                        handleShowFollowersModal();
                                        loadFollowers()
                                    }}
                                    className='user-profile__follow-number d-flex flex-row flex-sm-column p-0'
                                >
                                    {followersCount === null ?
                                        <Loading />
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
                                    className='user-profile__follow-number d-flex flex-row flex-sm-column p-0'
                                >
                                    {followingCount === null ?
                                        <Loading />
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

                {/* Profile Picture Col */}
                <Col
                    xs={{ span: 6, order: 1 }}
                    sm={{ span: 4, order: 2 }}
                    className='d-flex flex-column justify-content-evenly align-items-stretch user-profile__avatar-col'>
                    <div>
                        <img
                            src={avatarUrl ? avatarUrl : defaultAvatar}
                            alt="Profile"
                            className='user-profile__avatar'
                        />
                    </div>
                    <p className='my-0 text-center'>{username}</p>
                </Col>

                {/* Follow/Block/Report Col */}
                <Col
                    xs={{ span: 6, order: 2 }}
                    sm={{ span: 4, order: 3 }}
                    className='d-flex justify-content-start flex-sm-column align-items-stretch justify-content-sm-evenly user-profile__follow-block-report-col'
                >
                    {location.pathname !== '/user/profile' ?
                        <>
                            {
                                isBlocked ? null :
                                    <Button
                                        className={`user-profile__interaction-btn
                                ${isFollowing ? 'following' : ''} ms-sm-auto`}
                                        onClick={() => handleFollow(currUserId)}
                                        style={{
                                            height: 'fit-content', width: 'fit-content',
                                        }}
                                    >
                                        {isFollowingUserLoading ? <Loading /> :
                                            <>
                                                {isFollowing ? 'Following' : 'Follow'}
                                            </>
                                        }
                                    </Button>
                            }

                            {isExtraSmallScreen ?
                                <Dropdown className='ms-2 user-profile__interaction-dropdown'>
                                    <Dropdown.Toggle id='dropdown-block-report'>
                                        <i className='bi bi-three-dots' />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>
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
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Button
                                                onClick={handleReportUser}
                                                className='user-profile__interaction-btn'
                                                style={{
                                                    height: 'fit-content', width: 'fit-content', marginLeft: 'auto'
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
                                        className='user-profile__interaction-btn'
                                        style={{
                                            height: 'fit-content', width: 'fit-content', marginLeft: 'auto'
                                        }}>
                                        Report
                                    </Button>
                                </>
                            }
                        </>
                        :
                        null
                    }
                </Col>
                {isBlocked &&
                    <div style={{ color: 'white', textAlign: 'center' }}>
                        You are not authorzied to view, like, and save the notices shared by {username}.
                    </div>
                }
            </Row>

            {/* Followers modal */}
            <Modal
                show={showFollowersModal}
                onHide={handleCloseFollowersModal}
                className='user-profile__following--modal'
            >
                <Modal.Header
                    className='user-profile__following--modal-header w-100'
                >
                    <Modal.Title>{`Follower(s)`}</Modal.Title>
                    <Button
                        onClick={handleCloseFollowersModal}
                        className='ms-auto'
                    >
                        <SlClose size={24} />
                    </Button>
                </Modal.Header>
                <Modal.Body
                    className='user-profile__following--modal-body'
                >
                    THESE ARE FOLLOWING {username}
                    {followersAccounts && followersAccounts.map((followerAccount) => {
                        return (
                            <div key={followerAccount.$id}>
                                <Link
                                    to={`/user/${followerAccount.username}`}
                                    className='w-100 d-flex justify-content-between align-items-center'
                                    onClick={handleCloseFollowersModal}
                                >
                                    {followerAccount.username}
                                    <img src={getAvatarUrl(followerAccount.avatar) || defaultAvatar}
                                        className='follower__avatar' />
                                </Link>
                            </div>
                        )
                    })}
                    {hasMoreFollowers && (
                        isLoadingMoreFollowers ? (
                            <div><Loading size={24} /></div>
                        ) : (
                            <Button onClick={loadFollowers} className="btn btn-primary mt-3">
                                Load More
                            </Button>
                        )
                    )}
                    {!hasMoreFollowers && <p className="text-muted mt-3">No more accounts to load.</p>}
                </Modal.Body>
            </Modal>

            {/* Following modal */}
            <Modal
                show={showFollowingModal}
                onHide={handleCloseFollowingModal}
                className='user-profile__following--modal'
            >
                <Modal.Header
                    className='user-profile__following--modal-header w-100'
                >
                    <Modal.Title>Following</Modal.Title>
                    <Button
                        onClick={handleCloseFollowingModal}
                        className='ms-auto'
                    >
                        <SlClose size={24} />
                    </Button>
                </Modal.Header>
                <Modal.Body
                    className='d-grid user-profile__following--modal-body'
                >
                    THESE ACCOUNTS ARE FOLLOWED BY {username}
                    {followingAccounts && followingAccounts.map((followingAccount) => {
                        return (
                            <div key={followingAccount.$id}>
                                <Link
                                    to={`/user/${followingAccount.username}`}
                                    className='w-100 d-flex justify-content-between align-items-center'
                                    onClick={handleCloseFollowingModal}
                                >
                                    {followingAccount.username}
                                    <img src={getAvatarUrl(followingAccount.avatar) || defaultAvatar}
                                        className='following__avatar' />
                                </Link>
                            </div>

                        )
                    })}
                    {hasMoreFollowing && (
                        isLoadingMoreFollowing ? (
                            <div><Loading size={24} /></div>
                        ) : (
                            <Button onClick={loadFollowing} className="btn btn-primary mt-3">
                                Load More
                            </Button>
                        )
                    )}
                    {!hasMoreFollowing && <p className="text-muted mt-3">No more accounts to load.</p>}
                </Modal.Body>
            </Modal>

            {/* Block modal */}
            <Modal
                show={showBlockModal}
                onHide={handleCloseBlockModal}
                className='user-profile__block--modal'
            >
                <Modal.Header
                    className='justify-content-end border-bottom-0 user-profile__block--modal-header pb-0 w-100'
                >
                    <Button
                        onClick={handleCloseBlockModal}
                    >
                        <SlClose size={24} className='' />
                    </Button>
                </Modal.Header>
                <Modal.Body
                    className='user-profile__block--modal-body'
                >
                    <p>Are you sure you want to block <strong>{username}</strong>?</p>
                    <Button onClick={() => handleBlock(currUserId)}
                        className='me-2 user-profile__block--modal-body-btn'
                    >
                        Yes
                    </Button>
                    <Button onClick={handleCloseBlockModal}
                        className='user-profile__block--modal-body-btn'
                    >
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>

            {/* User report modal */}
            <Modal show={showReportUserModal}
                onHide={handleCloseReportUserModal}
                className='user-profile__report--modal'
            >
                <Modal.Header className='border-bottom-0 user-profile__report--modal-header'>
                    <Modal.Title>Report User</Modal.Title>
                </Modal.Header>
                <Modal.Body className='user-profile__report--modal-body py-0'>
                    {showReportUserConfirmation ? (
                        <p>Your report has been successfully submitted!</p>
                    ) : (
                        <Form>
                            <Form.Group className='mb-3' controlId='reportNotice'>
                                <Form.Label>Reason:</Form.Label>
                                {reportCategories.map((category) => (
                                    <Form.Check
                                        key={category.key}
                                        type='radio'
                                        label={category.name}
                                        id={category.name}
                                        name='reportReason'
                                        onChange={() => setReportReason(category.key)}
                                        className='user-profile__report--radio'
                                    />
                                ))}
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className='user-profile__report--modal-footer border-top-0'>
                    {showReportUserConfirmation ? null : (
                        <>
                            <Button onClick={handleCloseReportUserModal}
                                className='user-profile__report--modal-btn'
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleReportUserSubmission}
                                // disabled={!reportReason}
                                className='user-profile__report--modal-btn'
                            >
                                Report
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>

        </div >
    )
}
