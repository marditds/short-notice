import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../../../components/User/Profile';
import { Notices } from '../../../components/User/Notices';
import { Tabs, Tab, Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { ComposeNotice } from '../../../components/User/ComposeNotice';
import { Loading } from '../../../components/Loading/Loading.jsx';
import './UserProfile.css';




const UserProfile = () => {

    const { googleUserData, username } = useUserContext();
    const [noticeText, setNoticeText] = useState('');
    const [duration, setDuration] = useState(24);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        user_id,
        userNotices,
        spreadNotices,
        likedNotices,
        isLoading,
        isAddingNotice,
        removingNoticeId,
        isRemovingNotice,
        addNotice,
        editNotice,
        removeNotice,
        setRemovingNoticeId,
        likeNotice,
        spreadNotice,
        reportNotice,
        getAllLikedNotices,
        getAllSpreadNotices
    } = useNotices(googleUserData);

    const {
        followingCount,
        followingAccounts,
        getUsersData,
        fetchUsersData,
        following,
        getUserFollowersById,
        getUserFollowingsById,
        fetchAccountsFollowedByUser
    } = useUserInfo(googleUserData);

    const [spreadNoticesData, setSpreadNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const [followersCount, setFollowersCount] = useState(null);
    // const [followingCount, setFollowingCount] = useState(null);

    // const [followingAccounts, setFollowingAccounts] = useState([]);
    const [followersAccounts, setFollowersAccounts] = useState([]);


    const { avatarUrl } = useUserAvatar(user_id);


    useEffect(() => {
        fetchUsersData(spreadNoticesData, setSpreadNoticesData, avatarUtil);
    }, [spreadNoticesData])


    useEffect(() => {
        fetchUsersData(likedNoticesData, setLikedNoticesData, avatarUtil);
    }, [likedNoticesData])


    // Fetch liked notices
    useEffect(() => {
        const fetchLikedNotices = async () => {
            const allLikedNotices = await getAllLikedNotices(user_id);

            setLikedNoticesData(allLikedNotices);
        };
        fetchLikedNotices();
    }, [user_id]);

    // Fetch spread notices 
    useEffect(() => {
        const fetchSpreadNotices = async () => {
            const allSpreadNotices = await getAllSpreadNotices(user_id);

            setSpreadNoticesData(allSpreadNotices);
        };
        fetchSpreadNotices();

    }, [user_id])


    // Fetch accounts followed by user
    useEffect(() => {

        fetchAccountsFollowedByUser(user_id);

    }, [user_id])

    // Fetch accounts following the user 
    useEffect(() => {
        const fetchUserFollowersById = async () => {
            try {
                const allUsers = await getUsersData();
                console.log('allUsers:', allUsers.documents);

                const followersUserIds = await getUserFollowersById(user_id);
                console.log('followersUserIds', followersUserIds);

                const accountsFollowingTheUser = allUsers.documents.filter((user) =>
                    followersUserIds.some(followed => user.$id === followed.user_id)
                );

                console.log('accountsFollowingTheUser:', accountsFollowingTheUser);

                setFollowersAccounts(accountsFollowingTheUser);

                setFollowersCount(followersUserIds.length);

            } catch (error) {
                console.error('Failed to fetch user followers:', error);
            }
        }
        fetchUserFollowersById();
    }, [user_id])

    const handleEditNotice = (noticeId, currentText) => {
        setEditingNoticeId(noticeId);
        setNoticeText(currentText);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (editingNoticeId && noticeText.trim()) {
            editNotice(editingNoticeId, noticeText);
            setEditingNoticeId(null);
            setNoticeText('');
            setShowEditModal(false);
        }
    };

    const handleDeleteNotice = (noticeId) => {
        setRemovingNoticeId(noticeId);
        setShowDeleteModal(true);
    }

    const handleDelete = async () => {
        if (removingNoticeId) {
            await removeNotice(removingNoticeId);
            setRemovingNoticeId(null);
            setShowDeleteModal(false);
        }
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingNoticeId(null);
        setNoticeText('');
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setRemovingNoticeId(null);
    }

    const handleLike = async (notice) => {
        try {
            await likeNotice(notice.$id, notice.user_id);
        } catch (error) {
            console.error('Error creating like entry:', error);
        }
    }

    const handleSpread = async (notice) => {
        try {
            await spreadNotice(notice.$id, notice.user_id, user_id);
        } catch (error) {
            console.error('Error creating spread entry:', error);
        }
    };


    const handleReport = async (notice_id, author_id, reason) => {
        try {
            await reportNotice(notice_id, author_id, reason);
            return 'Report success';
        } catch (error) {
            console.error('Could not report notice');
        }
    }


    const timerSpacing = 'mx-2';
    const timerDisplay = 'd-flex';
    const classname = `${timerDisplay} ${timerSpacing}`;

    if (isLoading) {
        return <div><Loading />Loading {username}'s profile</div>;
    }

    return (
        <>

            <Profile
                username={username}
                avatarUrl={avatarUrl}
                followingCount={followingCount}
                followersCount={followersCount}
                followingAccounts={followingAccounts}
                followersAccounts={followersAccounts}
            />

            <ComposeNotice
                duration={duration}
                isAddingNotice={isAddingNotice}
                noticeText={noticeText}
                setNoticeText={setNoticeText}
                setDuration={setDuration}
                addNotice={addNotice}
            />

            <Tabs
                defaultActiveKey="my-notices"
                id="justify-tab-example"
                justify
                className='user-profile__notice-tab fixed-bottom'
            >
                <Tab
                    eventKey='my-notices'
                    title="My Notices"
                >
                    <Notices
                        notices={userNotices}
                        handleEditNotice={handleEditNotice}
                        handleDeleteNotice={handleDeleteNotice}
                        eventKey='my-notices'
                    />
                </Tab>
                {/* SPREADS */}
                <Tab
                    eventKey='my-spreads'
                    title="Spreads"
                >
                    <Notices
                        notices={spreadNoticesData}
                        username={username}
                        likedNotices={likedNotices}
                        spreadNotices={spreadNotices}
                        handleLike={handleLike}
                        handleSpread={handleSpread}
                        handleReport={handleReport}
                    />
                </Tab>

                {/* LIKES */}
                <Tab
                    eventKey='my-likes'
                    title="Likes"
                >
                    <Notices
                        notices={likedNoticesData}
                        username={username}
                        likedNotices={likedNotices}
                        spreadNotices={spreadNotices}
                        handleLike={handleLike}
                        handleSpread={handleSpread}
                        handleReport={handleReport}
                    />
                </Tab>
            </Tabs>

            {/* <div className='position-fixed'> */}
            <Modal
                show={showEditModal}
                onHide={handleCloseEditModal}
                className='notice__edit--modal'
            >
                <Modal.Header
                    className='notice__edit--modal-header'
                >
                    <Modal.Title>Edit Notice</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className='notice__edit--modal-body'
                >
                    <Form>
                        <Form.Group className='mb-3' controlId='editNotice'>
                            <Form.Label>Your Notice Text</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                value={noticeText}
                                onChange={(e) => setNoticeText(e.target.value)}
                                className='notice__edit--modal-form-control'
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer
                    className='notice__edit--modal-footer'
                >
                    <Button
                        onClick={handleCloseEditModal}
                        className='notice__edit--modal-btn'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        className='notice__edit--modal-btn'
                    >
                        Save</Button>
                </Modal.Footer>
            </Modal>
            {/* </div> */}


            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header>
                    <Modal.Title>Delete Notice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Are you sure you want to delete this notice❓</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={isRemovingNotice}
                    >
                        {isRemovingNotice ? <Loading /> : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UserProfile;