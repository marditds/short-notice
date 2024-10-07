import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png';
import { SlClose } from "react-icons/sl";

export const Profile = ({ username, avatarUrl, handleFollow, currUserId, followingCount, followersCount, isFollowing, followings, followers }) => {

    const location = useLocation();

    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const handleShowFollowingModal = () => {
        setShowFollowingModal(true);
    }

    const handleCloseFollowingModal = () => {
        setShowFollowingModal(false);
    }

    return (
        <>
            <Row className='user-profile fixed-top'>
                <Col className='d-grid'>

                    <strong style={{ lineHeight: '12pt' }}>Followers</strong>
                    <p className='mb-0' style={{ fontSize: '24px' }}>
                        {followersCount}
                    </p>

                    <Button onClick={handleShowFollowingModal}>
                        <strong style={{ lineHeight: '12pt' }}>
                            Following
                        </strong>
                        {/* <p className='mb-0' style={{ fontSize: '24px' }}> */}
                        {followingCount}
                        {/* </p> */}
                    </Button>
                </Col>

                <Col className='w-100 d-grid justify-content-center gap-2'>
                    <img src={avatarUrl ? avatarUrl : defaultAvatar} alt="Profile" style={{ borderRadius: '50%', width: 100, height: 100 }} />
                    <p className='my-0 text-center'>{username}</p>
                </Col>

                <Col
                    className='d-grid gap-0 align-content-between justify-content-end'
                >
                    {location.pathname !== '/user/profile' &&
                        <>
                            <Button
                                className={`user-profile__interaction-btn
                                ${isFollowing ? 'following' : ''}`}
                                onClick={() => handleFollow(currUserId)}
                                style={{
                                    maxHeight: 'fit-content', maxWidth: 'fit-content'
                                }}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                            <Button
                                className='user-profile__interaction-btn'
                                style={{
                                    maxHeight: 'fit-content', maxWidth: 'fit-content', marginLeft: 'auto'
                                }}>
                                Block
                            </Button>
                            <Button
                                className='user-profile__interaction-btn'
                                style={{
                                    maxHeight: 'fit-content', maxWidth: 'fit-content', marginLeft: 'auto'
                                }}>
                                Report
                            </Button>
                        </>
                    }
                </Col>
            </Row>

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
                    >
                        <SlClose size={24} className='ms-auto' />
                    </Button>
                </Modal.Header>
                <Modal.Body
                    className='user-profile__following--modal-body'
                >
                    THESE ARE FOLLOWED BY {username}
                    {followings}
                </Modal.Body>
            </Modal>

        </>
    )
}
