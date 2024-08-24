import { Client, Storage, Account, Databases, ID, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT);

const storage = new Storage(client);
export const databases = new Databases(client);


export const users = await databases.listDocuments(
    import.meta.env.VITE_DATABASE,
    import.meta.env.VITE_USERS_COLLECTION
);

export const notices = await databases.listDocuments(
    import.meta.env.VITE_DATABASE,
    import.meta.env.VITE_NOTICES_COLLECTION
);


export const uploadAvatar = async (file) => {
    try {
        const response = await storage.createFile(import.meta.env.VITE_AVATAR_BUCKET, ID.unique(), file);
        const fileId = response.$id;
        return fileId;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

export const updateAvatar = async (fileId, newName) => {
    try {
        const response = await storage.updateFile(
            import.meta.env.VITE_AVATAR_BUCKET,
            fileId,
            newName
        );

        console.log('File updated successfully:', response);
        return response;
    } catch (error) {
        console.error('Error updating file in storage:', error);
        throw error;
    }
};

export const deleteAvatarFromStrg = async (fileId) => {
    try {
        const response = await storage.deleteFile(import.meta.env.VITE_AVATAR_BUCKET, fileId);
        console.log('Avatar deleted successfully:', response);
    } catch (error) {
        console.error('Error deleting avatar:', error);
    }
};

export const updateUserProfile = async (userId, profilePictureId) => {
    try {
        await databases.updateDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId,
            { avatar: profilePictureId }
        );
        console.log('User profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile:', error);
    }
};

export const deleteAvatarFromDoc = async (userId) => {
    try {


        await databases.updateDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId,
            { avatar: '' }
        );
        console.log('User profile avatar set to null successfully');
    } catch (error) {
        console.error('Error updating avatar in user document:', error);
    }
}

export const getUserDocument = async (userId) => {
    try {
        const response = await databases.getDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId
        );
        console.log('User document:', response);
        return response;
    } catch (error) {
        console.error('Error fetching user document:', error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await databases.getDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId
        );
        return response;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const userList = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            [Query.equal('email', email)]
        );

        if (userList.total > 0) {
            return userList.documents[0];
        }

        return null;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
};


export const createUser = async ({ email, given_name, username }) => {
    try {

        const existingUser = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            [Query.equal('email', email)]
        );

        if (existingUser.total > 0) {
            console.log('User already exists:', existingUser.documents[0]);
            return;
        }

        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            ID.unique(),
            {
                email,
                given_name,
                username
            }
        );
        console.log('Document created successfully:', response);
    } catch (error) {
        console.error('Error creating document:', error);
    }
};


export const createNotice = async ({ user_id, text, timestamp }) => {
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            ID.unique(),
            {
                user_id,
                text,
                timestamp
            }
        );
        console.log('Notice created succesfully:', response);
        return response;
    } catch (error) {
        console.error('Error creating notice:', error);
    }
};


export const getUserNotices = async (user_id) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            [
                Query.equal('user_id', user_id),
                Query.orderDesc('timestamp'),
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching notices:', error);
        return [];
    }
};

export const updateNotice = async (noticeId, newText) => {
    try {
        const response = await databases.updateDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            noticeId,
            {
                text: newText
            }
        );
        console.log('Notice updated successfully:', response);
    } catch (error) {
        console.error('Error updating notice:', error);
    }
};

export const deleteNotice = async (noticeId) => {

    console.log('Attempting to delete notice with ID:', noticeId);

    try {
        const response = await databases.deleteDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            noticeId
        );
        console.log('Notice deleted successfully:', response);
    } catch (error) {
        console.error('Error deleting notice:', error);
    }
};


export const account = new Account(client);
export { ID } from 'appwrite';



