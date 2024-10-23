import { useState, useEffect, useCallback } from 'react';
import { checkIdExistsInAuth, checkEmailExistsInAuth as checkEmailInAuthFromServer, registerAuthUser, deleteAuthUser, createUserSession, getSessionDetails as fetchSessionDetails, deleteUserSession, updateUser, updateAuthUser, deleteUser, deleteAllNotices, getUsersDocument, createFollow, removeFollow, getUserFollowingsById as fetchUserFollowingsById, getUserFollowersById as fetchUserFollowersById, getOtherUserFollowingsById as fetchOtherUserFollowingsById } from '../context/dbhandler';
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
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
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

            await updateUser({ userId, username });

            await updateAuthUser(username);

            setUsername(username);
            // setRegisterdUsername(username);

            console.log('Username updated successfully.');

        } catch (error) {
            console.error('Error updating the username:', error);

        }
    }

    const handleDeleteUser = async () => {
        try {
            await deleteAllNotices(userId);
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
                setNotices(prevNotices => [...prevNotices, ...updatedNotices]);
            }
        } catch (error) {
            console.error('Error getting users data:', error);
        }
    };

    const followUser = async (otherUser_id) => {
        try {
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
            setIsFollowingLoading(true);


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
                setIsFollowingLoading(false);
            }

        } catch (error) {
            console.error('Failed to fetch user followers:', error);
        }
        finally {
            setIsFollowingLoading(false);
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





    return {
        isFollowingLoading,
        following,
        isFollowing,
        followersCount,
        followingCount,
        followersAccounts,
        followingAccounts,
        // isLoading,
        checkingIdInAuth,
        checkingEmailInAuth,
        registerUser,
        createSession,
        removeSession,
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
        // authedUsers
    }
}

export default useUserInfo;