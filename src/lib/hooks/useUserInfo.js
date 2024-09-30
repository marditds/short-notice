import { useState, useEffect, useCallback } from 'react';
import { updateUser, deleteUser, deleteAllNotices, getUsersDocument, createFollow, removeFollow, getAllFollowingsByUser as fetchAllFollowingsByUser } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';
import { UserId } from '../../components/User/UserId';

const useUserInfo = (data) => {

    const { setUsername } = useUserContext();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            if (data) {
                const id = await UserId(data);
                setUserId(id);
            }
        };
        fetchUserId();
    }, [data]);

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
            await createFollow(userId, otherUser_id);
            console.log('Follow successful.');
        } catch (error) {
            console.error('Follow failed.', error);
        }
    }

    const unfollowUser = async (following_id) => {
        try {
            const response = removeFollow(following_id);
            console.log('Unfollow success.');
            return response;
        } catch (error) {
            console.error('Unfollow failed:', error);
        }
    }

    const getAllFollowingsByUser = async () => {
        try {
            const response = await fetchAllFollowingsByUser(userId);

            console.log('Fetched getting followig list:', response);
            return response;

        } catch (error) {
            console.error('Could not get following list', error);

        }
    }

    return {
        handleUpdateUser,
        handleDeleteUser,
        getUsersData,
        fetchUsersData,
        followUser,
        unfollowUser,
        getAllFollowingsByUser
    }
}

export default useUserInfo;