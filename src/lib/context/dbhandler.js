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
        const response = await storage.createFile(
            import.meta.env.VITE_AVATAR_BUCKET,
            ID.unique(),
            file
        );
        const fileId = response.$id;
        return fileId;
    } catch (error) {
        console.error('Error uploading avatar:', error);
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

export const updateAvatar = async (userId, profilePictureId) => {
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

export const getUsersDocument = async () => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            // userId
        );
        // console.log('Users documents:', response);
        return response;
    } catch (error) {
        console.error('Error fetching users documents:', error);
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

export const getUserByUsername = async (username) => {
    try {
        const userList = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            [Query.equal('username', username.toLowerCase())]
        );

        if (userList.total > 0) {
            return userList.documents[0];
        }

        return null;
    } catch (error) {
        console.error('Error fetching user by username:', error);
        return null;
    }
};

const checkUsernameExists = async (username) => {
    try {
        const users = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            [Query.equal('username', username.toLowerCase())]
        );
        return users.total > 0;
    } catch (error) {
        console.error('Error checking username existence:', error);
        throw error;
    }
};

export const createUser = async ({ email, given_name, username }) => {
    try {

        const existingUser = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            [Query.equal('email', email)]
        );

        const usernameExists = await checkUsernameExists(username);

        if (existingUser.total > 0) {
            console.log('User already exists:', existingUser.documents[0]);
            return;
        }

        if (usernameExists) {
            console.log('Username already exists:', username);
            throw new Error('Username already exists');
        }

        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            ID.unique(),
            {
                email,
                given_name,
                username: username.toLowerCase()
            }
        );
        console.log('Document created successfully:', response);
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
};

export const updateUser = async ({ userId, username }) => {
    try {
        await databases.updateDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId,
            { username: username }
        );
        console.log('Username successfully updated.');
    } catch (error) {
        console.error('Error updating the username:', error);

    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await databases.deleteDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId
        );
        console.log('User deleted successfully:', response);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

export const createNotice = async ({ user_id, text, timestamp, expiresAt, science, technology, engineering, math, literature, history, philosophy, music, medicine, economics, law, polSci, sports
}) => {

    try {

        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            ID.unique(),
            {
                user_id,
                text,
                timestamp,
                expiresAt,
                science: science || false,
                technology: technology || false,
                engineering: engineering || false,
                math: math || false,
                literature: literature || false,
                history: history || false,
                philosophy: philosophy || false,
                music: music || false,
                medicine: medicine || false,
                economics: economics || false,
                law: law || false,
                polSci: polSci || false,
                sports: sports || false
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

export const getNoticeByTagname = async (tagnames) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            [
                Query.equal(tagnames, true),
                Query.orderDesc('timestamp'),
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching notices:', error);
        return [];
    }
};

export const getAllNotices = async () => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            [
                Query.orderDesc('timestamp')
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching notices:', error);
    }
}

export const getFilteredNotices = async (selectedTags) => {
    try {
        if (typeof selectedTags !== 'object' || selectedTags === null) {
            throw new Error('selectedTags must be an object');
        }

        const queryList = Object.keys(selectedTags)
            .filter(tagKey => selectedTags[tagKey] === true)
            .map(tagKey => Query.equal(tagKey, true));

        let notices;
        if (queryList.length === 0) {
            notices = { documents: [] };
        } else if (queryList.length === 1) {
            notices = await databases.listDocuments(
                import.meta.env.VITE_DATABASE,
                import.meta.env.VITE_NOTICES_COLLECTION,
                [queryList[0]]
            );
        } else {
            notices = await databases.listDocuments(
                import.meta.env.VITE_DATABASE,
                import.meta.env.VITE_NOTICES_COLLECTION,
                [
                    Query.or(queryList),
                    Query.orderDesc('timestamp')
                ]
            );
        }

        return notices.documents;


    } catch (error) {
        console.error('Error fetching filtered notices:', error);
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
        if (error.code === 404) {
            console.log('Ha, 404. Kez inch. 🤪');
        } else {
            console.error('Error deleting notice:', error);
        }
    }
};

export const deleteAllNotices = async (userId) => {
    try {
        const notices = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            [Query.equal('user_id', userId)]
        );

        for (const notice of notices.documents) {
            await deleteNotice(notice.$id);
        }

        console.log(`All notices for user ${userId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user notices:', error);
        throw error;
    }
}

export const getUserInterests = async (userId) => {
    try {
        const response = await databases.getDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_INTERESTS_COLLECTION,
            userId
        );
        return response;
    } catch (error) {
        console.error('Error fetching user interests:', error);
    }
}

export const updateUserInterests = async (userId, selectedTags) => {
    try {
        const interestsData = {
            science: selectedTags.science || false,
            technology: selectedTags.technology || false,
            engineering: selectedTags.engineering || false,
            math: selectedTags.math || false,
            literature: selectedTags.literature || false,
            history: selectedTags.history || false,
            philosophy: selectedTags.philosophy || false,
            music: selectedTags.music || false,
            medicine: selectedTags.medicine || false,
            economics: selectedTags.economics || false,
            law: selectedTags.law || false,
            polSci: selectedTags.polSci || false,
            sports: selectedTags.sports || false
        };

        let response;

        try {
            response = await databases.updateDocument(
                import.meta.env.VITE_DATABASE,
                import.meta.env.VITE_INTERESTS_COLLECTION,
                userId,
                interestsData
            );
        } catch (updateError) {
            if (updateError.code === 404) {
                response = await databases.createDocument(
                    import.meta.env.VITE_DATABASE,
                    import.meta.env.VITE_INTERESTS_COLLECTION,
                    userId,
                    interestsData
                );
            } else {
                throw updateError;
            }
        }

        console.log('Interests updated successfully:', response);
        return response;
    } catch (error) {
        console.error('Error updating user interests:', error);
        throw error;
    }
};

export const createSpread = async (notice_id, author_id, user_id) => {
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SPREADS_COLLECTION,
            ID.unique(),
            {
                notice_id: notice_id,
                author_id: author_id,
                user_id: user_id
            }
        );
        console.log('Spread entry created successfully:', response);
        return response;
    } catch (error) {
        console.error('Error adding to spreads:', error);
        throw error;
    }
};

export const removeSpread = async (spread_id) => {
    try {
        const response = await databases.deleteDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SPREADS_COLLECTION,
            spread_id
        );
        console.log('Spread removed successfully:', response);
        return response;
    } catch (error) {
        console.error('Error removing spread:', error);
        throw error;
    }
}

export const createLike = async (notice_id, author_id, user_id) => {
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
            ID.unique(),
            {
                notice_id: notice_id,
                author_id: author_id,
                user_id: user_id
            }
        );
        console.log('Like created successfully:', response);
        return response;
    } catch (error) {
        console.error('Error adding to likes:', error);
        throw error;
    }
}

export const removeLike = async (like_id) => {
    try {
        const response = await databases.deleteDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
            like_id
        );
        console.log('Like removed successfully:', response);
        return response;
    } catch (error) {
        console.error('Error removing like:', error);
        throw error;
    }
}

export const getUserLikes = async (user_id) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
            [Query.equal('user_id', user_id)] // Get all likes for this user
        );
        return response.documents;
    } catch (error) {
        // console.error('Error fetching user likes:', error);
        return [];
    }
};

export const getAllLikedNotices = async (likedNoticeIds) => {
    try {
        if (likedNoticeIds.length === 0) {
            return []; // Return empty array if no likes
        }

        const allLikedNotices = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            [Query.equal('$id', likedNoticeIds)]
        );
        return allLikedNotices.documents;
    } catch (error) {
        console.error('Error fetching all liked notices:', error);
        return [];
    }
};

export const getUserSpreads = async (user_id) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SPREADS_COLLECTION,
            [
                Query.equal('user_id', user_id),
            ]
        )
        return response.documents;
    } catch (error) {
        // console.error('Error fetching spreads:', error);
    }
}

export const getAllSpreadNotices = async (spreadNoticeIds) => {
    try {
        if (spreadNoticeIds.length === 0) {
            return []; // Return empty array if no spread
        }

        const allSpreadNotices = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            [Query.equal('$id', spreadNoticeIds)]
        );
        return allSpreadNotices.documents;
    } catch (error) {
        console.error('Error fetching all spread notices:', error);
        return [];
    }
};

export const createReport = async (notice_id, author_id, reason, user_id) => {
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REPORTSE_COLLECTION,
            ID.unique(),
            {
                notice_id: notice_id,
                author_id: author_id,
                reason: reason,
                user_id: user_id
            }
        );
        console.log('Report created successfully');
        return response;
    } catch (error) {
        console.error('Error adding to reports:', error);
        throw error;
    }
}

export const createFollow = async (user_id, otherUser_id) => {
    try {
        // Check if follow relationship already exists
        const followRecords = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.equal('user_id', user_id)
            ]
        );

        const existingFollow = followRecords.documents.find(
            (follow) => follow.otherUser_id === otherUser_id
        );

        if (existingFollow) {
            // If the follow relationship exists, unfollow by deleting the document 
            await removeFollow(existingFollow.$id);
            console.log('Unfollowed successfully');
            return { unfollowed: true };
        } else {
            // Otherwise, create a new follow entry
            const response = await databases.createDocument(
                import.meta.env.VITE_DATABASE,
                import.meta.env.VITE_FOLLOWING_COLLECTION,
                ID.unique(),
                { user_id, otherUser_id }
            );
            console.log('Followed successfully');
            return { followed: true, id: response.$id };
        }
    } catch (error) {
        console.error('Error following/unfollowing user:', error);
        throw error;
    }
}

export const removeFollow = async (following_id) => {

    console.log('following_id', following_id);

    try {
        const response = await databases.deleteDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            following_id
        )
        console.log('Follow removed successfully');
        return response;
    } catch (error) {
        console.error('Follow removal failed', error);
    }
}

export const getUserFollowingsById = async (user_id) => {

    console.log('user_id:', user_id);

    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.equal('user_id', user_id),
            ]
        )
        // console.log('Successfully got following document.', response.documents);
        return response.documents;
    } catch (error) {
        console.error('Could not get following document', error);
    }
}

export const getUserFollowersById = async (otherUser_id) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.equal('otherUser_id', otherUser_id),
            ]
        )
        // console.log('Successfully got following document.', response.documents);
        return response.documents;
    } catch (error) {
        console.error('Error getting other user following:', error);
    }
}

export const getOtherUserFollowersById = async (otherUser_id) => {

    console.log('otherUser_id:', otherUser_id);

    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.equal('otherUser_id', otherUser_id),
            ]
        )
        console.log('Successfully got following document.', response.documents);
        return response.documents;
    } catch (error) {
        console.error('Could not get following document', error);
    }
}

export const getOtherUserFollowingsById = async (user_id) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.equal('user_id', user_id),
            ]
        )
        console.log('Successfully got following document.', response.documents);
        return response.documents;
    } catch (error) {
        console.error('Could not get following document', error);
    }
}

export const account = new Account(client);
export { ID } from 'appwrite';
