import { useState, useEffect } from 'react';
import { updateUser, deleteUser, deleteAllNotices } from '../context/dbhandler';
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

    return {
        handleUpdateUser, handleDeleteUser
    }
}

export default useUserInfo;