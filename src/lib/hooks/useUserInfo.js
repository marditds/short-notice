import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAccount as fetchAccount, createBlock, getBlockedUsersByUser as fetchBlockedUsersByUser, getBlockedUsersByUserByBatch as fetchBlockedUsersByUserByBatch, getUsersBlockingUser as fetchUsersBlockingUser, removeBlockUsingBlockedId, checkIdExistsInAuth, checkEmailExistsInAuth as checkEmailInAuthFromServer, registerAuthUser, getUserById, getUserByIdQuery as fetchUserByIdQuery, getUsersByIdQuery as fetchUsersByIdQuery, deleteAuthUser, createUserSession, getSessionDetails as fetchSessionDetails, deleteUserSession, updateUser, updateUserWebsite as updtUsrWbst, updateAuthUser, deleteUser, getUserByUsername as fetchUserByUsername, getAllUsersByString as fetchAllUsersByString, deleteAllNotices, deleteAllSentReactions, removeAllSavesByUser, removeAllLikesByUser, removeAllFollows, removeAllFollowed, getUsersDocument, createFollow, unfollow, getUserFollowingsById, getUserFollowersById, followedByUserCount, followingTheUserCount, getPersonalFeedAccounts as fetchPersonalFeedAccounts, createPassocde, updatePassocde, getPassocdeByOrganizationId as fetchPassocdeByOrganizationId, createUserReport, getFollowStatus as fetchFollowStatus, getFollowingStatus as fetchFollowingStatus, isUserBlockedByOtherUser, isOtherUserBlockedByUser, deletePassocde, updateAuthPassword as changeAuthPassword, checkUsernameExists as doesUsernameExists, removeAllBlocksForBlocker, removeAllBlocksForBlocked, deleteUserInterestsFromDB, getAllLikesByNoticeId, getUserPermissionsByIdQuery, getAllSavesByNoticeId
} from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';
import { useUserAvatar } from './useUserAvatar';

export const useUserInfo = () => {

    const { userId, setUsername, accountType } = useUserContext();

    const {
        avatarUrl,
        extractFileIdFromUrl,
        handleDeleteAvatarFromStrg
    } = useUserAvatar(userId);

    const navigate = useNavigate();

    const [isFetchingUsersData, setIsFetchingUsersData] = useState(false);

    const [following, setFollowing] = useState({});
    const [followersCount, setFollowersCount] = useState(null);
    const [followingCount, setFollowingCount] = useState(null);

    const [isGetFollwedByUserCountLoading, setIsGetFollwedByUserCountLoading] = useState(false);
    const [isGetFollowingTheUserCountLoading, setIsGetFollowingTheUserCountLoading] = useState(false);

    // Am I following the otherUser
    const [isFollowingUserLoading, setIsFollowingUserLoading] = useState(false);
    const [isInitialFollowCheckLoading, setIsInitialFollowCheckLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    // Is otherUser following me?
    const [isotherUserFollowingMeCheckLoading, setIsotherUserFollowingMeCheckLoading] = useState(false);
    const [isOtherUserFollowingMe, setIsOtherUserFollowingMe] = useState(false);

    const [isProcessingBlock, setIsProcessingBlock] = useState(false);

    const getAccount = async () => {
        try {
            const accnt = await fetchAccount();

            console.log('Success getting account:', accnt);

            return accnt;
        } catch (error) {
            console.error('Error getting account:', error);
        }
    }

    const registerUser = async (id, email, username) => {

        if (!id || !email || !username) {
            return;
        }

        try {
            const newAuthUsr = await registerAuthUser(id, email, username);
            console.log('newAuthUsr - useUserInfo:', newAuthUsr);

            return newAuthUsr;
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    const createSession = async (email) => {

        if (!email) {
            return;
        }

        try {
            const usrSession = await createUserSession(email);
            return usrSession;
        } catch (error) {
            console.error('Error creating session:', error);
        }
    }

    const getSessionDetails = async () => {
        try {
            const sessionDetails = await fetchSessionDetails();
            console.log('sessionDetails', sessionDetails);
            return sessionDetails;
        } catch (error) {
            console.error('Error gettin session details:', error);

        }
    }

    const removeSession = async () => {
        try {
            const usrSession = await deleteUserSession();
            return usrSession;
        } catch (error) {
            console.error('Error removing session:', error);
        }
    }

    const checkUsernameExists = async (username) => {

        if (!username) {
            return;
        }

        try {
            const usernameExists = await doesUsernameExists(username);

            if (usernameExists) {
                return 'Username already taken.';
            }

        } catch (error) {
            console.error('Error checking username:', error);
            return 'Something went wrong. Try again later.'
        }
    }

    const handleUpdateUser = async (username) => {

        if (!userId || !username) {
            return;
        }

        try {
            console.log('userId', userId);

            const res = await updateUser({ userId, username });

            const authRes = await updateAuthUser(username);

            setUsername(username);

            console.log('Username updated successfully - collection.', res);
            console.log('Username updated successfully - atuh.', authRes);

            return { res, authRes }

        } catch (error) {
            console.error('Error updating the username:', error);

        }
    }

    const updateAuthPassword = async (newPassword, oldPassword) => {

        if (!newPassword || !oldPassword) {
            return;
        }

        try {
            const res = await changeAuthPassword(newPassword, oldPassword);
            return res;
        } catch (error) {
            console.error('Error updating auth password:', error);
        }
    }

    const updateUserWebsite = async (website) => {

        if (!website) {
            return;
        }

        try {
            console.log('website', website);

            const res = await updtUsrWbst({ userId, website });

            console.log('userWebsite updated successfully.', res);
            return res;
        } catch (error) {
            console.error('Error updating the userWebsite:', error);
        }
    }

    const handleDeleteUser = async () => {
        try {

            await Promise.allSettled([
                deleteAllNotices(userId),
                deleteAllSentReactions(userId),
                removeAllSavesByUser(userId),
                removeAllLikesByUser(userId),
                removeAllFollows(userId),
                removeAllFollowed(userId),
                removeAllBlocksForBlocker(userId),
                removeAllBlocksForBlocked(userId),
                deleteUserInterestsFromDB(userId)
            ]);

            if (accountType === 'organization') {
                await deletePassocde(userId);
            }

            if (avatarUrl) {
                const fileId = extractFileIdFromUrl(avatarUrl);
                await handleDeleteAvatarFromStrg(fileId);
            }

            await deleteUser(userId);
            await deleteAuthUser(userId);

            console.log('User deleted successfully.');
            return 'Hajogh';
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    const checkingIdInAuth = async () => {
        try {
            const res = await checkIdExistsInAuth();
            return res;
        } catch (error) {
            console.error('Error checkingIdInAuth:', res);
        }
    }

    const checkingEmailInAuth = async (email) => {

        if (!email) {
            return;
        }

        try {
            console.log('this email will be sent - useserInfo:', email);

            const res = await checkEmailInAuthFromServer(email);
            return res;
        } catch (error) {
            console.error('Error checkingEmailInAuth:', res);
        }
    }

    const getUserByUsername = async (username) => {

        if (!username) {
            return;
        }

        console.log('getUserByUsername in useUserInfo', username);

        try {
            const usrnm = await fetchUserByUsername(username);
            console.log('username found:', usrnm);
            return usrnm;
        } catch (error) {
            console.error('Error getting user by username:', error);
        }

    }

    const getAllUsersByString = async (username, limit, cursorAfter) => {

        if (username == null || limit == null) {
            console.log(`Missing required parameter:`, { username, limit });
            return;
        }

        try {
            const usrnm = await fetchAllUsersByString(username, limit, cursorAfter);
            console.log('username found:', usrnm);
            return usrnm;
        } catch (error) {
            console.error('Error getting user by username:', error);
        }
    };

    // const getUsersData = useCallback(async () => {
    //     try {
    //         const response = await getUsersDocument();
    //         return response;
    //     } catch (error) {
    //         console.error('Error getting users data:', error);

    //     }
    // }, [data]);

    const fetchUsersData = async (notices, setNotices, getAvatarUrl) => {

        if (!notices || !setNotices || !getAvatarUrl) {
            return;
        }

        try {
            setIsFetchingUsersData(true);

            const userIds = [...new Set(notices.map(notice => notice.user_id).filter(Boolean))];
            const noticeIds = notices.map(notice => notice.$id);

            const [allUsersData, userPermissionsList, allLikes, allSaves] = await Promise.all([
                getUserByIdQuery(userIds),
                getUserPermissionsByIdQuery(userIds),
                getAllLikesByNoticeId(noticeIds),
                getAllSavesByNoticeId(noticeIds)
            ]);

            const userMap = new Map(allUsersData.documents.map(user => [user.$id, user]));
            const permissionsMap = new Map(userPermissionsList.map(perm => [perm.$id, perm]));
            const likesCountMap = new Map();
            const savesCountMap = new Map();

            for (const like of allLikes.documents) {
                const noticeId = like.notice_id;
                likesCountMap.set(noticeId, (likesCountMap.get(noticeId) || 0) + 1);
            }

            for (const save of allSaves.documents) {
                const noticeId = save.notice_id;
                savesCountMap.set(noticeId, (savesCountMap.get(noticeId) || 0) + 1);
            }

            console.log("ABABABABABABABAA");


            const updatedNotices = notices.map(notice => {
                const user = userMap.get(notice.user_id);
                const perm = permissionsMap.get(notice.user_id);
                const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;
                const likesTotal = likesCountMap.get(notice.$id) || 0;
                const savesTotal = savesCountMap.get(notice.$id) || 0;

                return {
                    ...notice,
                    avatarUrl,
                    username: user?.username || 'Unknown User',
                    btnPermission: perm?.btns_reaction_perm,
                    txtPermission: perm?.txt_reaction_perm,
                    noticeLikesTotal: likesTotal,
                    noticeSavesTotal: savesTotal
                };
            });

            setNotices(prevNotices => {
                const nonDuplicateNotices = updatedNotices.filter(newNotice =>
                    !prevNotices.some(existingNotice => existingNotice.$id === newNotice.$id)
                );
                return [...prevNotices, ...nonDuplicateNotices];
            });

        } catch (error) {
            console.error('Error fetching users data:', error);
        } finally {
            setIsFetchingUsersData(false);
        }
    };

    const followUser = async (otherUser_id) => {

        if (!otherUser_id) {
            return;
        }

        try {
            setIsFollowingUserLoading(true);

            const result = await createFollow(userId, otherUser_id);

            setFollowing((prevFollowing) => {
                if (result.unfollowed) {
                    const updatedFollowing = { ...prevFollowing };
                    delete updatedFollowing[otherUser_id];
                    return updatedFollowing;
                } else {
                    return {
                        ...prevFollowing,
                        [otherUser_id]: result.id
                    };
                }
            });
        } catch (error) {
            console.error('Follow failed.', error);
        } finally {
            setIsFollowingUserLoading(false);
        }
    }

    const handleFollow = async (currUserId) => {

        if (!currUserId) {
            return;
        }

        try {
            await followUser(currUserId);
            setIsFollowing(prevState => !prevState);
        } catch (error) {
            console.error('Failed to follow/unfollow user:', error);
        }
    }

    const unfollowUser = async (otherUser_id) => {

        if (!otherUser_id) {
            return;
        }

        try {
            await unfollow(userId, otherUser_id);
            console.log('User unfollow successful');
        } catch (error) {
            console.error('Error unfollowing user', error);
        }
    }

    const getUnfollowedByOtherUser = async (otherUser_id) => {

        if (!otherUser_id) {
            return;
        }

        try {
            await unfollow(otherUser_id, userId);
            console.log('Getting unfollowed successful');
        } catch (error) {
            console.error('Error getting unfollowed by other user', error);
        }
    }

    // User follows them
    const getfollwedByUserCount = async (id) => {

        if (!id) {
            return;
        }

        console.log('Fetching the followebByCount for user:', id);

        try {
            setIsGetFollwedByUserCountLoading(true);

            const res = await followedByUserCount(id);
            console.log('FollowingCount', res);

            setFollowingCount(res);
        } catch (error) {
            console.error('Error getting follwed by user count', error);
        } finally {
            setIsGetFollwedByUserCountLoading(false);
        }
    }

    const fetchAccountsFollowedByUser = async (id, limit, offset) => {

        if (id == null || limit == null || offset == null) {
            console.log(`Missing required parameter:`, { id, limit, offset });
            return;
        }

        try {
            const followedByUser = await getUserFollowingsById(id, limit, offset);
            console.log('followedByUser,', followedByUser);

            if (!followedByUser || followedByUser.length === 0) {
                console.warn('No followed by user found for user:', id);
                return [];
            }

            const followedByUserIds = followedByUser.map((user) => user.otherUser_id);
            console.log('followedByUserIds,', followedByUserIds);

            const allFollowings = await getUserByIdQuery(followedByUserIds);

            console.log('allFollowings', allFollowings);

            if (!allFollowings || !allFollowings.documents) {
                console.warn('No follower data found for user IDs:', followedByUserIds);
                return [];
            }

            const accountsFollowedByUser = followedByUserIds.map((userId) =>
                allFollowings.documents.find((user) => user.$id === userId)
            )
                .filter(Boolean);

            console.log('accountsFollowedByUser', accountsFollowedByUser);

            return accountsFollowedByUser;

        } catch (error) {
            console.error('Failed to fetch user followers:', error);
        }
    }

    const getPersonalFeedAccounts = async (user_id) => {

        if (!user_id) {
            return;
        }

        try {
            const accountsFollowedByUser = await fetchPersonalFeedAccounts(user_id);

            return accountsFollowedByUser;

        } catch (error) {
            console.error('Error fetching personal feed accounts:', error);
        }
    }

    // They follow the user
    const getFollowingTheUserCount = async (id) => {

        if (!id) {
            return;
        }

        try {
            setIsGetFollowingTheUserCountLoading(true);

            const res = await followingTheUserCount(id);
            console.log('FollowersCount', res);

            setFollowersCount(res);
        } catch (error) {
            console.error('Error getting follwers by user count', error);
        } finally {
            setIsGetFollowingTheUserCountLoading(false);
        }
    }

    const fetchAccountsFollowingTheUser = async (id, limit, offset) => {

        if (id == null || limit == null || offset == null) {
            console.log(`Missing required parameter:`, { id, limit, offset });
            return;
        }


        try {
            const followingTheUser = await getUserFollowersById(id, limit, offset);
            console.log('followingTheUser,', followingTheUser);

            if (!followingTheUser || followingTheUser.length === 0) {
                console.warn('No followers found for user:', id);
                return [];
            }

            const followingTheUserIds = followingTheUser.map((user) => user.user_id);
            console.log('followingTheUserIds,', followingTheUserIds);

            const allFollowers = await getUserByIdQuery(followingTheUserIds);

            console.log('allFollowers', allFollowers);

            if (!allFollowers || !allFollowers.documents) {
                console.warn('No follower data found for user IDs:', followingTheUserIds);
                return [];
            }

            const accountsFollowingTheUser = followingTheUserIds
                .map((userId) => allFollowers.documents.find((user) => user.$id === userId))
                .filter(Boolean);

            console.log('accountsFollowingTheUser', accountsFollowingTheUser);

            return accountsFollowingTheUser;

        } catch (error) {
            console.error('Failed to fetch user followers:', error);
            return [];
        }
    }

    const getFollowStatus = async (user_id, otherUser_id) => {

        if (!user_id || !otherUser_id) {
            console.log('This user does not follow their host.');
            return;
        }

        try {
            console.log('getting follow status - 2', { user_id, otherUser_id });
            setIsInitialFollowCheckLoading(true);

            const res = await fetchFollowStatus(user_id, otherUser_id);

            console.log('fetchFollowStatus', res);

            // Setting the button to 'Following' if user follows the other user 
            if (res.total > 0) {
                console.log('Follow each other', res);
                setIsFollowing(true);
            } else {
                setIsFollowing(false);
                return;
            }
            return res;
        } catch (error) {
            console.error('Error getting follow status:', error);
        } finally {
            setIsInitialFollowCheckLoading(false);
        }
    }

    const getFollowingStatus = async (otherUser_id) => {

        if (!otherUser_id) {
            console.log('The host does not care about the user.');
            return;
        }

        console.log('Is other user following me?', { otherUser_id });

        try {
            setIsotherUserFollowingMeCheckLoading(true);

            const res = await fetchFollowingStatus(otherUser_id, userId);

            console.log('otherUserFollowingMe Status', res);

            if (res.total > 0) {
                setIsOtherUserFollowingMe(true);
            } else {
                setIsOtherUserFollowingMe(false);
                return;
            }
            return res;
        } catch (error) {
            console.error('Error getting follow status:', error);
        } finally {
            setIsInitialFollowCheckLoading(false);
        }
    }

    const getUserAccountByUserId = async (userId) => {

        if (!userId) {
            return;
        }

        try {
            const accnt = await getUserById(userId);

            console.log('accnt: ', accnt);

            return accnt;
        } catch (error) {
            console.error('Error getting user account ', error);
        }
    }

    const getUserByIdQuery = async (userId) => {

        if (!userId) {
            return;
        }

        try {
            const user = await fetchUserByIdQuery(userId);
            return user;
        } catch (error) {
            console.error('Error querying user by id:', error);
        }
    }

    const getUsersByIdQuery = async (userId) => {

        if (!userId) {
            return;
        }

        try {
            const user = await fetchUsersByIdQuery(userId);
            return user;
        } catch (error) {
            console.error('Error querying user by id:', error);
        }
    }

    const makePasscode = async (userId, passcode, accountType) => {
        if (!userId || !passcode || !accountType) {
            return;
        }

        try {
            console.log('usr id', userId);
            console.log('passcode', passcode);
            console.log('accountType', accountType);
            const res = await createPassocde(userId, passcode, accountType);
            return res;
        } catch (error) {
            console.error('Error making passcode:', error);
        }
    }

    const editPasscode = async (passcode) => {

        if (!passcode) {
            return;
        }

        try {
            console.log('usr id', userId);
            console.log('passcode', passcode);
            const res = await updatePassocde(userId, passcode);

            console.log('Success passcode update:', res);

            return res;
        } catch (error) {
            console.error('Error editing passcode:', error);
        }
    }

    const getPassocdeByOrganizationId = async (userId) => {

        if (!userId) {
            return;
        }

        try {
            const res = await fetchPassocdeByOrganizationId(userId);
            return res.documents;
        } catch (error) {
            console.error('Error fetching passcode:', error);
        }
    }

    const makeBlock = async (currUser_id) => {

        if (!currUser_id) {
            return;
        }

        try {
            console.log('userId', userId);
            console.log('currUser_id', currUser_id);
            const res = await createBlock(userId, currUser_id);
            console.log('Blocked made successfully: ', res);
            return res;
        } catch (error) {
            console.error('Error making block:', error);
        }
    }

    const handleBlock = async (currUserId) => {

        if (!currUserId) {
            return;
        }

        setIsProcessingBlock(true);
        try {
            await makeBlock(currUserId);

            await Promise.allSettled([
                unfollowUser(currUserId),
                getUnfollowedByOtherUser(currUserId)
            ]);

            navigate('/user/feed');
        } catch (error) {
            console.error('Failed to block user:', error);
        } finally {
            setIsProcessingBlock(false);
        }
    }

    const getBlockedUsersByUser = async (user_id) => {

        if (!user_id) {
            return;
        }

        try {
            console.log('userId', user_id);

            const res = await fetchBlockedUsersByUser(user_id);
            console.log('Blocked listed successfully: ', res);
            return res;
        } catch (error) {
            console.error('Error listing blocked:', error);
        }
    }

    const getBlockedUsersByUserByBatch = async (user_id, limit, offset) => {

        if (user_id == null || limit == null || offset == null) {
            console.log(`Missing required parameter:`, { user_id, limit, offset });
            return;
        }

        try {
            console.log('userId', user_id);

            const res = await fetchBlockedUsersByUserByBatch(user_id, limit, offset);
            console.log('Blocked listed successfully: ', res);
            return res;
        } catch (error) {
            console.error('Error listing blocked:', error);
        }
    }

    const getUsersBlockingUser = async (user_id) => {

        if (!user_id) {
            return;
        }

        try {
            console.log('userId', user_id);

            const res = await fetchUsersBlockingUser(user_id);
            console.log('These accounts blocked you: ', res);
            return res;
        } catch (error) {
            console.error('Error listing users:', error);
        }
    }

    const checkIsOtherUserBlockedByUser = async (user_id, otherUser_id) => {

        if (!user_id || !otherUser_id) {
            return;
        }

        console.log('Starting checkIsOtherUserBlockedByUser...');

        try {
            const res = await isOtherUserBlockedByUser(user_id, otherUser_id);
            return res;
        } catch (error) {
            console.error('Error getting block status:', error);
        }
    }

    const checkIsUserBlockedByOtherUser = async (otherUser_id, user_id) => {

        if (!otherUser_id || !user_id) {
            return;
        }

        console.log('Starting checkIsUserBlockedByOtherUser...');

        try {
            const res = await isUserBlockedByOtherUser(otherUser_id, user_id);
            return res;
        } catch (error) {
            console.error('Error getting block status:', error);
        }
    }

    const deleteBlockUsingBlockedId = async (blocked_id) => {

        if (!blocked_id) {
            return;
        }

        try {
            console.log('blocked_id', blocked_id);

            await removeBlockUsingBlockedId(blocked_id);
            console.log('Block removed successfully.');
        } catch (error) {
            console.error('Error deleting block:', error);
        }
    }

    const handleUserReport = async (reported_id, reason) => {

        if (!reported_id || !reason) {
            return;
        }

        try {
            await createUserReport(reported_id, reason, userId);
            console.log('Reporting user successful!');
        } catch (error) {
            console.error('Error reporting user', error);
        }
    }

    return {
        userId,
        isFollowingUserLoading,
        isInitialFollowCheckLoading,
        following,
        isFollowing,
        followersCount,
        followingCount,
        isotherUserFollowingMeCheckLoading,
        isOtherUserFollowingMe,
        isProcessingBlock,
        isGetFollwedByUserCountLoading,
        isGetFollowingTheUserCountLoading,
        isFetchingUsersData,
        getAccount,
        updateAuthPassword,
        checkIsOtherUserBlockedByUser,
        checkIsUserBlockedByOtherUser,
        makeBlock,
        handleBlock,
        getBlockedUsersByUser,
        getBlockedUsersByUserByBatch,
        getUsersBlockingUser,
        deleteBlockUsingBlockedId,
        checkingIdInAuth,
        checkingEmailInAuth,
        registerUser,
        createSession,
        removeSession,
        getUserByUsername,
        getAllUsersByString,
        getSessionDetails,
        handleUpdateUser,
        checkUsernameExists,
        updateUserWebsite,
        handleDeleteUser,
        // getUsersData,
        fetchUsersData,
        followUser,
        handleFollow,
        unfollowUser,
        getFollowStatus,
        getFollowingStatus,
        setIsFollowing,
        getfollwedByUserCount,
        getFollowingTheUserCount,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        // setFollowingAccounts,
        getUserAccountByUserId,
        getPersonalFeedAccounts,
        getUserByIdQuery,
        getUsersByIdQuery,
        makePasscode,
        editPasscode,
        getPassocdeByOrganizationId,
        handleUserReport
    }
}