import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { Profile } from '../../../components/User/Profile/Profile.jsx';
import { Notices } from '../../../components/User/Notices.jsx';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { useUserInfo } from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import { useUserAvatar } from '../../../lib/hooks/useUserAvatar.js';
import { useNotices } from '../../../lib/hooks/useNotices.js';
import { screenUtils } from '../../../lib/utils/screenUtils.js';
import { Passcode } from '../../../components/User/Passcode.jsx';
import { LoadingSpinner } from '../../../components/Loading/LoadingSpinner.jsx';
import { EndAsterisks } from '../../../components/User/EndAsterisks.jsx';
import { NoticesPlaceholder } from '../../../components/User/NoticesPlaceholder.jsx';


const OtherUserProfile = () => {

    let { otherUsername } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        username,
        userId,
        userEmail,
        isAppLoading, isFetchingUserinContextLoading
    } = useOutletContext();

    const [currUserId, setCurrUserId] = useState(null);

    const {
        noticesReactions,
        setFellowUserId,
        handleLike,
        handleSave,
        handleReportNotice,
        getNoticeByUserId,
        getAllLikedNotices,
        getAllSavedNotices,
        handleReact,
        getReactionsForNotice,
        getReactionByReactionId,
        reportReaction,
        fetchUserLikes,
        fetchUserSaves,
        getUserPermissions,
        getAllLikesTotalByNoticeId,
        getAllSavesTotalByNoticeId,
    } = useNotices();

    const {
        isFollowingUserLoading,
        isInitialFollowCheckLoading,
        isFollowing,
        isotherUserFollowingMeCheckLoading,
        isOtherUserFollowingMe,
        followersCount,
        followingCount,
        isProcessingBlock,
        isGetFollwedByUserCountLoading,
        isGetFollowingTheUserCountLoading,
        checkIsOtherUserBlockedByUser,
        checkIsUserBlockedByOtherUser,
        handleBlock,
        getUserByUsername,
        getUserAccountByUserId,
        getUsersByIdQuery,
        fetchUsersData,
        handleFollow,
        getFollowStatus,
        getFollowingStatus,
        getfollwedByUserCount,
        getFollowingTheUserCount,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        getPassocdeByOrganizationId,
        handleUserReport
    } = useUserInfo();

    const { isSmallScreen } = screenUtils();

    const [accountType, setAccountType] = useState(null);
    const [accountTypeCheck, setAccountTypeCheck] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [isCheckingPasscode, setIsCheckingPasscode] = useState(false);
    const [isPasscodeIncorrect, setIsPasscodeIncorrect] = useState(false);
    const [otherUserWebsite, setOtherUserWebsite] = useState(null);

    const [isOtherUserLoading, setIsOtherUserLoading] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isOtherUserBlocked, setIsOtherUserBlocked] = useState(false);

    const [otherUserNotices, setOtherUserNotices] = useState([]);
    const [savedNoticesData, setSavedNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl, isAvatarLoading, fetchUserAvatarForProfile } = useUserAvatar(currUserId);

    const [followingAccounts, setFollowingAccounts] = useState([]);
    const [followersAccounts, setFollowersAccounts] = useState([]);

    // Notices Tab
    const [limitNotices] = useState(10);
    const [offsetNotices, setOffsetNotices] = useState(0);
    const [hasMoreNotices, setHasMoreNotices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [likedNotices, setLikedNotices] = useState([]);
    const [savedNotices, setSavedNotices] = useState([]);
    const [btnPermission, setBtnPermission] = useState(null);
    const [txtPermission, setTxtPermission] = useState(null);
    const [isLoadingNotices, setIsLoadingNotices] = useState(false);

    // Saves Tab
    const [limitSaves] = useState(5);
    const [offsetSaves, setOffsetSaves] = useState(0);
    const [hasMoreSaves, setHasMoreSaves] = useState(true);
    const [isLoadingMoreSaves, setIsLoadingMoreSaves] = useState(false);
    const [isSavesClicked, setIsSavesClicked] = useState(false);
    const [isLoadingSaves, setIsLoadingSaves] = useState(false);

    // Likes Tab
    const [limitLikes] = useState(5);
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
    const [eventKey, setEventKey] = useState('notices');

    // Check for username vs. otherUsername
    useEffect(() => {
        if (otherUsername === username) {
            navigate('/user/profile');
        }
    }, [otherUsername, username, navigate]);

    //THIS IS MY ID
    useEffect(() => {
        console.log('THIS IS MY ID:', userId);
    }, [userId]);

    // Scroll to top on pathname(location) change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // Hello
    useEffect(() => {
        console.log('Barev', username);
    }, [username]);
    useEffect(() => {
        console.log('userId', userId);
    }, [userId]);
    useEffect(() => {
        console.log('userEmail', userEmail);
    }, [userEmail]);

    // Get Other User
    useEffect(() => {
        const getCurrUser = async () => {
            try {

                if (!username) {
                    return;
                }

                setIsOtherUserLoading(true);
                console.log('otherUsername', otherUsername);

                const [otherUserRes, userRes] = await Promise.allSettled([
                    getUserByUsername(otherUsername),
                    getUserByUsername(username)
                ]);

                if (otherUserRes.status === 'fulfilled' && userRes.status === 'fulfilled') {
                    const otherUser = otherUserRes.value;
                    const user = userRes.value;

                    console.log('otherUser useEffect OtherUserProfile:', otherUser, otherUser.$id);
                    console.log('user useEffect OtherUserProfile:', user, user.$id);

                    const [
                        isOtherUserBlockedByUserRes,
                        isUserBlockedByOtherUserRes
                    ] = await Promise.allSettled([
                        checkIsOtherUserBlockedByUser(user.$id, otherUser.$id),
                        checkIsUserBlockedByOtherUser(otherUser.$id, user.$id),
                    ]);

                    if (isOtherUserBlockedByUserRes.status === 'fulfilled') {
                        const blckdByUser = isOtherUserBlockedByUserRes.value;

                        if (blckdByUser === true) {
                            console.log('isOtherUserBlocked ', blckdByUser);
                            setIsOtherUserBlocked(true);
                        }
                    } else {
                        console.error('Error fetching blocked users by otherUser:', isOtherUserBlockedByUserRes.reason);
                    }

                    if (isUserBlockedByOtherUserRes.status === 'fulfilled') {
                        const blckdByOtherUser = isUserBlockedByOtherUserRes.value;

                        if (blckdByOtherUser === true) {
                            console.log('isUserBlockedByOtherUser ', blckdByOtherUser);
                            setIsBlocked(true);
                        }
                    } else {
                        console.error('Error fetching blocked users by user:', isUserBlockedByOtherUserRes.reason);
                    }

                    if (otherUser) {
                        console.log('THIS IS OTHER USER:', otherUser);

                        setCurrUserId(prevId => (prevId !== otherUser.$id ? otherUser.$id : prevId));
                        setFellowUserId(prevId => (prevId !== otherUser.$id ? otherUser.$id : prevId));
                        setAccountType(otherUser.accountType);
                        setOtherUserWebsite(otherUser.website);

                        const permissions = await getUserPermissions(otherUser.$id);
                        console.log('permissions', permissions);
                        if (permissions !== undefined) {
                            setBtnPermission(permissions.btns_reaction_perm ?? true);
                            setTxtPermission(permissions.txt_reaction_perm ?? true);
                        }

                        fetchUserAvatarForProfile(otherUser.$id);

                    }
                } else {
                    console.error('Error fetching users:', otherUserRes.reason || userRes.reason);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsOtherUserLoading(false);
            }
        }
        setIsOtherUserBlocked(false);
        setIsBlocked(false);
        getCurrUser();
    }, [username, otherUsername])

    // CurrUserId
    useEffect(() => {
        console.log('CurrUserId', currUserId);
    }, [currUserId])

    // Set tab back to 'Notices' when user changes
    useEffect(() => {
        setEventKey('notices');
    }, [currUserId])

    // Fetch notices for other user 
    useEffect(() => {
        setIsLoadingMore(true);

        const fetchNotices = async () => {

            if (!currUserId) {
                console.log('Get back to me when the user\'s info loads.');
                return;
            }

            if (offsetNotices === 0) {
                setIsLoadingNotices(true);
            } else {
                setIsLoadingMore(true);
            }

            try {

                console.log('user_id, limit, offset', { currUserId, limitNotices, offsetNotices });

                const usrNtcs = await getNoticeByUserId(currUserId, limitNotices, offsetNotices);

                console.log('usrNtcs in OtherUserProfile:', usrNtcs);

                if (!Array.isArray(usrNtcs) || usrNtcs.length === 0) {
                    console.log("The user has not posted anything.");
                    setHasMoreNotices(false);
                    return;
                }

                console.log('HAKOBOS', usrNtcs);

                const ntcsIds = usrNtcs?.map(ntc => ntc.$id);

                console.log('nstNtcsIds', ntcsIds);

                const [lkdNtcsRes, svdNtcsRes] = await Promise.allSettled([
                    fetchUserLikes(userId, ntcsIds),
                    fetchUserSaves(userId, ntcsIds)
                ]);

                if (lkdNtcsRes.status === 'fulfilled') {

                    const lkdNtcs = lkdNtcsRes.value;

                    console.log('lkdNtcs - OG NOTICES', lkdNtcs);

                    setLikedNotices(prevLikes => {
                        const updatedLikes = { ...prevLikes };
                        lkdNtcs.forEach(like => {
                            updatedLikes[like.notice_id] = like.$id;
                        });
                        return updatedLikes;
                    });
                }

                if (svdNtcsRes.status === 'fulfilled') {

                    const svdNtcs = svdNtcsRes.value;

                    console.log('svdNtcs - OG NOTICES', svdNtcs);

                    setSavedNotices(prevSaves => {
                        const updatedSaves = { ...prevSaves };
                        svdNtcs.forEach(save => {
                            updatedSaves[save.notice_id] = save.$id;
                        });
                        return updatedSaves;
                    });
                }

                const [allLikes, allSaves] = await Promise.all([
                    getAllLikesTotalByNoticeId(ntcsIds),
                    getAllSavesTotalByNoticeId(ntcsIds)
                ]);

                console.log('TOTAL LIKES:', allLikes);
                console.log('TOTAL SAVES:', allSaves);

                const likesCountMap = new Map();
                const savesCountMap = new Map();

                for (const like of allLikes) {
                    const noticeId = like.notice_id;
                    likesCountMap.set(noticeId, (likesCountMap.get(noticeId) || 0) + 1);
                }

                for (const save of allSaves) {
                    const noticeId = save.notice_id;
                    savesCountMap.set(noticeId, (savesCountMap.get(noticeId) || 0) + 1);
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

                setOtherUserNotices(prev => [...prev, ...noticesWithLikesAndSaves]);

                if (usrNtcs?.length < limitNotices) {
                    setHasMoreNotices(false);
                } else {
                    setHasMoreNotices(true);
                }
            } catch (error) {
                console.error('Error fetching notices - ', error);
            } finally {
                if (offsetNotices === 0) {
                    setIsLoadingNotices(false);
                }
                setIsLoadingMore(false);
            }
        };

        callFunctionIfNotBlocked(fetchNotices);

    }, [currUserId, offsetNotices])

    // Reset the notices/saves/likes and offset by currUserId change
    useEffect(() => {
        setOffsetNotices(0);
        setOtherUserNotices([]);
        setOffsetSaves(0);
        setSavedNoticesData([]);
        setOffsetLikes(0);
        setLikedNoticesData([]);
    }, [currUserId])

    // Call function only if user is not blocked
    const callFunctionIfNotBlocked = async (functionName) => {
        if (isBlocked === false) {
            try {
                await functionName();
            } catch (error) {
                console.log('Error running function:', error);
            }
        } else {
            console.log('This user blocked you.');
        }
    }

    // Fetch saves and users' data for saves tab 
    useEffect(() => {
        const fetchSaveNotices = async () => {

            if (!currUserId) {
                console.log('Get back to me when the user\'s info loads.');
                return;
            }

            if (offsetSaves === 0) {
                setIsLoadingSaves(true);
            } else {
                setIsLoadingMoreSaves(true);
            }

            try {
                console.log('currUserId - allSavedNotices', currUserId);

                const allSavedNotices = await getAllSavedNotices(currUserId, userId, limitSaves, offsetSaves);

                if (!Array.isArray(allSavedNotices) || allSavedNotices.length === 0) {
                    console.log("They have not saved anything.");
                    setHasMoreNotices(false);
                    return;
                }

                console.log('allSavedNotices', allSavedNotices);

                const noticesWithoutTypeOrganization = allSavedNotices.filter((savedNotice) => savedNotice.noticeType !== 'organization');

                console.log('noticesWithoutTypeOrganization', noticesWithoutTypeOrganization);

                const ntcsIds = noticesWithoutTypeOrganization?.map(ntc => ntc.$id);

                const [lkdNtcsRes, svdNtcsRes] = await Promise.allSettled([
                    fetchUserLikes(userId, ntcsIds),
                    fetchUserSaves(userId, ntcsIds)
                ]);

                if (lkdNtcsRes.status === 'fulfilled') {

                    const lkdNtcs = lkdNtcsRes.value;

                    setLikedNotices(prevLikes => {
                        const updatedLikes = { ...prevLikes };
                        lkdNtcs.forEach(like => {
                            updatedLikes[like.notice_id] = like.$id;
                        });
                        return updatedLikes;
                    });
                }

                if (svdNtcsRes.status === 'fulfilled') {

                    const svdNtcs = svdNtcsRes.value;

                    setSavedNotices(prevSaves => {
                        const updatedSaves = { ...prevSaves };
                        svdNtcs.forEach(save => {
                            updatedSaves[save.notice_id] = save.$id;
                        });
                        return updatedSaves;
                    });
                }

                if (allSavedNotices?.length < limitSaves) {
                    setHasMoreSaves(false);
                } else {
                    setHasMoreSaves(true);
                }

                console.log('SAVE - noticesWithoutTypeOrganization', noticesWithoutTypeOrganization);

                await fetchUsersData(noticesWithoutTypeOrganization, setSavedNoticesData, avatarUtil);
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
            callFunctionIfNotBlocked(fetchSaveNotices);
        }

    }, [currUserId, offsetSaves, isSavesClicked])

    // Fetch likes and users' data for likes tab  
    useEffect(() => {
        const fetchLikedNotices = async () => {

            if (!currUserId) {
                console.log('Get back to me when the user\'s info loads.');
                return;
            }

            if (offsetLikes === 0) {
                setIsLoadingLikes(true);
            } else {
                setIsLoadingMoreLikes(true);
            }

            try {
                const allLikedNotices = await getAllLikedNotices(currUserId, userId, limitLikes, offsetLikes);

                if (!Array.isArray(allLikedNotices) || allLikedNotices.length === 0) {
                    console.log("They have not liked anything.");
                    setHasMoreNotices(false);
                    return;
                }

                console.log('allLikedNotices - OtherUserProfile', allLikedNotices);

                const noticesWithoutTypeOrganization = allLikedNotices.filter((likedNotice) => likedNotice.noticeType !== 'organization');

                console.log('noticesWithoutTypeOrganization', noticesWithoutTypeOrganization);

                const ntcsIds = noticesWithoutTypeOrganization?.map(ntc => ntc.$id);

                const [lkdNtcsRes, svdNtcsRes] = await Promise.allSettled([
                    fetchUserLikes(userId, ntcsIds),
                    fetchUserSaves(userId, ntcsIds)
                ]);

                if (lkdNtcsRes.status === 'fulfilled') {

                    const lkdNtcs = lkdNtcsRes.value;

                    setLikedNotices(prevLikes => {
                        const updatedLikes = { ...prevLikes };
                        lkdNtcs.forEach(like => {
                            updatedLikes[like.notice_id] = like.$id;
                        });
                        return updatedLikes;
                    });
                }

                if (svdNtcsRes.status === 'fulfilled') {

                    const svdNtcs = svdNtcsRes.value;

                    setSavedNotices(prevSaves => {
                        const updatedSaves = { ...prevSaves };
                        svdNtcs.forEach(save => {
                            updatedSaves[save.notice_id] = save.$id;
                        });
                        return updatedSaves;
                    });
                }

                await fetchUsersData(noticesWithoutTypeOrganization, setLikedNoticesData, avatarUtil);

                if (allLikedNotices?.length < limitLikes) {
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
            callFunctionIfNotBlocked(fetchLikedNotices);
        }

    }, [currUserId, offsetLikes, isLikesClicked])

    // The Saves and Likes data don't fetch unless isClicked === true
    useEffect(() => {
        if (eventKey === 'saves') {
            setIsSavesClicked(true);
        } else if (eventKey === 'likes') {
            setIsLikesClicked(true);
        }
    }, [eventKey]);

    useEffect(() => {
        console.log('isLoadingMoreLikes updated:', isLoadingMoreLikes);
    }, [isLoadingMoreLikes]);

    // Fetch accounts following the other user
    const loadFollowers = async () => {
        if (!hasMoreFollowers || isLoadingMoreFollowers) return;
        try {
            setIsLoadingMoreFollowers(true);

            const accountsFollowingTheUser = await fetchAccountsFollowingTheUser(currUserId, limitFollowers, offsetFollowers);

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

    //Fetch follow status
    useEffect(() => {
        getFollowStatus(userId, currUserId);
    }, [userId, currUserId])

    //Is otherUser following me?
    useEffect(() => {
        getFollowingStatus(currUserId);
    }, [currUserId])

    // Fetch followers count
    useEffect(() => {
        getFollowingTheUserCount(currUserId);
    }, [currUserId, isFollowing])

    // Fetch following count
    useEffect(() => {
        getfollwedByUserCount(currUserId);
    }, [currUserId])

    // Fetch accounts followed by the other user
    const loadFollowing = async () => {
        if (!hasMoreFollowing || isLoadingMoreFollowing) return;
        try {
            setIsLoadingMoreFollowing(true);

            const accountsFollowedByUser = await fetchAccountsFollowedByUser(currUserId, limitFollowing, offsetFollowing);

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
    }

    // Restting follow(ing/ers) data
    useEffect(() => {
        if (currUserId) {
            console.log('Current User ID changed:', currUserId);
            setFollowingAccounts([]);
            setOffsetFollowing(0);
            setHasMoreFollowing(true);
            setFollowersAccounts([]);
            setOffsetFollowers(0);
            setHasMoreFollowers(true);
        }
    }, [currUserId]);

    // checking passocde for organization
    const checkPasscode = async () => {
        setIsCheckingPasscode(true);
        try {
            console.log('accountTypeCheck', accountTypeCheck);

            const psscd = await getPassocdeByOrganizationId(currUserId);

            // localStorage.setItem('passcode', passcode);

            // console.log('Stored passcode in localStorage:', localStorage.getItem('passcode'));

            if (psscd[0].passcode === passcode) {
                setAccountTypeCheck(true);
                setIsPasscodeIncorrect(false);
            } else {
                setIsPasscodeIncorrect(true);
            }

        } catch (error) {
            console.error('Error checking passcode:', error);
        } finally {
            setIsCheckingPasscode(false);
        }
    }

    useEffect(() => {
        console.log('accountTypeCheck', accountTypeCheck);
    }, [accountTypeCheck])

    useEffect(() => {
        console.log('Pathname:', location.pathname);
        console.log('Event Key:', eventKey);
    }, [eventKey])

    useEffect(() => {
        console.log('savedNoticesData', savedNoticesData);
        console.log('savedNoticesData.length', savedNoticesData.length);

    }, [savedNoticesData])

    const noticeTabs = [
        {
            key: 'saves',
            title: 'Saves',
            data: savedNoticesData,
            isLoading: isLoadingSaves,
            hasMore: hasMoreSaves,
            isLoadingMore: isLoadingMoreSaves,
            offset: offsetSaves,
            limit: limitSaves,
            setOffset: setOffsetSaves,
            placeholderSection: 'saved',
            icon: <i className='bi bi-floppy' />,
            loadingText: `Loading ${otherUsername}'s saves...`,
        },
        {
            key: 'likes',
            title: 'Likes',
            data: likedNoticesData,
            isLoading: isLoadingLikes,
            hasMore: hasMoreLikes,
            isLoadingMore: isLoadingMoreLikes,
            offset: offsetLikes,
            limit: limitLikes,
            setOffset: setOffsetLikes,
            placeholderSection: 'liked',
            icon: <i className='bi bi-hand-thumbs-up' />,
            loadingText: `Loading ${otherUsername}'s likes...`,
        },
    ];

    if (isOtherUserLoading || isAppLoading || isFetchingUserinContextLoading || isInitialFollowCheckLoading) {
        return <div className='other-user-profile__loading'>
            <div>
                <LoadingSpinner />
                <span className='ms-2'>
                    Loading {otherUsername}'s profile
                </span>
            </div>
        </div>;
    }

    if (accountType === 'organization' && accountTypeCheck === false) {
        return <Passcode
            passcode={passcode}
            isCheckingPasscode={isCheckingPasscode}
            isPasscodeIncorrect={isPasscodeIncorrect}
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
                    website={otherUserWebsite}
                    isBlocked={isBlocked}
                    isOtherUserBlocked={isOtherUserBlocked}
                    followingAccounts={followingAccounts}
                    followersAccounts={followersAccounts}
                    followersCount={followersCount}
                    followingCount={followingCount}
                    isFollowing={isFollowing}
                    isFollowingUserLoading={isFollowingUserLoading}
                    isInitialFollowCheckLoading={isInitialFollowCheckLoading}
                    isOtherUserFollowingMe={isOtherUserFollowingMe}
                    isAvatarLoading={isAvatarLoading}
                    isGetFollowingTheUserCountLoading={isGetFollowingTheUserCountLoading}
                    isGetFollwedByUserCountLoading={isGetFollwedByUserCountLoading}
                    hasMoreFollowers={hasMoreFollowers}
                    hasMoreFollowing={hasMoreFollowing}
                    isLoadingMoreFollowing={isLoadingMoreFollowing}
                    isLoadingMoreFollowers={isLoadingMoreFollowers}
                    isProcessingBlock={isProcessingBlock}
                    handleFollow={handleFollow}
                    handleBlock={handleBlock}
                    handleUserReport={handleUserReport}
                    loadFollowers={loadFollowers}
                    loadFollowing={loadFollowing}
                />
                <>
                    {!isBlocked ?
                        <div style={{ marginTop: !isSmallScreen ? '180px' : '170px' }}>
                            <Tabs
                                activeKey={eventKey}
                                defaultActiveKey='notices'
                                id="notices-tabs"
                                justify
                                className='user-profile__notice-tab fixed-bottom'
                                onSelect={(key) => setEventKey(key)}
                            >
                                {/* Notices */}
                                <Tab
                                    eventKey='notices'
                                    title="Notices"
                                >
                                    {!isLoadingNotices ?
                                        (otherUserNotices?.length !== 0 ?
                                            <>
                                                <Notices
                                                    notices={otherUserNotices}
                                                    likedNotices={likedNotices}
                                                    savedNotices={savedNotices}
                                                    reactions={noticesReactions}
                                                    eventKey={eventKey}
                                                    user_id={userId}
                                                    isOtherUserBlocked={isOtherUserBlocked}
                                                    btnPermission={btnPermission}
                                                    txtPermission={txtPermission}
                                                    handleLike={handleLike}
                                                    setLikedNotices={setLikedNotices}
                                                    handleSave={handleSave}
                                                    setSavedNotices={setSavedNotices}
                                                    handleReportNotice={handleReportNotice}
                                                    handleReact={handleReact}
                                                    getReactionsForNotice={getReactionsForNotice}
                                                    getUserAccountByUserId={getUserAccountByUserId}
                                                    getUsersByIdQuery={getUsersByIdQuery}
                                                    getReactionByReactionId={getReactionByReactionId}
                                                    reportReaction={reportReaction}
                                                />
                                                <div className="d-flex justify-content-center my-4 pb-5">
                                                    {hasMoreNotices ?
                                                        <Button
                                                            onClick={() => setOffsetNotices(offsetNotices + limitNotices)}
                                                            disabled={isLoadingMore || !hasMoreNotices}
                                                            className='user-profile__load-more-notices-btn'
                                                        >
                                                            {isLoadingMore ?
                                                                <><LoadingSpinner size={24} /> Loading...</>
                                                                : 'Load More'}
                                                        </Button>
                                                        :
                                                        <EndAsterisks componentName='notices' />
                                                    }
                                                </div>
                                            </>
                                            :
                                            <NoticesPlaceholder location={location}
                                                otherUsername={otherUsername}
                                            />
                                        ) :
                                        <div className='d-flex justify-content-center pt-5'>
                                            <LoadingSpinner /><span className='ms-2'>Loading {otherUsername}'s notices...</span>
                                        </div>
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
                                                        user_id={userId}
                                                        username={username}
                                                        likedNotices={likedNotices}
                                                        savedNotices={savedNotices}
                                                        eventKey={eventKey}
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
                                                    <div className="d-flex justify-content-center pt-4 pb-5">
                                                        {tab.hasMore ? (
                                                            <Button
                                                                onClick={() => tab.setOffset(tab.offset + tab.limit)}
                                                                disabled={tab.isLoadingMore || !tab.hasMore}
                                                                className="user-profile__load-more-notices-btn"
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
                                                            <EndAsterisks componentName="notices" />
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <NoticesPlaceholder
                                                    location={location}
                                                    otherUsername={otherUsername}
                                                    section={tab.placeholderSection}
                                                    icon={tab.icon}
                                                />
                                            )
                                        ) : (
                                            <div className="d-flex justify-content-center pt-5">
                                                <LoadingSpinner />
                                                <span className="ms-2">{tab.loadingText}</span>
                                            </div>
                                        )}
                                    </Tab>
                                ))}


                            </Tabs>
                        </div>
                        :
                        <div style={{ color: 'white', textAlign: 'center', marginTop: '223px' }}>
                            {/* <i className='bi bi-sign-dead-end-fill user-profile__blocked-icon' /> */}
                            {/* <i className='bi bi-sign-dead-end user-profile__blocked-icon' /> */}
                            <i className='bi bi-ban user-profile__blocked-icon' />
                            <br />
                            <p className='mb-0 user-profile__blocked-text'>
                                U-uh... what did you do? <span className='user-profile__blocked-text-icon'>👀</span>
                                <br />
                                <strong>{otherUsername}</strong> has blocked you from accessing their account.
                            </p>
                            {/* <br /> */}
                        </div>
                    }
                </>
            </>
        </>
    )
}

export default OtherUserProfile;