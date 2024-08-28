import { useState, useEffect } from 'react';
import { updateUser, deleteUser, getUserById } from '../context/dbhandler';
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

    const handleReadUser = async () => {
        if (!userId) {
            console.error('User ID is not set.');
            return;
        }
        try {
            const response = await getUserById(userId);

            console.log('Found user:', response);
            return response;

        } catch (error) {
            console.error('Could not find user.', error);

        }
    }


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
            await deleteUser(userId);
            console.log('User deleted successfully.');

        } catch (error) {
            console.error('Error deleting user:', error);

        }
    }

    return {
        handleReadUser, handleUpdateUser, handleDeleteUser
    }
}

export default useUserInfo;