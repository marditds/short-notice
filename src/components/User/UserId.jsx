import { getUserByEmail } from '../../lib/context/dbhandler.js';

export const UserId = async (googleUserData) => {
    if (!googleUserData || !googleUserData) {
        return null;
    }

    try {
        console.log('THIS IS EMAIL:', googleUserData);

        const userEmail = googleUserData;

        const currUser = await getUserByEmail(userEmail);

        return currUser ? currUser.$id : null;

    } catch (error) {
        console.error('Error fetching user ID:', error);
        return null;
    }
};
