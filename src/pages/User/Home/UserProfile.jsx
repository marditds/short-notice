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

    const { user_id, userNotices, spreadNotices, likedNotices, isLoading, isAddingNotice, removingNoticeId, isRemovingNotice, addNotice, editNotice, removeNotice, setRemovingNoticeId, likeNotice, addSpreads, getAllLikedNotices, getAllSpreadNotices } = useNotices(googleUserData);

    const { fetchUsersData } = useUserInfo(googleUserData);

    const [spreadNoticesData, setSpreadNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

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
        await likeNotice(notice.$id, notice.user_id);
        const updatedLikedNotices = await getAllLikedNotices(user_id);
        setLikedNoticesData(updatedLikedNotices);
    }

    const handleSpread = async (notice) => {
        try {
            await addSpreads(notice.$id, notice.user_id, user_id);
        } catch (error) {
            console.error('Error creating spread entry:', error);
        }
    };


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
                    />
                </Tab>
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
                    />
                </Tab>
            </Tabs>


            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header>
                    <Modal.Title>Edit Notice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3' controlId='editNotice'>
                            <Form.Label>Notice Text</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                value={noticeText}
                                onChange={(e) => setNoticeText(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>Save</Button>
                </Modal.Footer>
            </Modal>


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