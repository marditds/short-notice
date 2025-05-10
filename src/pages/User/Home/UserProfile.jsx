import { useState, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Profile } from '../../../components/User/Profile/Profile.jsx';
import { Notices } from '../../../components/User/Notices';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { useUserInfo } from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import { useUserAvatar } from '../../../lib/hooks/useUserAvatar.js';
import { useNotices } from '../../../lib/hooks/useNotices.js';
import { screenUtils } from '../../../lib/utils/screenUtils.js';
import { ComposeNotice } from '../../../components/User/ComposeNotice';
import { LoadingSpinner } from '../../../components/Loading/LoadingSpinner.jsx';
import '../../../components/User/Profile/UserProfile.css';
import { EndAsterisks } from '../../../components/User/EndAsterisks.jsx';
import { NoticesPlaceholder } from '../../../components/User/NoticesPlaceholder.jsx';
import { ModifyModal } from '../../../components/User/Modals.jsx';

const UserProfile = () => {

    const location = useLocation();

    const {
        username,
        userId,
        userEmail,
        userWebsite,
        isApploading,
        accountType
    } = useOutletContext();

    const {
        latestNotice,
        savedNotices,
        likedNotices,
        isAddingNotice,
        isSavingEdit,
        isRemovingNotice,
        isGeminiLoading,
        onGeminiRunClick,
        fetchUserSaves,
        fetchUserLikes,
        setLikedNotices,
        setSavedNotices,
        addNotice,
        handleSaveEdit,
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
        reportReaction,
        getAllLikesTotalByNoticeId,
        getAllSavesTotalByNoticeId
    } = useNotices();

    const {
        followersCount,
        followingCount,
        isGetFollowingTheUserCountLoading,
        isGetFollwedByUserCountLoading,
        getUserAccountByUserId,
        getUsersByIdQuery,
        fetchUsersData,
        getfollwedByUserCount,
        getFollowingTheUserCount,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        getBlockedUsersByUser
    } = useUserInfo();

    const { isSmallScreen } = screenUtils();

    const [noticeText, setNoticeText] = useState('');
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [userProfileNotices, setUserProfileNotices] = useState([]);
    const [savedNoticesData, setSavedNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl, isAvatarLoading, fetchUserAvatarForProfile } = useUserAvatar(userId);

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
        console.log('accountType in UserProfile:', accountType);
    }, [accountType])

    useEffect(() => {
        console.log('userEmail in UserProfile:', userEmail);
    }, [userEmail])

    useEffect(() => {
        console.log('userWebsite in UserProfile:', userWebsite);
    }, [userWebsite])

    useEffect(() => {
        console.log('userId in UserProfile:', userId);
    }, [userId])

    // useEffect(() => {
    //     const testingGetAccount = async () => {
    //         try {
    //             const session = await getSessionDetails();
    //             console.log('Active Session:', session);

    //             const accnt = await getAccount();
    //             console.log('THIS IS ACCOUNT:', accnt);
    //             console.log('THIS IS ACCOUNT ID:', accnt.$id);
    // setUserId(accnt.$id);
    // setUserEmail(accnt.email);
    // if(!accnt || accnt === undefined){
    //     await createSession()
    // }

    //         } catch (error) {
    //             console.error('Error getting account:', error);
    //         }
    //     }
    //     testingGetAccount();
    // }, [])

    // Fetch account type and website by user Id

    // useEffect(() => {
    //     const fetchUserByUserId = async () => {
    //         try {
    //             const usr = await getUserAccountByUserId(userId);
    //             console.log('UserProfile.jsx - usr', usr);

    //             setAccountType(usr.accountType);
    //             setUserWebsite(usr.website);
    //             setUsername(usr.username);

    //         } catch (error) {
    //             console.log('Error creating notice', error);
    //         }
    //     }
    //     console.log('website in UserProfile.jsx', userWebsite);

    //     fetchUserByUserId();
    // }, [userId])

    //fetchBlockedUsersByUser
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

            if (usrNtcs.length === 0) {
                console.log('User has no posts. Exiting through  the front door.');
                return;
            }

            console.log('usrNtcs', usrNtcs);

            const ntcsIds = usrNtcs?.map(ntc => ntc.$id);

            console.log('nstNtcsIds', ntcsIds);

            const [allLikes, allSaves] = await Promise.all([
                getAllLikesTotalByNoticeId(ntcsIds),
                getAllSavesTotalByNoticeId(ntcsIds)
            ]);

            console.log('TOTAL LIKES:', allLikes);
            console.log('TOTAL SAVES:', allSaves);

            const likesCountMap = new Map();
            const savesCountMap = new Map();

            if (allLikes) {
                for (const like of allLikes) {
                    const noticeId = like.notice_id;
                    likesCountMap.set(noticeId, (likesCountMap.get(noticeId) || 0) + 1);
                }
            }

            if (allSaves) {
                for (const save of allSaves) {
                    const noticeId = save.notice_id;
                    savesCountMap.set(noticeId, (savesCountMap.get(noticeId) || 0) + 1);
                }
            }

            const noticesWithLikesAndSaves = usrNtcs.map(notice => {
                const likesTotal = likesCountMap.get(notice.$id) || 0;
                const savesTotal = savesCountMap.get(notice.$id) || 0;

                return {
                    ...notice,
                    noticeLikesTotal: likesTotal,
                    noticeSavesTotal: savesTotal
                }
            });

            console.log('noticesWithLikesAndSaves', noticesWithLikesAndSaves);

            if (noticesWithLikesAndSaves?.length > 0) {
                if (lastId !== 0) {
                    setUserProfileNotices((prevNotices) => [
                        ...prevNotices,
                        ...noticesWithLikesAndSaves,
                    ]);
                } else {
                    setUserProfileNotices(noticesWithLikesAndSaves);
                }

                setLastId(noticesWithLikesAndSaves[noticesWithLikesAndSaves.length - 1].$id);

                if (noticesWithLikesAndSaves?.length < limit) {
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

    // Fetch avatar and notices for user on component load
    useEffect(() => {
        if (userId) {
            fetchUserAvatarForProfile(userId);
            fetchNotices();
        }
    }, [userId])

    // Display notice in UI immediately after it is added 
    useEffect(() => {
        if (latestNotice && Object.keys(latestNotice).length > 0) {

            setUserProfileNotices((prevNotices) => {

                const noticeExists = prevNotices.some(notice => notice.$id === latestNotice.$id);
                if (!noticeExists) {

                    const latestNoticeWithLike = { ...latestNotice, noticeLikesTotal: 0 }

                    return [latestNoticeWithLike, ...prevNotices];
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

    // log latest notice
    useEffect(() => {
        if (latestNotice) {
            console.log('THIS IS THE LATEST NOTICE:', latestNotice);
        }
    }, [latestNotice])


    const noticeTabs = [
        {
            key: 'my-saves',
            title: 'Saves',
            isLoading: isLoadingSaves,
            data: savedNoticesData,
            hasMore: hasMoreSaves,
            isLoadingMore: isLoadingMoreSaves,
            offset: offsetSaves,
            limit: limitSaves,
            setOffset: setOffsetSaveas,
            placeholderSection: 'saved',
            icon: <i className='bi bi-floppy' />,
            loadingText: 'Loading your saves...',
        },
        {
            key: 'my-likes',
            title: 'Likes',
            isLoading: isLoadingLikes,
            data: likedNoticesData,
            hasMore: hasMoreLikes,
            isLoadingMore: isLoadingMoreLikes,
            offset: offsetLikes,
            limit: limitLikes,
            setOffset: setOffsetLikes,
            placeholderSection: 'liked',
            icon: <i className='bi bi-hand-thumbs-up' />,
            loadingText: 'Loading your likes...',
        }
    ];

    if (isApploading) {
        return <div className='user-profile__loading'>
            <div>
                {/* <LoadingSpinner />Loading {username}'s profile */}
                <LoadingSpinner /><span className='ms-2'>Loading your profile</span>
            </div>
        </div>;
    }

    return (
        <>
            {/* User info section */}
            <Profile
                username={username}
                avatarUrl={avatarUrl}
                website={userWebsite}
                userWebsite={userWebsite}
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

            {/* Compose notice */}
            <div style={{ marginTop: !isSmallScreen ? '230px' : '170px' }}>
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

            {/* Notices tabs */}
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
                                user_id={userId}
                                handleEditNotice={handleEditNotice}
                                handleDeleteNotice={handleDeleteNotice}
                                getReactionsForNotice={getReactionsForNotice}
                                getUserAccountByUserId={getUserAccountByUserId}
                                getUsersByIdQuery={getUsersByIdQuery}
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
                                            <><LoadingSpinner size={18} /> Loading...</>
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

                {/* Saves and Likes   */}
                {noticeTabs.map(tab => (
                    <Tab key={tab.key} eventKey={tab.key} title={tab.title}>
                        {!tab.isLoading ? (
                            tab.data.length !== 0 ? (
                                <>
                                    <Notices
                                        notices={tab.data}
                                        username={username}
                                        likedNotices={likedNotices}
                                        savedNotices={savedNotices}
                                        eventKey={eventKey}
                                        user_id={userId}
                                        handleLike={handleLike}
                                        handleSave={handleSave}
                                        setLikedNotices={setLikedNotices}
                                        setSavedNotices={setSavedNotices}
                                        handleReportNotice={handleReportNotice}
                                        handleReact={handleReact}
                                        getReactionsForNotice={getReactionsForNotice}
                                        getUserAccountByUserId={getUserAccountByUserId}
                                        getUsersByIdQuery={getUsersByIdQuery}
                                        getReactionByReactionId={getReactionByReactionId}
                                        reportReaction={reportReaction}
                                    />
                                    <div className='d-flex justify-content-center mt-4 pb-5'>
                                        {tab.hasMore ? (
                                            <Button
                                                onClick={() => tab.setOffset(tab.offset + tab.limit)}
                                                disabled={tab.isLoadingMore || !tab.hasMore}
                                                className='notices__load-more-notices-btn'
                                            >
                                                {tab.isLoadingMore ? (
                                                    <>
                                                        <LoadingSpinner size={24} /> Loading...
                                                    </>
                                                ) : (
                                                    'Load More'
                                                )}
                                            </Button>
                                        ) : (
                                            <EndAsterisks componentName='notices' />
                                        )}
                                    </div>
                                </>
                            ) : (
                                <NoticesPlaceholder
                                    location={location}
                                    section={tab.placeholderSection}
                                    icon={tab.icon}
                                />
                            )
                        ) : (
                            <div className='d-flex justify-content-center'>
                                <LoadingSpinner />
                                <span className='ms-2'>{tab.loadingText}</span>
                            </div>
                        )}
                    </Tab>
                ))}


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