import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { getAvatarUrl } from '../../lib/utils/avatarUtils.js';
import defaultAvatar from '../../assets/default.png';
import { SlClose } from "react-icons/sl";
import { Loading } from '../Loading/Loading.jsx';

export const Profile = ({ username, avatarUrl, handleFollow, currUserId, followingCount, followersCount, isFollowing, followingAccounts, followersAccounts, isFollowingLoading }) => {

    const location = useLocation();

    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

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

    return (
        <>
            <Row className='user-profile fixed-top'>
                <Col className='d-grid'>

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


                </Col>

                <Col className='w-100 d-grid justify-content-center gap-2'>
                    <img src={avatarUrl ? avatarUrl : defaultAvatar} alt="Profile" style={{ borderRadius: '50%', width: 100, height: 100 }} />
                    <p className='my-0 text-center'>{username}</p>
                </Col>

                <Col
                    className='d-grid gap-0 align-content-between justify-content-end'
                >
                    {location.pathname !== '/user/profile' ?
                        <>
                            <Button
                                className={`user-profile__interaction-btn
                                ${isFollowing ? 'following' : ''}`}
                                onClick={() => handleFollow(currUserId)}
                                style={{
                                    height: 'fit-content', width: 'fit-content', marginLeft: 'auto'
                                }}
                            >
                                {isFollowingLoading ? <Loading /> :
                                    <>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </>
                                }
                            </Button>
                            <Button
                                className='user-profile__interaction-btn'
                                style={{
                                    height: 'fit-content', width: 'fit-content', marginLeft: 'auto'
                                }}>
                                Block
                            </Button>
                            <Button
                                className='user-profile__interaction-btn'
                                style={{
                                    height: 'fit-content', width: 'fit-content', marginLeft: 'auto'
                                }}>
                                Report
                            </Button>
                        </>
                        :
                        <>
                            <Button
                                className='user-profile__follow-numbers-text'
                                as={Link}
                                to='/user/reactions'
                            >
                                Reactions
                            </Button>
                        </>
                    }
                </Col>
            </Row>

            {/* Followers Modal */}
            <Modal
                show={showFollowersModal}
                onHide={handleCloseFollowersModal}
                className='user-profile__following--modal'
            >
                <Modal.Header
                    className='user-profile__following--modal-header w-100'
                >
                    <Modal.Title>Following</Modal.Title>
                    <Button
                        onClick={handleCloseFollowersModal}
                    >
                        <SlClose size={24} className='ms-auto' />
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
                                >
                                    {followerAccount.username}
                                    <img src={getAvatarUrl(followerAccount.avatar) || defaultAvatar} />
                                </Link>
                            </div>
                        )
                    })}
                </Modal.Body>
            </Modal>

            {/* Following Modal */}
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
                    {followingAccounts && followingAccounts.map((followingAccount) => {
                        return (
                            <div key={followingAccount.$id}>
                                <Link
                                    to={`/user/${followingAccount.username}`}
                                >
                                    {followingAccount.username}
                                    <img src={getAvatarUrl(followingAccount.avatar) || defaultAvatar} />
                                </Link>
                            </div>
                        )
                    })}
                </Modal.Body>
            </Modal>

        </>
    )
}
