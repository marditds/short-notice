import { getUserByEmail } from '../../lib/context/dbhandler.js';

export const UserId = async (googleUserData) => {
    if (!googleUserData || !googleUserData.email) {
        return null;
    }

    try {
        const userEmail = googleUserData.email;

        const currUser = await getUserByEmail(userEmail);

        return currUser ? currUser.$id : null;

    } catch (error) {
        console.error('Error fetching user ID:', error);
        return null;
    }
};
