import { useState, useEffect, useCallback } from 'react';
import { updateUser, deleteUser, deleteAllNotices, getUsersDocument, createFollow, removeFollow, getUserFollowingsById as fetchUserFollowingsById, getOtherUserFollowersById as fetchOtherUserFollowersById } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';
import { UserId } from '../../components/User/UserId';

const useUserInfo = (data) => {

    const { setUsername } = useUserContext();
    const [userId, setUserId] = useState(null);

    // const [following, setFollowing] = useState({});

    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserId = async () => {
            if (data) {
                const id = await UserId(data);
                setUserId(id);
            }
        };
        fetchUserId();
    }, [data]);


    // Fetch user following
    // useEffect(() => {
    //     const fetchUserFollowing = async () => {

    //         try {
    //             setIsLoading(true);
    //             const userFollowing = await getUserFollowingsById(userId);

    //             console.log('userFollowing', userFollowing);

    //             const followingObject = userFollowing.reduce((acc, follow) => {
    //                 acc[follow.otherUser_id] = follow.$id;
    //                 return acc;
    //             }, {});

    //             console.log('followingObject', followingObject);

    //             setFollowing(followingObject);
    //         } catch (error) {
    //             console.error('Error fetching user following:', error);
    //             setFollowing({});
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    //     fetchUserFollowing();
    // }, [userId])

    const handleUpdateUser = async (username) => {

        if (!userId) {
            console.error('User ID is not set.');
            return;
        }

        try {
            await updateUser({ userId, username });

            setUsername(username);

            console.log('Username updated successfully.');

        } catch (error) {
            console.error('Error updating the username:', error);

        }
    }

    const handleDeleteUser = async () => {
        try {
            await deleteAllNotices(userId)

            await deleteUser(userId);
            console.log('User deleted successfully.');

        } catch (error) {
            console.error('Error deleting user:', error);

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
                setNotices(updatedNotices);
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
            console.log('Successfully fetched user followers:', response);
            return response;
        } catch (error) {
            console.error('Failed to fetch user followers:', error);

        }
    }


    const getOtherUserFollowersById = async (otherUser_id) => {
        try {
            const response = await fetchOtherUserFollowersById(otherUser_id);
            console.log('Successfully fetched user followers:', response);
            return response;
        } catch (error) {
            console.error('Failed to fetch user followers:', error);

        }
    }



    return {
        // following,
        // isLoading,
        handleUpdateUser,
        handleDeleteUser,
        getUsersData,
        fetchUsersData,
        followUser,
        getUserFollowingsById,
        getOtherUserFollowersById
    }
}

export default useUserInfo;