import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../../../components/User/Profile/Profile.jsx';
import { Notices } from '../../../components/User/Notices';
import { Tabs, Tab, Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { ComposeNotice } from '../../../components/User/ComposeNotice';
import { Loading } from '../../../components/Loading/Loading.jsx';
import '../../../components/User/Profile/UserProfile.css';


const UserProfile = () => {

    const { googleUserData, username } = useUserContext();

    const [accountType, setAccountType] = useState(null);
    const [noticeText, setNoticeText] = useState('');
    const [duration, setDuration] = useState(24);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        user_id,
        savedNotices,
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
        saveNotice,
        reportNotice,
        sendReaction,
        fetchUserNotices,
        getAllLikedNotices,
        getAllSavedNotices,
        getReactionsForNotice,
        getReactionByReactionId,
        reportReaction
    } = useNotices(googleUserData);

    const {
        followersCount,
        followingCount,
        getUserAccountByUserId,
        getUserByUsername,
        fetchUsersData,
        getfollwedByUserCount,
        getFollowingTheUserCount,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        getBlockedUsersByUser
    } = useUserInfo(googleUserData);

    const [notices, setNotices] = useState([]);
    const [userNotices, setUserNotices] = useState([]);
    const [savedNoticesData, setSavedNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl } = useUserAvatar(user_id);

    const [followingAccounts, setFollowingAccounts] = useState([]);
    const [followersAccounts, setFollowersAccounts] = useState([]);

    // Notices Tab
    const [limit] = useState(10);
    const [lastId, setLastId] = useState(0);
    const [hasMoreNotices, setHasMoreNotices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Saves Tab
    const [limitSaves] = useState(10);
    const [offsetSaves, setOffsetSaveas] = useState(0);
    const [hasMoreSaves, setHasMoreSaves] = useState(true);
    const [isLoadingMoreSaves, setIsLoadingMoreSaves] = useState(false);

    // Likes Tab
    const [limitLikes] = useState(10);
    const [offsetLikes, setOffsetLikes] = useState(0);
    const [hasMoreLikes, setHasMoreLikes] = useState(true);
    const [isLoadingMoreLikes, setIsLoadingMoreLikes] = useState(false);

    // Following
    const [limitFollowing] = useState(11);
    const [offsetFollowing, setOffsetFollowing] = useState(0);
    const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
    const [isLoadingMoreFollowing, setIsLoadingMoreFollowing] = useState(false);

    // Following
    const [limitFollowers] = useState(11);
    const [offsetFollowers, setOffsetFollowers] = useState(0);
    const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
    const [isLoadingMoreFollowers, setIsLoadingMoreFollowers] = useState(false);

    // Tabs' EventKey
    const [eventKey, setEventKey] = useState('my-notices');

    // Fetch account type by username
    useEffect(() => {
        const fetchUserByUserame = async () => {
            try {
                const usr = await getUserByUsername(username);
                setAccountType(usr.accountType);
            } catch (error) {
                console.log('Error creating notice', error);
            }
        }
        fetchUserByUserame();
    }, [username])

    useEffect(() => {
        const fetchBlockedUsersByUser = async () => {
            try {
                console.log('user_idsasasa,', user_id);

                const res = await getBlockedUsersByUser(user_id);
                console.log('Bloccked users:', res);

            } catch (error) {
                console.error('Error fetching blocked users', error);
            }
        }
        fetchBlockedUsersByUser();
    }, [user_id])

    const fetchNotices = async () => {
        // fetchUserNotices(user_id, setNotices);
        setIsLoadingMore(true);
        try {
            const usrNtcs = await fetchUserNotices(user_id, setNotices, limit, lastId);

            console.log('usrNtcs', usrNtcs);

            if (usrNtcs.length > 0) {

                setUserNotices((prevNotices) => [
                    ...prevNotices,
                    ...usrNtcs,
                ]);

                setLastId(usrNtcs[usrNtcs.length - 1].$id);

                if (usrNtcs?.length < limit) {
                    setHasMoreNotices(false);
                }
            } else {
                setHasMoreNotices(true);
            }

        } catch (error) {
            console.error('Error fetching notices - ', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Fetch notices for user
    useEffect(() => {
        fetchNotices();
    }, [user_id])

    // Display notice in UI immediately after it is added
    const handleNoticeAdded = (newNotice) => {
        setNotices(prevNotices => [newNotice, ...prevNotices]);
    };

    // Fetch saves and users' data for saves tab
    useEffect(() => {
        if (eventKey !== 'my-saves') return;

        const fetchSaveNotices = async () => {
            setIsLoadingMoreSaves(true);
            try {
                const allSavedNotices = await getAllSavedNotices(user_id, limitSaves, offsetSaves);

                if (allSavedNotices?.length < limit) {
                    setHasMoreSaves(false);
                } else {
                    setHasMoreSaves(true);
                }

                await fetchUsersData(allSavedNotices, setSavedNoticesData, avatarUtil);
            } catch (error) {
                console.error('Error fetching saves - ', error);
            } finally {
                setIsLoadingMoreSaves(false);
            }

        };
        fetchSaveNotices();
    }, [user_id, offsetSaves, eventKey])

    // Fetch likes and users' data for likes tab 
    useEffect(() => {
        if (eventKey !== 'my-likes') return;

        const fetchLikedNotices = async () => {
            setIsLoadingMoreLikes(true);
            try {
                const allLikedNotices = await getAllLikedNotices(user_id, limitLikes, offsetLikes);

                console.log('allLikedNotices - UserProfile.jsx', allLikedNotices);

                await fetchUsersData(allLikedNotices, setLikedNoticesData, avatarUtil);

                if (allLikedNotices?.length < limit) {
                    setHasMoreLikes(false);
                } else {
                    setHasMoreLikes(true);
                }

            } catch (error) {
                console.error('Error fetching likes - ', error);
            } finally {
                setIsLoadingMoreLikes(false);
            }
        };
        fetchLikedNotices();
    }, [user_id, offsetLikes, eventKey])

    useEffect(() => {
        console.log('Hello', username);
    }, [username])

    // Fetch accounts followed by user
    const loadFollowing = async () => {
        if (!hasMoreFollowing || isLoadingMoreFollowing) return;
        try {
            setIsLoadingMoreFollowing(true);

            const accountsFollowedByUser = await fetchAccountsFollowedByUser(user_id, limitFollowing, offsetFollowing);

            console.log('accountsFollowedByUser', accountsFollowedByUser);

            setFollowingAccounts((prev) => [...prev, ...accountsFollowedByUser]);

            if (accountsFollowedByUser.length < limitFollowing) {
                setHasMoreFollowing(false);
            }

            if (accountsFollowedByUser.length > 0) {
                setOffsetFollowing((prevOffset) => prevOffset + limitFollowing);
            }

        } catch (error) {
            console.error('Error loaing following:', error);
        } finally {
            setIsLoadingMoreFollowing(false);
        }
    };

    // Fetch following count
    useEffect(() => {
        getfollwedByUserCount(user_id);
    }, [user_id])

    // Fetch accounts following the user  
    const loadFollowers = async () => {
        if (!hasMoreFollowers || isLoadingMoreFollowers) return;
        try {
            setIsLoadingMoreFollowers(true);

            const accountsFollowingTheUser = await fetchAccountsFollowingTheUser(user_id, limitFollowers, offsetFollowers);

            console.log('accountsFollowingTheUser', accountsFollowingTheUser);

            setFollowersAccounts((prev) => [...prev, ...accountsFollowingTheUser]);

            if (accountsFollowingTheUser.length < limitFollowers) {
                setHasMoreFollowers(false);
            }

            if (accountsFollowingTheUser.length > 0) {
                setOffsetFollowers((prevOffset) => prevOffset + limitFollowers);
            }

        } catch (error) {
            console.error('Error loaing followers:', error);
        } finally {
            setIsLoadingMoreFollowers(false);
        }
    };

    // Fetch followers count
    useEffect(() => {
        getFollowingTheUserCount(user_id);
    }, [user_id])

    // Restting follow(ing/ers) data
    useEffect(() => {
        if (user_id) {
            console.log('Current User ID changed:', user_id);
            setFollowingAccounts([]);
            setOffsetFollowing(0);
            setHasMoreFollowing(true);
            setFollowersAccounts([]);
            setOffsetFollowers(0);
            setHasMoreFollowers(true);
        }
    }, [user_id]);

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

    const handleSave = async (notice) => {
        try {
            await saveNotice(notice.$id, notice.user_id, user_id);
        } catch (error) {
            console.error('Error creating save entry:', error);
        }
    };

    const handleReport = async (notice_id, author_id, reason, noticeText) => {
        try {
            await reportNotice(notice_id, author_id, reason, noticeText);
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

    useEffect(() => {
        console.log('eventKey', eventKey);
    }, [eventKey])

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
                loadFollowers={loadFollowers}
                loadFollowing={loadFollowing}
                hasMoreFollowers={hasMoreFollowers}
                hasMoreFollowing={hasMoreFollowing}
                isLoadingMoreFollowing={isLoadingMoreFollowing}
                isLoadingMoreFollowers={isLoadingMoreFollowers}
            />

            <ComposeNotice
                duration={duration}
                isAddingNotice={isAddingNotice}
                noticeText={noticeText}
                noticeType={accountType}
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
                onSelect={(key) => setEventKey(key)}
            >
                {/* My Notices */}
                <Tab
                    eventKey='my-notices'
                    title="My Notices"
                >
                    <Notices
                        notices={notices}
                        username={username}
                        eventKey={eventKey}
                        handleEditNotice={handleEditNotice}
                        handleDeleteNotice={handleDeleteNotice}
                        getReactionsForNotice={getReactionsForNotice}
                        getUserAccountByUserId={getUserAccountByUserId}
                    />
                    <div className="d-flex justify-content-center mt-4">
                        {hasMoreNotices ?
                            <Button
                                onClick={fetchNotices}
                                disabled={isLoadingMore || !hasMoreNotices}
                            >
                                {isLoadingMore ?
                                    <><Loading size={24} /> Loading...</>
                                    : 'Load More'}
                            </Button>
                            : 'No more notices'}
                    </div>
                </Tab>

                {/* My Saves */}
                <Tab
                    eventKey='my-saves'
                    title="Saves"
                >
                    <Notices
                        notices={savedNoticesData}
                        username={username}
                        likedNotices={likedNotices}
                        savedNotices={savedNotices}
                        eventKey={eventKey}
                        handleLike={handleLike}
                        handleSave={handleSave}
                        handleReport={handleReport}
                        handleReact={handleReact}
                        getReactionsForNotice={getReactionsForNotice}
                        getUserAccountByUserId={getUserAccountByUserId}
                        getReactionByReactionId={getReactionByReactionId}
                        reportReaction={reportReaction}
                    />
                    <div className="d-flex justify-content-center mt-4">
                        {hasMoreSaves ?
                            <Button
                                onClick={() => setOffsetSaveas(offsetSaves + limitSaves)}
                                disabled={isLoadingMoreSaves || !hasMoreSaves}
                            >
                                {isLoadingMoreSaves ?
                                    <><Loading size={24} /> Loading...</>
                                    : 'Load More'}
                            </Button>
                            : 'No more saves'}
                    </div>
                </Tab>

                {/* My Likes */}
                <Tab
                    eventKey='my-likes'
                    title="Likes"
                >
                    <Notices
                        notices={likedNoticesData}
                        username={username}
                        likedNotices={likedNotices}
                        savedNotices={savedNotices}
                        eventKey={eventKey}
                        handleLike={handleLike}
                        handleSave={handleSave}
                        handleReport={handleReport}
                        handleReact={handleReact}
                        getReactionsForNotice={getReactionsForNotice}
                        getUserAccountByUserId={getUserAccountByUserId}
                        getReactionByReactionId={getReactionByReactionId}
                        reportReaction={reportReaction}
                    />
                    <div className="d-flex justify-content-center mt-4">
                        {hasMoreLikes ?
                            <Button
                                onClick={() => setOffsetLikes(offsetLikes + limitLikes)}
                                disabled={isLoadingMoreLikes || !hasMoreLikes}
                            >
                                {isLoadingMoreLikes ?
                                    <><Loading size={24} /> Loading...</>
                                    : 'Load More'}
                            </Button>
                            : 'No more likes'}
                    </div>
                </Tab>
            </Tabs>

            <Modal show={showEditModal}
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


            <Modal show={showDeleteModal}
                onHide={handleCloseDeleteModal}>
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