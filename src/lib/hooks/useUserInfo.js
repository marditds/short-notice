import { useState, useEffect, useCallback } from 'react';
import { createBlock, getBlockedUsersByUser as fetchBlockedUsersByUser, getBlockedUsersByUserByBatch as fetchBlockedUsersByUserByBatch, getUsersBlockingUser as fetchUsersBlockingUser, removeBlockUsingBlockedId, checkIdExistsInAuth, checkEmailExistsInAuth as checkEmailInAuthFromServer, registerAuthUser, getUserById, getUserByIdQuery as fetchUserByIdQuery, deleteAuthUser, createUserSession, getSessionDetails as fetchSessionDetails, deleteUserSession, updateUser, updateAuthUser, deleteUser, getUserByUsername as fetchUserByUsername, getAllUsersByString as fetchAllUsersByString, deleteAllNotices, deleteAllReactions, removeAllSaves, removeAllLikes, getUsersDocument, createFollow, removeFollow, getUserFollowingsById as fetchUserFollowingsById, getUserFollowersById as fetchUserFollowersById, getOtherUserFollowingsById as fetchOtherUserFollowingsById, createPassocde, updatePassocde, getPassocdeByBusincessId as fetchPassocdeByBusincessId } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';
import { UserId } from '../../components/User/UserId';

const useUserInfo = (data) => {

    const { setUsername } = useUserContext();
    const [userId, setUserId] = useState(null);


    const [following, setFollowing] = useState({});
    const [followersCount, setFollowersCount] = useState(null);
    const [followingCount, setFollowingCount] = useState(null);
    const [followersAccounts, setFollowersAccounts] = useState([]);
    const [followingAccounts, setFollowingAccounts] = useState([]);
    const [isFollowingUserLoading, setIsFollowingUserLoading] = useState(false);
    const [isInitialFollowCheckLoading, setIsInitialFollowCheckLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);


    useEffect(() => {
        const fetchUserId = async () => {
            if (data) {
                const id = await UserId(data);
                setUserId(id);
            }
        };
        fetchUserId();
    }, [data]);

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

    const handleUpdateUser = async (username) => {

        if (!userId) {
            console.error('User ID is not set.');
            return;
        }

        try {

            console.log('userId', userId);

            const res = await updateUser({ userId, username });

            await updateAuthUser(username);

            setUsername(username);
            // setRegisterdUsername(username);

            console.log('Username updated successfully.', res);

        } catch (error) {
            console.error('Error updating the username:', error);

        }
    }

    const handleDeleteUser = async () => {
        try {
            await deleteAllNotices(userId);
            await deleteAllReactions(userId);
            await removeAllSaves(userId);
            await removeAllLikes(userId);
            await deleteUser(userId);
            await deleteAuthUser(userId);
            // await deleteUserSession();
            console.log('User deleted successfully.');

        } catch (error) {
            console.error('Error deleting user:', error);

        }
    }

    const checkingIdInAuth = async () => {
        try {
            const res = checkIdExistsInAuth();
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
        console.log('otherUsername', username);

        try {
            const usrnm = await fetchUserByUsername(username);
            console.log('username found:', usrnm);
            return usrnm;
        } catch (error) {
            console.error('Error getting user by username:', error);
        }

    }

    const getAllUsersByString = async (username, limit, offset) => {
        try {
            const usrnm = await fetchAllUsersByString(username, limit, offset);
            console.log('username found:', usrnm);
            return usrnm;
        } catch (error) {
            console.error('Error getting user by username:', error);
        }

    }

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
            const allUsersData = await getUsersData();
            const updatedNotices = await Promise.all(
                notices.map(async (notice) => {
                    const user = allUsersData.documents.find((user) => user.$id === notice.user_id);
                    if (user && user.avatar) {
                        const avatarUrl = getAvatarUrl(user.avatar);
                        return { ...notice, avatarUrl, username: user.username };
                    }
                    return { ...notice, avatarUrl: null, username: user?.username || 'Unknown User' };
                })
            );
            if (JSON.stringify(updatedNotices) !== JSON.stringify(notices)) {
                setNotices(prevNotices => {
                    // Filter out duplicates before appending
                    const nonDuplicateNotices = updatedNotices.filter(newNotice =>
                        !prevNotices.some(existingNotice => existingNotice.$id === newNotice.$id)
                    );
                    return [...prevNotices, ...nonDuplicateNotices];
                });
            }
        } catch (error) {
            console.error('Error getting users data:', error);
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

    const getUserFollowingsById = async (otherUser_id) => {
        try {
            const response = await fetchUserFollowingsById(otherUser_id);
            // console.log('Successfully fetched user followers:', response);
            return response;
        } catch (error) {
            console.error('Failed to fetch user followers:', error);

        }
    }

    const getUserFollowersById = async (otherUser_id) => {
        try {
            const response = await fetchUserFollowersById(otherUser_id);
            // console.log('Successfully fetched user followers:', response);
            return response;
        } catch (error) {
            console.error('Failed to fetch user followers:', error);

        }
    }

    const getOtherUserFollowingsById = useCallback(async (user_id) => {
        try {
            const response = await fetchOtherUserFollowingsById(user_id);
            console.log('Successfully fetched user followers:', response);
            return response;
        } catch (error) {
            console.error('Failed to fetch user followers:', error);

        }
    }, [data])


    const fetchAccountsFollowingTheUser = async (otherUser_id, user_id) => {
        try {
            setIsInitialFollowCheckLoading(true);
            const allUsers = await getUsersData();
            // console.log('allUsers:', allUsers.documents);

            const userFollowersById = await getUserFollowersById(otherUser_id);

            console.log('userFollowersById', userFollowersById);

            const accountsFollowingTheUser = allUsers.documents.filter((user) =>
                userFollowersById?.some(followed => user.$id === followed.user_id)
            );

            console.log('accountsFollowingTheUser', accountsFollowingTheUser);

            setFollowersAccounts(accountsFollowingTheUser);

            setFollowersCount(accountsFollowingTheUser.length);

            // Set the button to 'Following' if user follows the other user 
            if (userFollowersById && user_id) {

                const matchUserWithFollower = userFollowersById.find((user) => user.user_id === user_id);

                console.log('matchUserWithFollower', matchUserWithFollower);

                setIsFollowing(!!matchUserWithFollower);
                setIsInitialFollowCheckLoading(false);

            }

        } catch (error) {
            console.error('Failed to fetch user followers:', error);
        }
    }

    const fetchAccountsFollowedByUser = async (id) => {
        try {
            const allUsers = await getUsersData();

            const followedByUserIds = await getUserFollowingsById(id);

            const accountsFollowedByUser = allUsers.documents.filter((user) =>
                followedByUserIds?.some(followed => user.$id === followed.otherUser_id)
            );

            setFollowingAccounts(accountsFollowedByUser);

            setFollowingCount(accountsFollowedByUser.length);

        } catch (error) {
            console.error('Failed to fetch user followers:', error);
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

    const getPassocdeByBusincessId = async (userId) => {
        try {
            const res = await fetchPassocdeByBusincessId(userId);
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

    const deleteBlockUsingBlockedId = async (blocked_id) => {
        try {
            console.log('blocked_id', blocked_id);

            await removeBlockUsingBlockedId(blocked_id);
            console.log('Block removed successfully.');
        } catch (error) {
            console.error('Error deleting block:', error);
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
        followersAccounts,
        followingAccounts,
        makeBlock,
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
        handleDeleteUser,
        getUsersData,
        fetchUsersData,
        followUser,
        setIsFollowing,
        getUserFollowingsById,
        getUserFollowersById,
        getOtherUserFollowingsById,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser,
        getUserAccountByUserId,
        getUserByIdQuery,
        makePasscode,
        editPasscode,
        getPassocdeByBusincessId
    }
}

export default useUserInfo;