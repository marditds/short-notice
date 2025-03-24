import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Profile } from '../../../components/User/Profile/Profile.jsx';
import { Notices } from '../../../components/User/Notices';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { screenUtils } from '../../../lib/utils/screenUtils.js';
import { ComposeNotice } from '../../../components/User/ComposeNotice';
import { Loading } from '../../../components/Loading/Loading.jsx';
import '../../../components/User/Profile/UserProfile.css';
import { EndAsterisks } from '../../../components/User/EndAsterisks.jsx';
import { NoticesPlaceholder } from '../../../components/User/NoticesPlaceholder.jsx';
import { ModifyModal } from '../../../components/User/Modals.jsx';

const UserProfile = () => {

    const location = useLocation();

    const { googleUserData, username, userId, isApploading } = useUserContext();

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
        tagCategories,
        isGeminiLoading,
        setTagCategories,
        onGeminiRunClick,
        hakop,
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
    } = useNotices(googleUserData.email || localStorage.getItem('email'));

    const {
        // userId,
        userWebsite,
        followersCount,
        followingCount,
        isGetFollowingTheUserCountLoading,
        isGetFollwedByUserCountLoading,
        getAccount,
        setUserWebsite,
        getUserAccountByUserId,
        getUserByUsername,
        fetchUsersData,
        getfollwedByUserCount,
        getFollowingTheUserCount,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        getBlockedUsersByUser
    } = useUserInfo(googleUserData.email || localStorage.getItem('email'));

    const { isSmallScreen } = screenUtils();

    const [accountType, setAccountType] = useState(null);

    const [noticeText, setNoticeText] = useState('');
    // const [noticeGif, setNoticeGif] = useState(null);
    // const [duration, setDuration] = useState(24);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // const [notices, setNotices] = useState([]);
    const [userProfileNotices, setUserProfileNotices] = useState([]);
    const [savedNoticesData, setSavedNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl, isAvatarLoading } = useUserAvatar(userId);

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

    useEffect(() => {
        console.log('GoogleUserData in UserProfile:', googleUserData);
    }, [googleUserData])

    // Fetch account type and website by username
    useEffect(() => {
        const fetchUserByUserame = async () => {
            try {
                const usr = await getUserByUsername(username);
                console.log('UserProfile.jsx - usr', usr);

                setAccountType(usr.accountType);
                setUserWebsite(usr.website);

            } catch (error) {
                console.log('Error creating notice', error);
            }
        }
        console.log('website in UserProfile.jsx', userWebsite);

        fetchUserByUserame();
    }, [username])

    // fetchBlockedUsersByUser
    useEffect(() => {
        const fetchBlockedUsersByUser = async () => {
            try {
                console.log('userIdsasasa,', userId);

                const res = await getBlockedUsersByUser(userId);
                console.log('Bloccked users:', res);

            } catch (error) {
                console.error('Error fetching blocked users', error);
            }
        }
        // fetchBlockedUsersByUser();
    }, [userId])

    // function for fetching notices
    const fetchNotices = async () => {
        setIsLoadingMore(true);
        try {
            const usrNtcs = await fetchUserNotices(userId, limit, lastId);

            console.log('usrNtcs', usrNtcs);

            if (usrNtcs?.length > 0) {

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
        if (userId) {
            fetchNotices();
        }
    }, [userId])

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
                const allSavedNotices = await getAllSavedNotices(userId, userId, limitSaves, offsetSaves);

                console.log('allSavedNotices', allSavedNotices);

                const ntcsIds = allSavedNotices?.map(ntc => ntc.$id);

                const [svdNtcs, lkdNtcs] = await Promise.allSettled([
                    fetchUserSaves(userId, ntcsIds),
                    fetchUserLikes(userId, ntcsIds)
                ]);

                if (svdNtcs.status === 'fulfilled') {
                    setSavedNotices(prevSaves => {
                        const updatedSaves = { ...prevSaves };
                        svdNtcs.value.forEach(save => {
                            updatedSaves[save.notice_id] = save.$id;
                        });
                        return updatedSaves;
                    });
                } else {
                    console.error('Error fetching saved notices:', svdNtcs.reason);
                }

                if (lkdNtcs.status === 'fulfilled') {
                    setLikedNotices(prevLikes => {
                        const updatedLikes = { ...prevLikes };
                        lkdNtcs.value.forEach(like => {
                            updatedLikes[like.notice_id] = like.$id;
                        });
                        return updatedLikes;
                    });
                } else {
                    console.error('Error fetching liked notices:', lkdNtcs.reason);
                }

                // Data populating the notice
                await fetchUsersData(allSavedNotices, setSavedNoticesData, avatarUtil);

                if (allSavedNotices?.length < limit) {
                    setHasMoreSaves(false);
                } else {
                    setHasMoreSaves(true);
                }

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
    }, [userId, offsetSaves, isSavesClicked])

    // Fetch likes and users' data for likes tab 
    useEffect(() => {
        const fetchLikedNotices = async () => {

            console.log('Starting fetchLikedNotices in UserProfile.jsx');


            if (offsetLikes === 0) {
                setIsLoadingLikes(true);
            } else {
                setIsLoadingMoreLikes(true);
            }

            try {
                const allLikedNotices = await getAllLikedNotices(userId, userId, limitLikes, offsetLikes);

                console.log('allLikedNotices - UserProfile.jsx', allLikedNotices);

                const ntcsIds = allLikedNotices?.map(ntc => ntc.$id);

                const [svdNtcsRes, lkdNtcsRes] = await Promise.allSettled([
                    fetchUserSaves(userId, ntcsIds),
                    fetchUserLikes(userId, ntcsIds)
                ]);

                if (svdNtcsRes.status === 'fulfilled') {
                    setSavedNotices(prevSaves => {
                        const updatedSaves = { ...prevSaves };
                        svdNtcsRes.value.forEach(save => {
                            updatedSaves[save.notice_id] = save.$id;
                        });
                        return updatedSaves;
                    });
                } else {
                    console.error('Error fetching saved notices:', svdNtcsRes.reason);
                }

                if (lkdNtcsRes.status === 'fulfilled') {
                    setLikedNotices(prevLikes => {
                        const updatedLikes = { ...prevLikes };
                        lkdNtcsRes.value.forEach(like => {
                            updatedLikes[like.notice_id] = like.$id;
                        });
                        return updatedLikes;
                    });
                } else {
                    console.error('Error fetching liked notices:', lkdNtcsRes.reason);
                }

                // Data populating the notice
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
    }, [userId, offsetLikes, isLikesClicked])

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

            const accountsFollowedByUser = await fetchAccountsFollowedByUser(userId, limitFollowing, offsetFollowing);

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

    // Fetch accounts following the user  
    const loadFollowers = async () => {
        if (!hasMoreFollowers || isLoadingMoreFollowers) return;
        try {
            setIsLoadingMoreFollowers(true);

            const accountsFollowingTheUser = await fetchAccountsFollowingTheUser(userId, limitFollowers, offsetFollowers);

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

    // Fetch following count
    useEffect(() => {
        console.log('Fetching the followebByCount for user:', userId);
        if (userId) {
            getfollwedByUserCount(userId);
        }
    }, [userId])

    // Fetch followers count
    useEffect(() => {
        if (userId) {
            getFollowingTheUserCount(userId);
        }
    }, [userId])

    // Restting follow(ing/ers) data
    useEffect(() => {
        if (userId) {
            console.log('Current User ID changed:', userId);
            setFollowingAccounts([]);
            setOffsetFollowing(0);
            setHasMoreFollowing(true);
            setFollowersAccounts([]);
            setOffsetFollowers(0);
            setHasMoreFollowers(true);
        }
    }, [userId]);

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
    }, [eventKey]);

    useEffect(() => {
        console.log('userProfileNotices,', userProfileNotices);
    }, [userProfileNotices]);


    const timerSpacing = 'mx-2';
    const timerDisplay = 'd-flex';
    const classname = `${timerDisplay} ${timerSpacing}`;

    if (isApploading) {
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
                website={userWebsite}
                followingCount={followingCount}
                followersCount={followersCount}
                followingAccounts={followingAccounts}
                followersAccounts={followersAccounts}
                hasMoreFollowers={hasMoreFollowers}
                hasMoreFollowing={hasMoreFollowing}
                isLoadingMoreFollowing={isLoadingMoreFollowing}
                isLoadingMoreFollowers={isLoadingMoreFollowers}
                isAvatarLoading={isAvatarLoading}
                isGetFollowingTheUserCountLoading={isGetFollowingTheUserCountLoading}
                isGetFollwedByUserCountLoading={isGetFollwedByUserCountLoading}
                loadFollowers={loadFollowers}
                loadFollowing={loadFollowing}
            />

            <div style={{ marginTop: !isSmallScreen ? '205px' : '155px' }}>
                <ComposeNotice
                    isAddingNotice={isAddingNotice}
                    noticeText={noticeText}
                    noticeType={accountType}
                    isGeminiLoading={isGeminiLoading}
                    setNoticeText={setNoticeText}
                    addNotice={addNotice}
                    onGeminiRunClick={async (templateSubject) => {
                        console.log('templateSubject - UserProfile.jsx', templateSubject);
                        await onGeminiRunClick(templateSubject, setNoticeText)
                    }}
                />
            </div>

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
                                userId={userId}
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
                                    userId={userId}
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
                                    userId={userId}
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