import React, { useState, useEffect, useCallback } from 'react';
import { useParams, redirect, useNavigate, useLocation } from 'react-router-dom';
import { Profile } from '../../../components/User/Profile/Profile.jsx';
import { Notices } from '../../../components/User/Notices.jsx';
import { Tabs, Tab, Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext.jsx';
import useUserInfo from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { useUnblockedNotices } from '../../../lib/utils/blockFilter.js';
import { Passcode } from '../../../components/User/Passcode.jsx';
import { Loading } from '../../../components/Loading/Loading.jsx';




const OtherUserProfile = () => {

    let { otherUsername } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { googleUserData, username } = useUserContext();

    const [currUserId, setCurrUserId] = useState(() => {
        return localStorage.getItem('currUserId') || null;
    });

    const {
        user_id,
        likedNotices,
        savedNotices,
        isLoading: noticesLoading,
        noticesReactions,
        // saveReactions,
        // likedReactions,
        likeNotice,
        saveNotice,
        reportNotice,
        getAllLikedNotices,
        getAllSavedNotices,
        fetchUserNotices,
        sendReaction,
        getReactionsForNotice,
        getReactionByReactionId,
        reportReaction
        // fetchReactionsForNotices,
        // setNoticesReactions,
        // setSaveReactions,
        // setLikedReactions
    } = useNotices(googleUserData);

    const { filterBlocksFromLikesSaves } = useUnblockedNotices();

    const {
        isFollowingUserLoading,
        isInitialFollowCheckLoading,
        isFollowing,
        followersCount,
        followingCount,
        followersAccounts,
        followingAccounts,
        makeBlock,
        getUserByUsername,
        getUserAccountByUserId,
        fetchUsersData,
        getBlockedUsersByUser,
        followUser,
        unfollowUser,
        getFollowStatus,
        setIsFollowing,
        getfollwedByUserCount,
        getFollowingTheUserCount,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        getPassocdeByBusincessId,
        reportUser
    } = useUserInfo(googleUserData);

    const [accountType, setAccountType] = useState(null);
    const [accountTypeCheck, setAccountTypeCheck] = useState(false);
    const [passcode, setPasscode] = useState('');

    const [isBlocked, setIsBlocked] = useState(false);
    const [isOtherUserBlocked, setIsOtherUserBlocked] = useState(false);

    const [notices, setNotices] = useState([]);
    const [otherUserNotices, setOtherUserNotices] = useState([]);
    const [savedNoticesData, setSavedNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl } = useUserAvatar(currUserId);

    // Notices Tab
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [hasMoreNotices, setHasMoreNotices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Saves Tab
    const [limitSaves] = useState(10);
    const [offsetSaves, setOffsetSaves] = useState(0);
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
    const [eventKey, setEventKey] = useState('notices');

    // Check for username vs. otherUsername
    useEffect(() => {
        if (otherUsername === username) {
            navigate('/user/profile');
        }
    }, [otherUsername, username, navigate]);

    // Hello
    useEffect(() => {
        console.log('Barev', username);
    }, [username]);

    // CurrUserId
    useEffect(() => {
        console.log('CurrUserId', currUserId);
    }, [currUserId])

    // Get Other User
    useEffect(() => {
        const getCurrUser = async () => {

            try {
                console.log('otherUsername', otherUsername);

                const otherUser = await getUserByUsername(otherUsername);

                console.log('otherUser:', otherUser);

                const user = await getUserByUsername(username);

                console.log('user:', user);

                const blckdByOtherUser = await getBlockedUsersByUser(otherUser.$id);

                console.log(`blckdLst by ${otherUser.username}:`, blckdByOtherUser);

                const blckdByUser = await getBlockedUsersByUser(user.$id);

                console.log(`blckdLst by ${user.username}:`, blckdByUser);

                // Checking if the other user has blocked user 
                if (blckdByOtherUser.length !== 0) {
                    const blockdByOtherUser = blckdByOtherUser.filter((blocked) => blocked.blocked_id === user.$id);

                    if (blockdByOtherUser.length !== 0 || null) {
                        console.log('blockedId', blockdByOtherUser);
                        setIsBlocked(true);
                    }
                }

                // Checking if user has blocked the other user 
                if (blckdByUser.length !== 0) {
                    const blockdByUser = blckdByUser.filter((blocked) => blocked.blocked_id === otherUser.$id);

                    if (blockdByUser.length !== 0 || null) {
                        console.log('blockerId', blockdByUser);
                        setIsOtherUserBlocked(true);
                    }
                }


                if (otherUser) {
                    // Only update if different to prevent unnecessary re-renders
                    setCurrUserId((prevId) => (prevId !== otherUser.$id ? otherUser.$id : prevId));

                    setAccountType(otherUser.accountType)
                } else {
                    console.error(`User with username "${otherUsername}" not found.`);
                }

            } catch (error) {
                console.error(error);
            }
        }
        getCurrUser();
    }, [username, otherUsername])

    useEffect(() => {
        console.log('acountType:', accountType);
    }, [accountType])

    // Fetch notices for other user
    useEffect(() => {
        const fetchNotices = async () => {
            setIsLoadingMore(true);
            try {
                const usrNtcs = await fetchUserNotices(currUserId, setNotices, limit, offset);

                setOtherUserNotices(usrNtcs);

                console.log('usrNtcs', usrNtcs);

                if (usrNtcs?.length < limit) {
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
        callFunctionIfNotBlocked(fetchNotices);
    }, [currUserId, offset])

    const callFunctionIfNotBlocked = (functionName) => {
        if (isBlocked === false) {
            functionName();
        } else {
            console.log('This user blocked you.');
        }
    }

    // Fetch saves and users' data for saves tab 
    useEffect(() => {
        if (eventKey !== 'saves') return;

        const fetchSaveNotices = async () => {
            setIsLoadingMoreSaves(true);
            try {
                const allSavedNotices = await getAllSavedNotices(currUserId, limitSaves, offsetSaves);

                console.log('allSavedNotices', allSavedNotices);

                const noticesWithoutTypeOrganization = allSavedNotices.filter((savedNotice) => savedNotice.noticeType !== 'organization');

                console.log('noticesWithoutTypeOrganization', noticesWithoutTypeOrganization);

                const filteredNotices = await filterBlocksFromLikesSaves(noticesWithoutTypeOrganization, user_id);

                if (filteredNotices?.length < limitSaves) {
                    setHasMoreSaves(false);
                } else {
                    setHasMoreSaves(true);
                }

                await fetchUsersData(filteredNotices, setSavedNoticesData, avatarUtil);
            } catch (error) {
                console.error('Error fetching saves - ', error);
            } finally {
                setIsLoadingMoreSaves(false);
            }
        };
        callFunctionIfNotBlocked(fetchSaveNotices);
    }, [currUserId, offsetSaves])

    // Fetch likes and users' data for likes tab  
    useEffect(() => {
        if (eventKey !== 'likes') return;

        const fetchLikedNotices = async () => {
            setIsLoadingMoreLikes(true);
            try {
                const allLikedNotices = await getAllLikedNotices(currUserId, limitLikes, offsetLikes);

                console.log('allLikedNotices', allLikedNotices);

                const noticesWithoutTypeOrganization = allLikedNotices.filter((likedNotice) => likedNotice.noticeType !== 'organization');

                console.log('noticesWithoutTypeOrganization', noticesWithoutTypeOrganization);

                const filteredNotices = await filterBlocksFromLikesSaves(noticesWithoutTypeOrganization, user_id);

                await fetchUsersData(filteredNotices, setLikedNoticesData, avatarUtil);

                if (filteredNotices?.length < limitLikes) {
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
        callFunctionIfNotBlocked(fetchLikedNotices);
    }, [currUserId, offsetLikes])

    // Fetch accounts following the other user
    const loadFollowers = async () => {
        if (!hasMoreFollowers || isLoadingMoreFollowers) return;
        try {
            setIsLoadingMoreFollowers(true);

            const newAccounts = await fetchAccountsFollowingTheUser(currUserId, limitFollowers, offsetFollowers);

            console.log('newAccounts', newAccounts);

            if (newAccounts.length < limitFollowers) {
                setHasMoreFollowers(false);
            }

            if (newAccounts.length > 0) {
                setOffsetFollowers((prevOffset) => prevOffset + limitFollowers);
            }

        } catch (error) {
            console.error('Error loaing followers:', error);
        } finally {
            setIsLoadingMoreFollowers(false);
        }
    };

    //Fetch follow status
    useEffect(() => {
        getFollowStatus(user_id, currUserId);
    }, [user_id, currUserId])

    // Fetch followers count
    useEffect(() => {
        getFollowingTheUserCount(currUserId);
    }, [currUserId])

    // Fetch following count
    useEffect(() => {
        getfollwedByUserCount(currUserId);
    }, [currUserId])

    const loadFollowing = async () => {
        if (!hasMoreFollowing || isLoadingMoreFollowing) return;
        try {
            setIsLoadingMoreFollowing(true);

            if (offsetFollowing === 0) {
                setHasMoreFollowing(true);
            }

            const newAccounts = await fetchAccountsFollowedByUser(currUserId, limitFollowing, offsetFollowing);

            console.log('newAccounts', newAccounts);

            if (newAccounts.length < limitFollowing) {
                setHasMoreFollowing(false);
            }

            if (newAccounts.length > 0) {
                setOffsetFollowing((prevOffset) => prevOffset + limitFollowing);
            }

        } catch (error) {
            console.error('Error loaing following:', error);
        } finally {
            setIsLoadingMoreFollowing(false);
        }
    }

    useEffect(() => {
        setOffsetFollowing(0);
    }, [currUserId])

    const handleLike = async (notice) => {
        try {
            await likeNotice(notice.$id, notice.user_id);
        } catch (error) {
            console.error('Could not like notice');
        }
    }

    const handleSave = async (notice) => {
        try {
            await saveNotice(notice.$id, notice.user_id);
        } catch (error) {
            console.error('Error creating save entry:', error);
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

    const handleReact = async (currUserId, content, notice_id, expiresAt) => {
        try {
            await sendReaction(currUserId, content, notice_id, expiresAt);
            console.log('Success handleReact.');
        } catch (error) {
            console.error('Failed handleReact:', error);
        }
    }

    const handleFollow = async (currUserId) => {
        try {
            await followUser(currUserId);
            setIsFollowing(prevState => !prevState);
        } catch (error) {
            console.error('Failed to follow/unfollow user:', error);
        }
    }

    const handleBlock = async (currUserId) => {
        try {
            await makeBlock(currUserId);
            await unfollowUser(currUserId);
            navigate('/user/feed');
        } catch (error) {
            console.error('Failed to block user:', error);
        }
    }

    // Reporting user
    const handleUserReport = async (reported_id, reason) => {
        try {
            await reportUser(reported_id, reason);
            console.log('Reporting user successful!');
        } catch (error) {
            console.error('Error reporting user', error);
        }
    }

    const timerSpacing = 'mx-2';
    const timerDisplay = 'd-flex';
    const classname = `${timerDisplay} ${timerSpacing}`;

    const checkPasscode = async () => {
        try {
            console.log('accountTypeCheck', accountTypeCheck);

            const psscd = await getPassocdeByBusincessId(currUserId);

            console.log('psscd', psscd[0].passcode);
            localStorage.setItem('passcode', passcode);

            console.log('Stored passcode in localStorage:', localStorage.getItem('passcode'));

            if (psscd[0].passcode === passcode) {
                setAccountTypeCheck(true);
            }

        } catch (error) {
            console.error('Error checking passcode:', error);
        }
    }

    useEffect(() => {
        console.log('accountTypeCheck', accountTypeCheck);
    }, [accountTypeCheck])

    useEffect(() => {
        console.log('Pathname:', location.pathname);
        console.log('Event Key:', eventKey);
    }, [eventKey])


    if (noticesLoading) {
        return <div><Loading />Loading {otherUsername}'s profile</div>;
    }

    if (accountType === 'organization' && accountTypeCheck === false) {
        return <Passcode
            passcode={passcode}
            setPasscode={setPasscode}
            checkPasscode={checkPasscode}
        />
    }

    return (
        <>
            <>
                <Profile
                    username={otherUsername}
                    avatarUrl={avatarUrl}
                    currUserId={currUserId}
                    isBlocked={isBlocked}
                    isOtherUserBlocked={isOtherUserBlocked}
                    followingAccounts={followingAccounts}
                    followersAccounts={followersAccounts}
                    followersCount={followersCount}
                    followingCount={followingCount}
                    isFollowing={isFollowing}
                    isFollowingUserLoading={isFollowingUserLoading}
                    isInitialFollowCheckLoading={isInitialFollowCheckLoading}
                    handleFollow={handleFollow}
                    handleBlock={handleBlock}
                    handleUserReport={handleUserReport}
                    loadFollowing={loadFollowing}
                    loadFollowers={loadFollowers}
                    hasMoreFollowers={hasMoreFollowers}
                    hasMoreFollowing={hasMoreFollowing}
                    isLoadingMoreFollowing={isLoadingMoreFollowing}
                    isLoadingMoreFollowers={isLoadingMoreFollowers}
                />
                <>
                    {!isBlocked ?
                        <>
                            <Tabs
                                defaultActiveKey="notices"
                                id="notices-tabs"
                                justify
                                className='user-profile__notice-tab fixed-bottom'
                                onSelect={(key) => setEventKey(key)}
                            >
                                {/* NOTICES TAB */}
                                <Tab
                                    eventKey='notices'
                                    title="Notices"
                                >
                                    {notices?.length !== 0 ?
                                        <>
                                            <Notices
                                                notices={otherUserNotices}
                                                likedNotices={likedNotices}
                                                savedNotices={savedNotices}
                                                reactions={noticesReactions}
                                                eventKey={eventKey}
                                                isOtherUserBlocked={isOtherUserBlocked}
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
                                        </>
                                        : 'No notices yet'}
                                </Tab>

                                {/* SAVES TAB */}
                                <Tab
                                    eventKey='saves'
                                    title="Saves"
                                >
                                    {savedNoticesData.length !== 0 ?
                                        <>
                                            <Notices
                                                notices={savedNoticesData}
                                                user_id={user_id}
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
                                                        onClick={() => setOffsetSaves(offset + limit)}
                                                        disabled={isLoadingMoreSaves || !hasMoreSaves}
                                                    >
                                                        {isLoadingMoreSaves ?
                                                            <><Loading size={24} /> Loading...</>
                                                            : 'Load More'}
                                                    </Button>
                                                    : 'No more saves'}
                                            </div>
                                        </>
                                        : 'No saveas yet'}
                                </Tab>

                                {/* LIKES TAB */}
                                <Tab
                                    eventKey='likes'
                                    title="Likes"
                                >
                                    {likedNoticesData.length !== 0 ?
                                        <>
                                            <Notices
                                                notices={likedNoticesData}
                                                user_id={user_id}
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
                                                        onClick={() => setOffsetLikes(offset + limit)}
                                                        disabled={isLoadingMoreLikes || !hasMoreLikes}
                                                    >
                                                        {isLoadingMoreLikes ?
                                                            <><Loading size={24} /> Loading...</>
                                                            : 'Load More'}
                                                    </Button>
                                                    : 'No more likes'}
                                            </div>
                                        </>
                                        : 'No likes yet'}
                                </Tab>
                            </Tabs>
                        </>
                        : null}
                </>
            </>
        </>
    )
}

export default OtherUserProfile;