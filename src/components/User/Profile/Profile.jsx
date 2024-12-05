import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { getAvatarUrl } from '../../../lib/utils/avatarUtils.js';
import defaultAvatar from '../../../assets/default.png';
import { SlClose } from "react-icons/sl";
import { Loading } from '../../Loading/Loading.jsx';

export const Profile = ({ username, avatarUrl, handleFollow, handleBlock, currUserId, followingCount, followersCount, isFollowing, followingAccounts, followersAccounts, isFollowingUserLoading, isBlocked, isOtherUserBlocked, handleUserReport, hasMoreFollowing, hasMoreFollowers, loadFollowing, loadFollowers }) => {

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

    return (
        <div className='user-profile__body'>
            <Row className='user-profile fixed-top'>

                {/* Folllowes/Following Col */}
                <Col className='d-grid'>
                    {
                        isBlocked ?
                            null :
                            <>
                                <Button
                                    onClick={handleShowFollowersModal}
                                    className='user-profile__follow-numbers-text'
                                >
                                    {followersCount === null ?
                                        null
                                        :
                                        'Followers'
                                    }
                                </Button>
                                <Button
                                    onClick={handleShowFollowersModal}
                                    className='user-profile__follow-numbers-number'
                                >
                                    {followersCount === null ?
                                        <Loading />
                                        :
                                        <strong>
                                            {followersCount}
                                        </strong>

                                    }
                                </Button>

                                <Button
                                    onClick={handleShowFollowingModal}
                                    className='user-profile__follow-numbers-text'
                                >
                                    {followingCount === null ?
                                        null
                                        :
                                        'Following'
                                    }
                                </Button>
                                <Button
                                    onClick={handleShowFollowingModal}
                                    className='user-profile__follow-numbers-number'
                                >
                                    {followingCount === null ?
                                        <Loading />
                                        :
                                        <strong>
                                            {followingCount}
                                        </strong>
                                    }
                                </Button>
                            </>
                    }
                </Col>

                {/* Profile Picture Col */}
                <Col className='w-100 d-grid justify-content-center gap-2'>
                    <img
                        src={avatarUrl ? avatarUrl : defaultAvatar}
                        alt="Profile"
                        className='user-profile__avatar'
                    />
                    <p className='my-0 text-center'>{username}</p>
                </Col>

                {/* Follow/Block/Report Col */}
                <Col
                    className='d-grid gap-0 align-content-stretch justify-content-end'
                >
                    {location.pathname !== '/user/profile' ?
                        <>
                            {
                                isBlocked ? null :
                                    <Button
                                        className={`user-profile__interaction-btn
                                ${isFollowing ? 'following' : ''}`}
                                        onClick={() => handleFollow(currUserId)}
                                        style={{
                                            height: 'fit-content', width: 'fit-content', marginLeft: 'auto'
                                        }}
                                    >
                                        {isFollowingUserLoading ? <Loading /> :
                                            <>
                                                {isFollowing ? 'Following' : 'Follow'}
                                            </>
                                        }
                                    </Button>
                            }


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
                    className='d-grid gap-2 user-profile__following--modal-body'
                >
                    THESE ARE FOLLOWING {username}
                    {followersAccounts && followersAccounts.map((followerAccount) => {
                        return (
                            <div key={followerAccount.$id}>
                                <Link
                                    to={`/user/${followerAccount.username}`}
                                    className='w-100 d-flex justify-content-between align-items-center'
                                >
                                    {followerAccount.username}
                                    <img src={getAvatarUrl(followerAccount.avatar) || defaultAvatar}
                                        className='follower__avatar' />
                                </Link>
                            </div>
                        )
                    })}
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
                                >
                                    {followingAccount.username}
                                    <img src={getAvatarUrl(followingAccount.avatar) || defaultAvatar}
                                        className='following__avatar' />
                                </Link>
                            </div>

                        )
                    })}
                    {hasMoreFollowing && (
                        <Button onClick={loadFollowing} className="btn btn-primary mt-3">
                            Load More
                        </Button>
                    )}
                </Modal.Body>
            </Modal>

            {/* Block modal */}
            <Modal
                show={showBlockModal}
                onHide={handleCloseBlockModal}
                className='user-profile__following--modal'
            >
                <Modal.Header
                    className='user-profile__following--modal-header w-100'
                >
                    <Button
                        onClick={handleCloseBlockModal}
                    >
                        <SlClose size={24} className='ms-auto' />
                    </Button>
                </Modal.Header>
                <Modal.Body
                    className='user-profile__following--modal-body'
                >
                    Are you sure you want to block {username}?
                    <Button onClick={() => handleBlock(currUserId)}>Yes</Button>
                    <Button onClick={handleCloseBlockModal}>Cancel</Button>
                </Modal.Body>
            </Modal>

            {/* User report modal */}
            <Modal show={showReportUserModal} onHide={handleCloseReportUserModal}>
                <Modal.Header>
                    <Modal.Title>Report User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                                    />
                                ))}
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {showReportUserConfirmation ? null : (
                        <>
                            <Button onClick={handleCloseReportUserModal}>
                                Cancel
                            </Button>
                            <Button onClick={handleReportUserSubmission}
                            // disabled={!reportReason}
                            >
                                Report
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>

        </div>
    )
}
