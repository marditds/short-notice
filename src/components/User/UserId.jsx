import { users } from '../../lib/context/dbhandler.js';


export const UserId = (googleUserData) => {

    const userEmail = googleUserData.email;

    const currUser = users.documents.find(user => user.email === userEmail);

    const userId = currUser ? currUser.$id : null;

    return userId;
}