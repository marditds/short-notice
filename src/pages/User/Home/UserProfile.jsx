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
        // userNotices,
        spreadNotices,
        likedNotices,
        isLoading,
        isAddingNotice,
        removingNoticeId,
        isRemovingNotice,
        noticesReactions,
        spreadReactions,
        likedReactions,
        addNotice,
        editNotice,
        removeNotice,
        setRemovingNoticeId,
        likeNotice,
        spreadNotice,
        reportNotice,
        sendReaction,
        fetchUserNotices,
        getAllLikedNotices,
        getAllSpreadNotices,
        fetchReactionsForNotices,
        setNoticesReactions,
        setSpreadReactions,
        setLikedReactions
    } = useNotices(googleUserData);

    const {
        followersCount,
        followingCount,
        followersAccounts,
        followingAccounts,
        fetchUsersData,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser
    } = useUserInfo(googleUserData);

    const [notices, setNotices] = useState([]);
    const [spreadNoticesData, setSpreadNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl } = useUserAvatar(user_id);

    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [hasMoreNotices, setHasMoreNotices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);


    // Fetch notices for user
    useEffect(() => {
        const fetchNotices = async () => {
            // fetchUserNotices(user_id, setNotices);
            setIsLoadingMore(true);
            try {
                const usrNtcs = await fetchUserNotices(user_id, setNotices, limit, offset);

                if (usrNtcs.length < limit) {
                    setHasMoreNotices(false);
                } else {
                    setHasMoreNotices(true);
                }

            } catch (error) {
                console.error('Error fetching notices - ', error);
            } finally {
                setIsLoadingMore(false);
            }
        };
        fetchNotices();
    }, [user_id, offset])

    // Display notice in UI immediately after it is added
    const handleNoticeAdded = (newNotice) => {
        setNotices(prevNotices => [newNotice, ...prevNotices]);
    };

    // Fetch spreads and users' data for spreads tab
    useEffect(() => {
        const fetchSpreadNotices = async () => {

            const allSpreadNotices = await getAllSpreadNotices(user_id);

            await fetchUsersData(allSpreadNotices, setSpreadNoticesData, avatarUtil);
        };
        fetchSpreadNotices();
    }, [user_id])

    // Fetch likes and users' data for likes tab 
    useEffect(() => {
        const fetchLikedNotices = async () => {

            const allLikedNotices = await getAllLikedNotices(user_id);

            await fetchUsersData(allLikedNotices, setLikedNoticesData, avatarUtil);
        };
        fetchLikedNotices();
    }, [user_id])

    // Reactions For Notices tab
    useEffect(() => {
        fetchReactionsForNotices(notices, setNoticesReactions);
    }, [notices]);

    // Reactions For Spreads tab
    useEffect(() => {
        fetchReactionsForNotices(spreadNoticesData, setSpreadReactions);
    }, [spreadNoticesData]);

    // Reactions For Likes tab
    useEffect(() => {
        fetchReactionsForNotices(likedNoticesData, setLikedReactions);
    }, [likedNoticesData]);

    // Fetch accounts followed by user
    useEffect(() => {
        fetchAccountsFollowedByUser(user_id);
    }, [user_id])

    // Fetch accounts following the user 
    useEffect(() => {
        fetchAccountsFollowingTheUser(user_id);
    }, [user_id])

    const handleEditNotice = (noticeId, currentText) => {
        setEditingNoticeId(noticeId);
        setNoticeText(currentText);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (editingNoticeId && noticeText.trim()) {
            const noticeToUpdate = notices.find(notice => notice.$id === editingNoticeId);
            let updatedNotice = null;
            if (noticeToUpdate) {
                updatedNotice = {
                    ...noticeToUpdate,
                    text: noticeText
                };


                const updtdntc = await editNotice(editingNoticeId, updatedNotice.text);

                console.log('editingNoticeId', editingNoticeId);

                console.log('updtdntc.text', updtdntc.text);

                setNotices(prevNotices =>
                    prevNotices.map((notice) =>
                        notice.$id === editingNoticeId ?
                            { ...notice, text: updtdntc.text } : notice)
                );

                setEditingNoticeId(null);
                setNoticeText('');
                setShowEditModal(false);
            }

        }
    };

    useEffect(() => {
        console.log('notices', notices);
    }, [notices])

    const handleDeleteNotice = (noticeId) => {
        setRemovingNoticeId(noticeId);
        setShowDeleteModal(true);
    }

    const handleDelete = async () => {
        if (removingNoticeId) {
            await removeNotice(removingNoticeId);
            setNotices(prevNotices => prevNotices.filter(notice => notice.$id !== removingNoticeId));
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

    const handleReact = async (user_id, content, notice_id) => {
        try {
            const res = await sendReaction(user_id, content, notice_id);
            console.log('Success handleReact.', res);
            return res;
        } catch (error) {
            console.error('Failed handleReact:', error);
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
                onNoticeAdded={handleNoticeAdded}
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
                        notices={notices}
                        username={username}
                        handleEditNotice={handleEditNotice}
                        handleDeleteNotice={handleDeleteNotice}
                        eventKey='my-notices'
                        reactions={noticesReactions}
                    />
                    <div className="d-flex justify-content-center mt-4">
                        {hasMoreNotices ?
                            <Button
                                onClick={() => setOffset(offset + limit)}
                                disabled={isLoadingMore || !hasMoreNotices}
                            >
                                {isLoadingMore ?
                                    <><Loading size={24} /> Loading...</>
                                    : 'Load More'}
                            </Button>
                            : 'No more notices'}
                    </div>
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
                        handleReport={handleReport}
                        handleReact={handleReact}
                        reactions={spreadReactions}
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
                        handleReport={handleReport}
                        handleReact={handleReact}
                        reactions={likedReactions}
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