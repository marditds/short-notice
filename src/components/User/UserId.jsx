// import { users } from '../../lib/context/dbhandler.js';


// export const UserId = (googleUserData) => {

//     const userEmail = googleUserData.email;

//     const currUser = users.documents.find(user => user.email === userEmail);

//     const userId = currUser ? currUser.$id : null;

//     return userId;
// }

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
