import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Profile } from '../../../components/User/Profile/Profile.jsx';
import { Notices } from '../../../components/User/Notices';
import { Tabs, Tab, Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
// import { screenUtils } from '../../../lib/utils/screenUtils.js';
import { ComposeNotice } from '../../../components/User/ComposeNotice';
import { Loading } from '../../../components/Loading/Loading.jsx';
import '../../../components/User/Profile/UserProfile.css';
import { EndAsterisks } from '../../../components/User/EndAsterisks.jsx';
import { NoticesPlaceholder } from '../../../components/User/NoticesPlaceholder.jsx';
import { ModifyModal } from '../../../components/User/Modals.jsx';
// import { RiSave2Line } from "react-icons/ri";
// import { BsHandThumbsUp } from 'react-icons/bs';


const UserProfile = () => {

    const location = useLocation();

    const { googleUserData, username } = useUserContext();

    const [accountType, setAccountType] = useState(null);
    const [noticeText, setNoticeText] = useState('');
    // const [noticeGif, setNoticeGif] = useState(null);
    const [duration, setDuration] = useState(24);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        user_id,
        // userNotices,
        latestNotice,
        savedNotices,
        likedNotices,
        isLoading,
        isAddingNotice,
        removingNoticeId,
        isSavingEdit,
        isRemovingNotice,
        fetchUserSaves,
        fetchUserLikes,
        setLikedNotices,
        setSavedNotices,
        addNotice,
        editNotice,
        handleSaveEdit,
        removeNotice,
        handleDelete,
        setRemovingNoticeId,
        handleLike,
        handleSave,
        handleReportNotice,
        handleReact,
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

    // const { isSmallScreen } = screenUtils();

    // const [notices, setNotices] = useState([]);
    const [userProfileNotices, setUserProfileNotices] = useState([]);
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
    const [isSavesClicked, setIsSavesClicked] = useState(false);
    const [isLoadingSaves, setIsLoadingSaves] = useState(false);

    // Likes Tab
    const [limitLikes] = useState(10);
    const [offsetLikes, setOffsetLikes] = useState(0);
    const [hasMoreLikes, setHasMoreLikes] = useState(true);
    const [isLoadingMoreLikes, setIsLoadingMoreLikes] = useState(false);
    const [isLikesClicked, setIsLikesClicked] = useState(false);
    const [isLoadingLikes, setIsLoadingLikes] = useState(false);


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

    // fetchBlockedUsersByUser
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

    // function for fetching notices
    const fetchNotices = async () => {
        setIsLoadingMore(true);
        try {
            const usrNtcs = await fetchUserNotices(user_id, limit, lastId);

            console.log('usrNtcs', usrNtcs);

            if (usrNtcs.length > 0) {

                if (lastId !== 0) {
                    setUserProfileNotices((prevNotices) => [
                        ...prevNotices,
                        ...usrNtcs,
                    ]);
                } else {
                    setUserProfileNotices(usrNtcs);
                }

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

    // Fetch notices for user on component load
    useEffect(() => {
        fetchNotices();
    }, [user_id])

    // Display notice in UI immediately after it is added 
    useEffect(() => {
        if (latestNotice && Object.keys(latestNotice).length > 0) {

            setUserProfileNotices((prevNotices) => {

                const noticeExists = prevNotices.some(notice => notice.$id === latestNotice.$id);
                if (!noticeExists) {
                    return [latestNotice, ...prevNotices];
                }
                return prevNotices;
            });
        }
    }, [latestNotice])

    // Fetch saves and users' data for saves tab
    useEffect(() => {
        const fetchSaveNotices = async () => {

            if (offsetSaves === 0) {
                setIsLoadingSaves(true);
            } else {
                setIsLoadingMoreSaves(true);
            }

            try {
                const allSavedNotices = await getAllSavedNotices(user_id, limitSaves, offsetSaves);

                console.log('allSavedNotices', allSavedNotices);

                const nstNtcsIds = allSavedNotices.map(ntc => ntc.$id);

                const svdNtcs = await fetchUserSaves(user_id, nstNtcsIds);

                setSavedNotices(prevSaves => {
                    const updatedSaves = { ...prevSaves };
                    svdNtcs.forEach(save => {
                        updatedSaves[save.notice_id] = save.$id;
                    });
                    return updatedSaves;
                });

                const lkdNtcs = await fetchUserLikes(user_id, nstNtcsIds);

                setLikedNotices(prevLikes => {
                    const updatedLikes = { ...prevLikes };
                    lkdNtcs.forEach(like => {
                        updatedLikes[like.notice_id] = like.$id;
                    });
                    return updatedLikes;
                });

                if (allSavedNotices?.length < limit) {
                    setHasMoreSaves(false);
                } else {
                    setHasMoreSaves(true);
                }

                await fetchUsersData(allSavedNotices, setSavedNoticesData, avatarUtil);
            } catch (error) {
                console.error('Error fetching saves - ', error);
            } finally {
                if (offsetSaves === 0) {
                    setIsLoadingSaves(false);
                }
                setIsLoadingMoreSaves(false);
            }

        };

        if (isSavesClicked === true) {
            fetchSaveNotices();
        }
    }, [user_id, offsetSaves, isSavesClicked])

    // Fetch likes and users' data for likes tab 
    useEffect(() => {
        const fetchLikedNotices = async () => {

            if (offsetLikes === 0) {
                setIsLoadingLikes(true);
            } else {
                setIsLoadingMoreLikes(true);
            }

            try {
                const allLikedNotices = await getAllLikedNotices(user_id, limitLikes, offsetLikes);

                console.log('allLikedNotices - UserProfile.jsx', allLikedNotices);

                const nstNtcsIds = allLikedNotices.map(ntc => ntc.$id);

                const svdNtcs = await fetchUserSaves(user_id, nstNtcsIds);

                setSavedNotices(prevSaves => {
                    const updatedSaves = { ...prevSaves };
                    svdNtcs.forEach(save => {
                        updatedSaves[save.notice_id] = save.$id;
                    });
                    return updatedSaves;
                });

                const lkdNtcs = await fetchUserLikes(user_id, nstNtcsIds);

                setLikedNotices(prevLikes => {
                    const updatedLikes = { ...prevLikes };
                    lkdNtcs.forEach(like => {
                        updatedLikes[like.notice_id] = like.$id;
                    });
                    return updatedLikes;
                });

                await fetchUsersData(allLikedNotices, setLikedNoticesData, avatarUtil);

                if (allLikedNotices?.length < limit) {
                    setHasMoreLikes(false);
                } else {
                    setHasMoreLikes(true);
                }

            } catch (error) {
                console.error('Error fetching likes - ', error);
            } finally {
                if (offsetLikes === 0) {
                    setIsLoadingLikes(false);
                }
                setIsLoadingMoreLikes(false);
            }
        };
        if (isLikesClicked === true) {
            fetchLikedNotices();
        }
    }, [user_id, offsetLikes, isLikesClicked])

    // The Saves and Likes data don't fetch unless isClicked === true
    useEffect(() => {
        if (eventKey === 'my-saves') {
            setIsSavesClicked(true);
        } else if (eventKey === 'my-likes') {
            setIsLikesClicked(true);
        }
    }, [eventKey]);


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
        console.log('EditingNoticeId + Current text', { noticeId, currentText });
        setEditingNoticeId(noticeId);
        setNoticeText(currentText);
        setShowEditModal(true);
    };

    const handleDeleteNotice = (noticeId) => {
        console.log('RemovingNoticeId', noticeId);
        setRemovingNoticeId(noticeId);
        setShowDeleteModal(true);
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

    useEffect(() => {
        console.log('eventKey', eventKey);
    }, [eventKey])

    useEffect(() => {
        console.log('userProfileNotices,', userProfileNotices);
    }, [userProfileNotices])

    const timerSpacing = 'mx-2';
    const timerDisplay = 'd-flex';
    const classname = `${timerDisplay} ${timerSpacing}`;

    if (isLoading) {
        return <div className='user-profile__loading'>
            <div>
                {/* <Loading />Loading {username}'s profile */}
                <Loading /><span className='ms-2'>Loading your profile</span>
            </div>
        </div>;
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
                // noticeGif={noticeGif}
                noticeType={accountType}
                setNoticeText={setNoticeText}
                // setNoticeGif={setNoticeGif}
                setDuration={setDuration}
                addNotice={addNotice}
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
                    {userProfileNotices.length !== 0 ?
                        <>
                            <Notices
                                notices={userProfileNotices}
                                username={username}
                                eventKey={eventKey}
                                user_id={user_id}
                                handleEditNotice={handleEditNotice}
                                handleDeleteNotice={handleDeleteNotice}
                                getReactionsForNotice={getReactionsForNotice}
                                getUserAccountByUserId={getUserAccountByUserId}
                                getReactionByReactionId={getReactionByReactionId}
                                handleReportNotice={handleReportNotice}
                                reportReaction={reportReaction}
                            />
                            <div className="d-flex justify-content-center mt-4 pb-5">
                                {hasMoreNotices ?
                                    <Button
                                        onClick={fetchNotices}
                                        disabled={isLoadingMore || !hasMoreNotices}
                                        className='mt-3 notices__load-more-notices-btn'
                                    >
                                        {isLoadingMore ?
                                            <><Loading size={18} /> Loading...</>
                                            : 'Load More'}
                                    </Button>
                                    :
                                    <EndAsterisks componentName='notices' />
                                }
                            </div>
                        </>
                        :
                        <NoticesPlaceholder location={location} />
                    }
                </Tab>

                {/* My Saves */}
                <Tab
                    eventKey='my-saves'
                    title="Saves"
                >

                    {!isLoadingSaves ?
                        (savedNoticesData.length !== 0 ?
                            <>
                                <Notices
                                    notices={savedNoticesData}
                                    username={username}
                                    likedNotices={likedNotices}
                                    savedNotices={savedNotices}
                                    eventKey={eventKey}
                                    user_id={user_id}
                                    handleLike={handleLike}
                                    handleSave={handleSave}
                                    setLikedNotices={setLikedNotices}
                                    setSavedNotices={setSavedNotices}
                                    handleReportNotice={handleReportNotice}
                                    handleReact={handleReact}
                                    getReactionsForNotice={getReactionsForNotice}
                                    getUserAccountByUserId={getUserAccountByUserId}
                                    getReactionByReactionId={getReactionByReactionId}
                                    reportReaction={reportReaction}
                                />
                                <div className='d-flex justify-content-center mt-4 pb-5'>
                                    {hasMoreSaves ?
                                        <Button
                                            onClick={() => setOffsetSaveas(offsetSaves + limitSaves)}
                                            disabled={isLoadingMoreSaves || !hasMoreSaves}
                                            className='notices__load-more-notices-btn'
                                        >
                                            {isLoadingMoreSaves ?
                                                <><Loading size={24} /> Loading...</>
                                                : 'Load More'}
                                        </Button>
                                        :
                                        <EndAsterisks componentName='notices' />
                                    }
                                </div>
                            </>
                            :
                            <NoticesPlaceholder location={location} section={'saved'}
                                icon={
                                    <i className='bi bi-floppy'></i>
                                }
                            />
                        )
                        :
                        <div className='d-flex justify-content-center'>
                            <Loading /><span className='ms-2'>Loading your saves...</span>
                        </div>
                    }

                </Tab>

                {/* My Likes */}
                <Tab
                    eventKey='my-likes'
                    title="Likes"
                >
                    {!isLoadingLikes ?
                        (likedNoticesData.length !== 0 ?
                            <>
                                <Notices
                                    notices={likedNoticesData}
                                    username={username}
                                    likedNotices={likedNotices}
                                    savedNotices={savedNotices}
                                    eventKey={eventKey}
                                    user_id={user_id}
                                    handleLike={handleLike}
                                    handleSave={handleSave}
                                    setLikedNotices={setLikedNotices}
                                    setSavedNotices={setSavedNotices}
                                    handleReportNotice={handleReportNotice}
                                    handleReact={handleReact}
                                    getReactionsForNotice={getReactionsForNotice}
                                    getUserAccountByUserId={getUserAccountByUserId}
                                    getReactionByReactionId={getReactionByReactionId}
                                    reportReaction={reportReaction}
                                />
                                <div className='d-flex justify-content-center mt-4 pb-5'>
                                    {hasMoreLikes ?
                                        <Button
                                            onClick={() => setOffsetLikes(offsetLikes + limitLikes)}
                                            disabled={isLoadingMoreLikes || !hasMoreLikes}
                                            className='notices__load-more-notices-btn'
                                        >
                                            {isLoadingMoreLikes ?
                                                <><Loading size={24} /> Loading...</>
                                                : 'Load More'}
                                        </Button>
                                        :
                                        <EndAsterisks componentName='notices' />
                                    }
                                </div>
                            </>
                            :
                            <NoticesPlaceholder location={location} section={'liked'}
                                // icon={<BsHandThumbsUp />}
                                icon={<i className="bi bi-hand-thumbs-up"></i>}
                            />
                        ) :
                        <div className='d-flex justify-content-center'>
                            <Loading /><span className='ms-2'>Loading your likes...</span>
                        </div>
                    }
                </Tab>
            </Tabs>

            {/* Edit Notice Modal */}
            <ModifyModal
                showModifyModal={showEditModal}
                noticeText={noticeText}
                isSavingEdit={isSavingEdit}
                modifyModalTitle={'Edit'}
                setNoticeText={setNoticeText}
                handleCloseModifyModal={handleCloseEditModal}
                handleSaveEdit={() => handleSaveEdit(editingNoticeId, noticeText, userProfileNotices, setUserProfileNotices, setEditingNoticeId, setNoticeText, setShowEditModal)}
            />

            {/* Delete Notice Modal */}
            <ModifyModal
                showModifyModal={showDeleteModal}
                isRemovingNotice={isRemovingNotice}
                modifyModalTitle={'Delete'}
                handleCloseModifyModal={handleCloseDeleteModal}
                handleDelete={() => handleDelete(setUserProfileNotices, setShowDeleteModal)}
            />

        </>
    )
}

export default UserProfile;