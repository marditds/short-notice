import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAccount as fetchAccount, createBlock, getBlockedUsersByUser as fetchBlockedUsersByUser, getBlockedUsersByUserByBatch as fetchBlockedUsersByUserByBatch, getUsersBlockingUser as fetchUsersBlockingUser, removeBlockUsingBlockedId, checkIdExistsInAuth, checkEmailExistsInAuth as checkEmailInAuthFromServer, registerAuthUser, getUserById, getUserByIdQuery as fetchUserByIdQuery, deleteAuthUser, createUserSession, getSessionDetails as fetchSessionDetails, deleteUserSession, updateUser, updateUserWebsite as updtUsrWbst, updateAuthUser, deleteUser, getUserByUsername as fetchUserByUsername, getAllUsersByString as fetchAllUsersByString, deleteAllNotices, deleteAllSentReactions, removeAllSavesByUser, removeAllLikesByUser, removeAllFollows, removeAllFollowed, getUsersDocument, createFollow, unfollow, getUserFollowingsById, getUserFollowersById, followedByUserCount, followingTheUserCount, getPersonalFeedAccounts as fetchPersonalFeedAccounts, createPassocde, updatePassocde, getPassocdeByOrganizationId as fetchPassocdeByOrganizationId, createUserReport, getFollowStatus as fetchFollowStatus, isUserBlockedByOtherUser, isOtherUserBlockedByUser, deletePassocde, updateAuthPassword as changeAuthPassword, checkUsernameExists as doesUsernameExists, removeAllBlocksForBlocker, removeAllBlocksForBlocked, deleteUserInterestsFromDB, deleteAllRecievedReactions, removeAllSavesForAuthor, removeAllLikesForAuthor,
    getUserPermissions
} from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';
import { useUserAvatar } from './useUserAvatar';

export const useUserInfo = (data) => {

    const { setUsername, userId, accountType } = useUserContext();

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

    const [isFollowingUserLoading, setIsFollowingUserLoading] = useState(false);
    const [isInitialFollowCheckLoading, setIsInitialFollowCheckLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    const [isProcessingBlock, setIsProcessingBlock] = useState(false);


    // useEffect(() => {
    //     const fetchUserId = async () => {
    //         if (data) {
    //             const id = await UserId(data);
    //             setUserId(id);
    //         }
    //     };
    //     fetchUserId();
    // }, [data]);

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
        try {
            const newAuthUsr = await registerAuthUser(id, email, username);
            console.log('newAuthUsr - useUserInfo:', newAuthUsr);

            return newAuthUsr;
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    const createSession = async (email) => {
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
        try {
            const usernameExists = await doesUsernameExists(username);

            if (usernameExists) {
                return 'Username already taken.';
            }

        } catch (error) {
            console.error('Error checking username:', err);
            return 'Something went wrong. Try again later.'
        }
    }

    const handleUpdateUser = async (username) => {

        if (!userId) {
            console.error('User ID is not set.');
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
        try {
            const res = await changeAuthPassword(newPassword, oldPassword);
            return res;
        } catch (error) {
            console.error('Error updating auth password:', error);
        }
    }

    const updateUserWebsite = async (website) => {

        if (!userId) {
            console.error('User ID is not set.');
            return;
        }

        try {
            console.log('userId', userId);

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
        try {
            console.log('this email will be sent - useserInfo:', email);

            const res = await checkEmailInAuthFromServer(email);
            return res;
        } catch (error) {
            console.error('Error checkingEmailInAuth:', res);
        }
    }

    const getUserByUsername = async (username) => {
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
        try {
            const usrnm = await fetchAllUsersByString(username, limit, cursorAfter);
            console.log('username found:', usrnm);
            return usrnm;
        } catch (error) {
            console.error('Error getting user by username:', error);
        }
    };

    const getUsersData = useCallback(async () => {
        try {
            const response = await getUsersDocument();
            return response;
        } catch (error) {
            console.error('Error getting users data:', error);

        }
    }, [data]);

    const fetchUsersData = async (notices, setNotices, getAvatarUrl) => {
        try {
            setIsFetchingUsersData(true);

            const ntcIds = notices?.map((notice) => notice.user_id);
            console.log('NTCIDS???', ntcIds);

            const allUsersData = await getUserByIdQuery(ntcIds);
            console.log('allUsersData???', allUsersData);

            const updatedNotices = await Promise.all(
                notices.map(async (notice) => {
                    const user = allUsersData.documents.find((user) => user.$id === notice.user_id);
                    const userPermissions = await getUserPermissions(user.$id);

                    if (user && user.avatar) {
                        const avatarUrl = getAvatarUrl(user.avatar);

                        return { ...notice, avatarUrl, username: user.username, btnPermission: userPermissions.btns_reaction_perm, txtPermission: userPermissions.txt_reaction_perm };
                    }
                    return { ...notice, avatarUrl: null, username: user?.username || 'Unknown User', btnPermission: userPermissions.btns_reaction_perm, txtPermission: userPermissions.txt_reaction_perm };
                })
            );

            if (JSON.stringify(updatedNotices) !== JSON.stringify(notices)) {
                setNotices(prevNotices => {
                    const nonDuplicateNotices = updatedNotices.filter(newNotice =>
                        !prevNotices.some(existingNotice => existingNotice.$id === newNotice.$id)
                    );
                    return [...prevNotices, ...nonDuplicateNotices];
                });
            }
        } catch (error) {
            console.error('Error getting users data:', error);
        } finally {
            setIsFetchingUsersData(false);
        }
    };

    const followUser = async (otherUser_id) => {
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
        try {
            await followUser(currUserId);
            setIsFollowing(prevState => !prevState);
        } catch (error) {
            console.error('Failed to follow/unfollow user:', error);
        }
    }

    const unfollowUser = async (otherUser_id) => {
        try {
            await unfollow(userId, otherUser_id);
            console.log('User unfollow successful');
        } catch (error) {
            console.error('Error unfollowing user', error);
        }
    }

    const getUnfollowedByOtherUser = async (otherUser_id) => {
        try {
            await unfollow(otherUser_id, userId);
            console.log('Getting unfollowed successful');
        } catch (error) {
            console.error('Error getting unfollowed by other user', error);
        }
    }

    // User follows them
    const getfollwedByUserCount = async (id) => {
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
        try {

            const accountsFollowedByUser = await fetchPersonalFeedAccounts(user_id);

            return accountsFollowedByUser;

        } catch (error) {
            console.error('Error fetching personal feed accounts:', error);
        }
    }

    // They follow the user
    const getFollowingTheUserCount = async (id) => {
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
                setIsFollowing(false)
            }
            return res;
        } catch (error) {
            console.error('Error getting follow status:', error);
        } finally {
            setIsInitialFollowCheckLoading(false);
        }
    }

    const getUserAccountByUserId = async (userId) => {
        try {
            const accnt = await getUserById(userId);

            console.log('accnt: ', accnt);

            return accnt;
        } catch (error) {
            console.error('Error getting user account ', error);
        }
    }

    const getUserByIdQuery = async (userId) => {
        try {
            const user = await fetchUserByIdQuery(userId);
            return user;
        } catch (error) {
            console.error('Error querying user by id:', error);
        }
    }

    const makePasscode = async (userId, passcode, accountType) => {
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
        try {
            const res = await fetchPassocdeByOrganizationId(userId);
            return res.documents;
        } catch (error) {
            console.error('Error fetching passcode:', error);
        }
    }

    const makeBlock = async (currUser_id) => {
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
        console.log('Starting checkIsOtherUserBlockedByUser...');

        try {
            const res = await isOtherUserBlockedByUser(user_id, otherUser_id);
            return res;
        } catch (error) {
            console.error('Error getting block status:', error);
        }
    }

    const checkIsUserBlockedByOtherUser = async (otherUser_id, user_id) => {
        console.log('Starting checkIsUserBlockedByOtherUser...');

        try {
            const res = await isUserBlockedByOtherUser(otherUser_id, user_id);
            return res;
        } catch (error) {
            console.error('Error getting block status:', error);
        }
    }

    const deleteBlockUsingBlockedId = async (blocked_id) => {
        try {
            console.log('blocked_id', blocked_id);

            await removeBlockUsingBlockedId(blocked_id);
            console.log('Block removed successfully.');
        } catch (error) {
            console.error('Error deleting block:', error);
        }
    }

    const handleUserReport = async (reported_id, reason) => {
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
        isProcessingBlock,
        // username, 
        isGetFollwedByUserCountLoading,
        isGetFollowingTheUserCountLoading,
        isFetchingUsersData,
        // followersAccounts,
        // followingAccounts,
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
        getUsersData,
        fetchUsersData,
        followUser,
        handleFollow,
        unfollowUser,
        getFollowStatus,
        setIsFollowing,
        getfollwedByUserCount,
        getFollowingTheUserCount,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        // setFollowingAccounts,
        getUserAccountByUserId,
        getPersonalFeedAccounts,
        getUserByIdQuery,
        makePasscode,
        editPasscode,
        getPassocdeByOrganizationId,
        handleUserReport
    }
}