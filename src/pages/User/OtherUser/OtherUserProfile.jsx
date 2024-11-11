import React, { useState, useEffect, useCallback } from 'react';
import { useParams, redirect, useNavigate } from 'react-router-dom';
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

    const { googleUserData, username } = useUserContext();

    const [currUserId, setCurrUserId] = useState(() => {
        return localStorage.getItem('currUserId') || null;
    });

    const {
        user_id,
        likedNotices,
        spreadNotices,
        isLoading: noticesLoading,
        noticesReactions,
        // spreadReactions,
        // likedReactions,
        likeNotice,
        spreadNotice,
        reportNotice,
        getAllLikedNotices,
        getAllSpreadNotices,
        fetchUserNotices,
        sendReaction,
        getReactionsForNotice
        // fetchReactionsForNotices,
        // setNoticesReactions,
        // setSpreadReactions,
        // setLikedReactions
    } = useNotices(googleUserData);

    const {
        isFollowingLoading,
        isFollowing,
        followersCount,
        followingCount,
        followersAccounts,
        followingAccounts,
        makeBlock,
        getUserByUsername,
        fetchUsersData,
        getBlockedUsersByUser,
        // getUsersData,
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

    const [notices, setNotices] = useState([]);
    const [spreadNoticesData, setSpreadNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl } = useUserAvatar(currUserId);

    // Notices Tab
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [hasMoreNotices, setHasMoreNotices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Spreads Tab
    const [limitSpreads] = useState(10);
    const [offsetSpreads, setOffsetSpreads] = useState(0);
    const [hasMoreSpreads, setHasMoreSpreads] = useState(true);
    const [isLoadingMoreSpreads, setIsLoadingMoreSpreads] = useState(false);

    // Likes Tab
    const [limitLikes] = useState(10);
    const [offsetLikes, setOffsetLikes] = useState(0);
    const [hasMoreLikes, setHasMoreLikes] = useState(true);
    const [isLoadingMoreLikes, setIsLoadingMoreLikes] = useState(false);

    // Check for username vs. otherUsername
    useEffect(() => {
        if (otherUsername === username) {
            navigate('/user/profile');
        }
    }, [otherUsername, username, navigate]);

    // Get Other User
    useEffect(() => {
        const getCurrUser = async () => {

            try {
                // const allUsers = await getUsersData();

                // console.log('allUsers:', allUsers.documents);

                // const currUser = allUsers.documents.find((user) => user.username === otherUsername);

                const user = await getUserByUsername(username);

                const otherUser = await getUserByUsername(otherUsername);

                console.log('otherUser:', otherUser);

                const blckdLst = await getBlockedUsersByUser(otherUser.$id);

                console.log(`blckdLst by ${otherUser.username}:`, blckdLst);

                // Checking if the other has blocked user 
                if (blckdLst.length !== 0) {
                    const blockedId = blckdLst.filter((blocked) => blocked.blocked_id === user.$id);

                    if (blockedId.length !== 0) {
                        console.log('blockedId', blockedId);
                        setIsBlocked(true);
                    }
                }

                // Checks true if other user blocked user


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

    // Fetch spreads and users' data for spreads tab 
    useEffect(() => {
        const fetchSpreadNotices = async () => {
            setIsLoadingMoreSpreads(true);
            try {
                const allSpreadNotices = await getAllSpreadNotices(currUserId, limitSpreads, offsetSpreads);

                console.log('allSpreadNotices', allSpreadNotices);


                if (allSpreadNotices?.length < limitSpreads) {
                    setHasMoreSpreads(false);
                } else {
                    setHasMoreSpreads(true);
                }

                await fetchUsersData(allSpreadNotices, setSpreadNoticesData, avatarUtil);
            } catch (error) {
                console.error('Error fetching spreads - ', error);
            } finally {
                setIsLoadingMoreSpreads(false);
            }

        };
        // if (isBlocked === false) {
        //     fetchSpreadNotices();
        // } else {
        //     console.log('This user blocked you.');
        // }
        callFunctionIfNotBlocked(fetchSpreadNotices);
    }, [currUserId, offsetSpreads])

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
    // Reactions For Spreads tab
    // useEffect(() => {
    //     fetchReactionsForNotices(spreadNoticesData, setSpreadReactions);
    // }, [spreadNoticesData]);
    // Reactions For Likes tab
    // useEffect(() => {
    //     fetchReactionsForNotices(likedNoticesData, setLikedReactions);
    // }, [likedNoticesData]);

    // Fetch accounts following the other user
    useEffect(() => {
        if (currUserId && user_id && (isBlocked === false)) {
            fetchAccountsFollowingTheUser(currUserId, user_id);
        } else {
            console.log('This user blocked you. - follow(ing/er)');
        }
    }, [currUserId, user_id])

    // Fetch accounts followed by other user
    useEffect(() => {
        if (currUserId && (isBlocked === false)) {
            fetchAccountsFollowedByUser(currUserId);
        } else {
            console.log('This user blocked you. - follow(ing/er)');
        }
    }, [currUserId])

    const handleLike = async (notice) => {
        try {
            await likeNotice(notice.$id, notice.user_id);
        } catch (error) {
            console.error('Could not like notice');
        }
    }

    const handleSpread = async (notice) => {
        try {
            await spreadNotice(notice.$id, notice.user_id);
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

    const handleReact = async (currUserId, content, notice_id) => {
        try {
            await sendReaction(currUserId, content, notice_id);
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

            console.log(localStorage.getItem('passcode'));

            console.log('passcode', passcode);

            if (psscd[0].passcode === passcode) {
                setAccountTypeCheck(true);
            }
            console.log('accountTypeCheck', accountTypeCheck);

        } catch (error) {
            console.error('Error checking passcode:', error);
        }
    }


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
                    followingAccounts={followingAccounts}
                    followersAccounts={followersAccounts}
                    followersCount={followersCount}
                    followingCount={followingCount}
                    isFollowing={isFollowing}
                    isFollowingLoading={isFollowingLoading}
                    handleFollow={handleFollow}
                    handleBlock={handleBlock}
                />
                {
                    isBlocked ?
                        <div style={{ color: 'white', marginTop: '198px' }}>You are not authorzied to view the notices shared by {otherUsername}.</div>
                        :
                        <>
                            <Tabs
                                defaultActiveKey="notices"
                                id="notices-tabs"
                                justify
                                className='user-profile__notice-tab 
                fixed-bottom
                '
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
                                                spreadNotices={spreadNotices}
                                                reactions={noticesReactions}
                                                handleLike={handleLike}
                                                handleSpread={handleSpread}
                                                handleReport={handleReport}
                                                handleReact={handleReact}
                                                getReactionsForNotice={getReactionsForNotice}
                                                eventKey='notices'
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

                                {/* SPREADS TAB */}
                                <Tab
                                    eventKey='spreads'
                                    title="Spreads"
                                >
                                    {spreadNoticesData.length !== 0 ?
                                        <>
                                            <Notices
                                                notices={spreadNoticesData}
                                                user_id={user_id}
                                                likedNotices={likedNotices}
                                                spreadNotices={spreadNotices}
                                                // reactions={spreadReactions}
                                                handleLike={handleLike}
                                                handleSpread={handleSpread}
                                                handleReport={handleReport}
                                                handleReact={handleReact}
                                                getReactionsForNotice={getReactionsForNotice}
                                            />
                                            <div className="d-flex justify-content-center mt-4">
                                                {hasMoreSpreads ?
                                                    <Button
                                                        onClick={() => setOffsetSpreads(offset + limit)}
                                                        disabled={isLoadingMoreSpreads || !hasMoreSpreads}
                                                    >
                                                        {isLoadingMoreSpreads ?
                                                            <><Loading size={24} /> Loading...</>
                                                            : 'Load More'}
                                                    </Button>
                                                    : 'No more spreads'}
                                            </div>
                                        </>
                                        : 'No spreadas yet'}
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
                                                spreadNotices={spreadNotices}
                                                // reactions={likedReactions}
                                                handleLike={handleLike}
                                                handleSpread={handleSpread}
                                                handleReport={handleReport}
                                                handleReact={handleReact}
                                                getReactionsForNotice={getReactionsForNotice}
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
                }




            </>
        </>
    )
}

export default OtherUserProfile;