import React, { useState, useEffect, useCallback } from 'react';
import { useParams, redirect, useNavigate, useLocation } from 'react-router-dom';
import { Profile } from '../../../components/User/Profile.jsx';
import { Notices } from '../../../components/User/Notices.jsx';
import { Tabs, Tab, Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext.jsx';
import useUserInfo from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
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
        saveNotices,
        isLoading: noticesLoading,
        noticesReactions,
        // saveReactions,
        // likedReactions,
        likeNotice,
        saveNotice,
        reportNotice,
        getAllLikedNotices,
        getAllSaveNotices,
        fetchUserNotices,
        sendReaction,
        getReactionsForNotice
        // fetchReactionsForNotices,
        // setNoticesReactions,
        // setSaveReactions,
        // setLikedReactions
    } = useNotices(googleUserData);

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
        setIsFollowing,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        getPassocdeByBusincessId
    } = useUserInfo(googleUserData);

    const [accountType, setAccountType] = useState(null);
    const [accountTypeCheck, setAccountTypeCheck] = useState(false);
    const [passcode, setPasscode] = useState('');

    const [isBlocked, setIsBlocked] = useState(false);
    const [isOtherUserBlocked, setIsOtherUserBlocked] = useState(false);

    const [notices, setNotices] = useState([]);
    const [saveNoticesData, setSaveNoticesData] = useState([]);
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

    // Get Other User
    useEffect(() => {
        const getCurrUser = async () => {

            try {
                // const allUsers = await getUsersData();

                // console.log('allUsers:', allUsers.documents);

                // const currUser = allUsers.documents.find((user) => user.username === otherUsername);

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
        // if (isBlocked === false) {
        //     fetchNotices();
        // } else {
        //     console.log('This user blocked you.');
        // }
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
        const fetchSaveNotices = async () => {
            setIsLoadingMoreSaves(true);
            try {
                const allSaveNotices = await getAllSaveNotices(currUserId, limitSaves, offsetSaves);

                console.log('allSaveNotices', allSaveNotices);


                if (allSaveNotices?.length < limitSaves) {
                    setHasMoreSaves(false);
                } else {
                    setHasMoreSaves(true);
                }

                await fetchUsersData(allSaveNotices, setSaveNoticesData, avatarUtil);
            } catch (error) {
                console.error('Error fetching saves - ', error);
            } finally {
                setIsLoadingMoreSaves(false);
            }

        };
        // if (isBlocked === false) {
        //     fetchSaveNotices();
        // } else {
        //     console.log('This user blocked you.');
        // }
        callFunctionIfNotBlocked(fetchSaveNotices);
    }, [currUserId, offsetSaves])

    // Fetch likes and users' data for likes tab  
    useEffect(() => {
        const fetchLikedNotices = async () => {
            setIsLoadingMoreLikes(true);
            try {
                const allLikedNotices = await getAllLikedNotices(currUserId, limitLikes, offsetLikes);

                if (allLikedNotices?.length < limitLikes) {
                    setHasMoreLikes(false);
                } else {
                    setHasMoreLikes(true);
                }

                await fetchUsersData(allLikedNotices, setLikedNoticesData, avatarUtil);
            } catch (error) {
                console.error('Error fetching likes - ', error);
            } finally {
                setIsLoadingMoreLikes(false);
            }
        };
        // if (isBlocked === false) {
        //     fetchLikedNotices();
        // } else {
        //     console.log('This user blocked you.');
        // }
        callFunctionIfNotBlocked(fetchLikedNotices);
    }, [currUserId, offsetLikes])

    // Reactions For Notices tab
    // useEffect(() => {
    //     fetchReactionsForNotices(notices, setNoticesReactions);
    // }, [notices]);
    // Reactions For Saves tab
    // useEffect(() => {
    //     fetchReactionsForNotices(saveNoticesData, setSaveReactions);
    // }, [saveNoticesData]);
    // Reactions For Likes tab
    // useEffect(() => {
    //     fetchReactionsForNotices(likedNoticesData, setLikedReactions);
    // }, [likedNoticesData]);

    // Fetch accounts following the other user
    useEffect(() => {
        const fetchFollowingTheUser = async () => {
            try {
                if (currUserId && user_id && (isBlocked === false)) {
                    fetchAccountsFollowingTheUser(currUserId, user_id);
                } else {
                    console.log('This user blocked you. - follow(ing/er)');
                }
            } catch (error) {
                console.error('Failed fetchFollowingTheUser:', error);
            }
        }
        fetchFollowingTheUser();
    }, [currUserId, user_id])

    // Fetch accounts followed by other user
    useEffect(() => {
        const fetchFollowedByUser = async () => {
            try {
                if (currUserId && (isBlocked === false)) {
                    fetchAccountsFollowedByUser(currUserId);
                } else {
                    console.log('This user blocked you. - follow(ing/er)');
                }
            } catch (error) {
                console.error('Failed fetchFollowedByUser:', error);
            }
        }
        fetchFollowedByUser();
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
            navigate('/user/feed');
        } catch (error) {
            console.error('Failed to block user:', error);
        }
    }

    const timerSpacing = 'mx-2';
    const timerDisplay = 'd-flex';
    const classname = `${timerDisplay} ${timerSpacing}`;



    // useEffect(() => {
    //     const fetchUserPasscode = async () => {
    //         const psscd = await getPassocdeByBusincessId(currUserId);
    //         console.log('psscd', psscd[0].passcode);

    //         if (psscd[0].passcode === passcode) {
    //             setAccountTypeCheck(true);
    //         }

    //     }
    //     fetchUserPasscode();
    // }, [currUserId])

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
                                    {notices.length !== 0 ?
                                        <>
                                            <Notices
                                                notices={notices}
                                                likedNotices={likedNotices}
                                                saveNotices={saveNotices}
                                                reactions={noticesReactions}
                                                eventKey={eventKey}
                                                handleLike={handleLike}
                                                handleSave={handleSave}
                                                handleReport={handleReport}
                                                handleReact={handleReact}
                                                getReactionsForNotice={getReactionsForNotice}
                                                getUserAccountByUserId={getUserAccountByUserId}
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
                                    {saveNoticesData.length !== 0 ?
                                        <>
                                            <Notices
                                                notices={saveNoticesData}
                                                user_id={user_id}
                                                likedNotices={likedNotices}
                                                saveNotices={saveNotices}
                                                eventKey={eventKey}
                                                handleLike={handleLike}
                                                handleSave={handleSave}
                                                handleReport={handleReport}
                                                handleReact={handleReact}
                                                getReactionsForNotice={getReactionsForNotice}
                                                getUserAccountByUserId={getUserAccountByUserId}
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
                                                saveNotices={saveNotices}
                                                eventKey={eventKey}
                                                handleLike={handleLike}
                                                handleSave={handleSave}
                                                handleReport={handleReport}
                                                handleReact={handleReact}
                                                getReactionsForNotice={getReactionsForNotice}
                                                getUserAccountByUserId={getUserAccountByUserId}

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