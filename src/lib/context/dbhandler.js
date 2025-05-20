import { Client, Storage, Account, Databases, ID, Query, Permission, Role, Functions } from 'appwrite';
import { dbFunctionKeysProvider } from './keysProvider';

export const endpointEnv = import.meta.env.VITE_ENDPOINT;
export const projectEnv = import.meta.env.VITE_PROJECT;

const client = new Client()
    .setEndpoint(endpointEnv)
    .setProject(projectEnv);

console.log('client - dbhandler.js', client);

export const account = new Account(client);

console.log('account - dbhandler.js', account);

const functions = new Functions(client);

console.log('functions - dbhandler.js', functions);

export default client;

const storage = new Storage(client);
export const databases = new Databases(client);

console.log('databases - dbhandler.js', databases);

const dbEnv = import.meta.env.VITE_DATABASE;
const usersCollEnv = import.meta.env.VITE_USERS_COLLECTION;
const blocksCollEnv = import.meta.env.VITE_BLOCKS_COLLECTION;
const noticesCollEnv = import.meta.env.VITE_NOTICES_COLLECTION;
const savesCollEnv = import.meta.env.VITE_SAVES_COLLECTION;
const reportsCollEnv = import.meta.env.VITE_REPORTS_COLLECTION;
const reportsReactionsCollEnv = import.meta.env.VITE_REPORTS_REACTIONS_COLLECTION;
const reportsUsersCollEnv = import.meta.env.VITE_REPORTS_USERS_COLLECTION;
const followersCollEnv = import.meta.env.VITE_FOLLOWERS_COLLECTION;
const followingCollEnv = import.meta.env.VITE_FOLLOWING_COLLECTION;
const likesCollEnv = import.meta.env.VITE_LIKES_COLLECTION;
const reactionsCollEnv = import.meta.env.VITE_REACTIONS_COLLECTION;
const interestsCollEnv = import.meta.env.VITE_INTERESTS_COLLECTION;
const permissionsCollEnv = import.meta.env.VITE_PERMISSIONS_COLLECTION;
const passcodesCollEnv = import.meta.env.VITE_PASSCODES_COLLECTION;
export const avatarBucketEnv = import.meta.env.VITE_AVATAR_BUCKET;

export const googleOAuthLogin = async () => {
    try {
        const baseUrl = window.location.origin

        account.createOAuth2Token(
            'google',
            `${baseUrl}/authenticate`,
            `${baseUrl}/`,
            ['profile', 'email'],
            {
                prompt: 'select_account'
            }
        )
    } catch (error) {
        console.error('Error logging in with google:', error);
    }
}

export const handleOAuthSession = async (userId, secret) => {

    try {
        await account.createSession(userId, secret);

        // Get the user data
        const user = await account.get();

        console.log('This is USER:', user);

        // User is now authenticated!
        return user;
    } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
    }
};

export const createAuthUser = async (email, password, name) => {

    try {
        const user = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        console.log('User in Auth created successfully:', user);

        return user;
    } catch (error) {
        if (error.code === 409) {
            return 'A user with the same email already exists.';
        } else if (error.code === 400) {
            return 'Password must be between 8 and 265 characters long, and should not be one of the commonly used password.';
        } else {
            console.error('Authentication failed:', error);
            return 'Something went wrong. Please try again later.';
        }
    }
};

export const getAccount = async () => {
    try {
        const accnt = await account.get();
        // console.log('Account gotten successfully:', accnt);
        return accnt;
    } catch (error) {
        console.error('Error getting account:', error);
        // throw error;
    }
}

export const updateAuthPassword = async (newPassword, oldPassword) => {
    try {
        const result = await account.updatePassword(
            newPassword,
            oldPassword
        );

        console.log('Password updated successfully.', result);

    } catch (error) {
        if (error.code === 401) {
            console.error('Error updating Auth User Password:', error);
            return 'Your current password is incorrect.'
        } else {
            console.error('Error updating Auth User Password:', error);
            return 'Something went wrong. Please try again later.';
        }

    }
}

export const createAuthPasswordRecovery = async (email, redirectUrl) => {
    try {
        const result = await account.createRecovery(
            email,
            redirectUrl
        );

        console.log('Success creating recovery:', result);

        return result;

    } catch (error) {
        console.error('Error creating password recovery:', error);
        if (error.code === 400) {
            return 'Invalid email address.';
        } else if (error.code === 404) {
            return 'No account is associated with this email address. Please check the email entered or sign up for a new account.';
        } else {
            return 'Error creating password recovery link. Please try again later.'
        }
    }
}

export const updateAuthPasswordRecovery = async (userId, secret, password) => {
    try {
        const result = await account.updateRecovery(
            userId,
            secret,
            password
        );

        console.log('Sccess updating recovery:', result);

        return result;

    } catch (error) {
        console.error('Error updating password recovery:', error);
        if (error.code === 401) {
            return 'This link has expired. Request a new recovery email.';
        } else {
            return 'Error updating your password. Please try again later.'
        }
    }
}

export const uploadAvatar = async (file) => {

    try {
        const response = await storage.createFile(
            avatarBucketEnv,
            ID.unique(),
            file,
        );
        return response;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        if (error.code === 400) {
            return 'Accepted file formats are PNG and JPG/JPEG.'
        } else {
            return 'Something went wrong. Please try again later.'
        }
    }
};

export const deleteAvatarFromStrg = async (fileId) => {
    try {
        const response = await storage.deleteFile(
            avatarBucketEnv,
            fileId,
        );
        console.log('Avatar deleted successfully:', response);
    } catch (error) {
        console.error('Error deleting avatar:', error);
    }
};

export const updateAvatar = async (userId, avatarId) => {

    try {
        const res = await databases.updateDocument(
            dbEnv,
            usersCollEnv,
            userId,
            {
                avatar: avatarId
            },
        );
        console.log('User profile updated successfully:', res);
        return res;
    } catch (error) {
        console.error('Error updating user avatar:', error);
        return 'Something went wrong. Please try again later.'
    }
};

export const deleteAvatarFromDoc = async (userId) => {
    try {


        await databases.updateDocument(
            dbEnv,
            usersCollEnv,
            userId,
            {
                avatar: null
            },
        );
        console.log('User profile avatar set to null successfully');
    } catch (error) {
        console.error('Error updating avatar in user document:', error);
    }
}

export const getUsersDocument = async () => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            usersCollEnv,
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

    if (!userId) {
        return;
    }

    try {
        const response = await databases.getDocument(
            dbEnv,
            usersCollEnv,
            userId
        );
        return response;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        if (error.code === 404) {
            return 404;
        }
    }
};

export const getUserByIdQuery = async (userId) => {

    if (!userId) {
        return;
    }

    try {
        const response = await databases.listDocuments(
            dbEnv,
            usersCollEnv,
            [Query.equal('$id', userId)]
        );
        return response;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
    }
};

export const getUsersByIdQuery = async (userIds) => {

    if (!userIds) {
        return;
    }

    try {
        const response = await databases.listDocuments(
            dbEnv,
            usersCollEnv,
            [Query.equal('$id', userIds)]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching users by IDs:', error);
    }
};

export const getUserByEmail = async (email) => {

    if (!email) {
        return;
    }

    try {
        const userList = await databases.listDocuments(
            dbEnv,
            usersCollEnv,
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
    console.log('getUserByUsername in dbhandler', username);

    try {
        const userList = await databases.listDocuments(
            dbEnv,
            usersCollEnv,
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

export const getAllUsersByString = async (str, limit, cursorAfter) => {

    try {
        const queryParams = [
            Query.contains('username', str),
            Query.limit(limit),
        ];

        if (cursorAfter) {
            queryParams.push(Query.cursorAfter(cursorAfter));
        }

        const userList = await databases.listDocuments(
            dbEnv,
            usersCollEnv,
            queryParams
        );

        if (userList.total > 0) {
            console.log('dbhandler.js - userList:', userList);
            return userList;
        }

        return null;
    } catch (error) {
        console.error('Error fetching user by string:', error);
        return null;
    }
};

export const checkUsernameExists = async (username) => {
    try {
        const users = await databases.listDocuments(
            dbEnv,
            usersCollEnv,
            [Query.equal('username', username.toLowerCase())]
        );
        return users.total > 0;
    } catch (error) {
        console.error('Error checking username existence:', error);
        throw error;
    }
};

export const createUser = async ({ id, email, given_name, username, accountType }) => {
    try {

        // checkin email
        const existingUser = await databases.listDocuments(
            dbEnv,
            usersCollEnv,
            [Query.equal('email', email)],
        );
        if (existingUser.total > 0) {
            console.log('User already exists:', existingUser.documents[0]);
            return;
        }

        // checking username
        const usernameExists = await checkUsernameExists(username);

        if (usernameExists) {
            console.log('Username already exists:', username);
            throw new Error('Username already exists');
        }

        const response = await databases.createDocument(
            dbEnv,
            usersCollEnv,
            id,
            {
                email,
                given_name,
                username: username.toLowerCase(),
                accountType
            },

        );
        console.log('Document created successfully:', response);
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
};

export const registerAuthUser = async (id, email, username) => {
    try {
        const newUsr = await account.create(
            id,
            email,
            'TmbkaberdiArum55',
            username.toLowerCase()
        );

        console.log('newUsr - dbhandler.js:', newUsr);

        return newUsr;
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

export const updateUser = async ({ userId, username }) => {
    try {
        const res = await databases.updateDocument(
            dbEnv,
            usersCollEnv,
            userId,
            {
                username: username
            },
        );
        console.log('Username successfully updated.');
        return res;
    } catch (error) {
        console.error('Error updating the username:', error);
        return 'Something went wrong. Please try again later.'
    }
};

export const updateUserWebsite = async ({ userId, website }) => {

    console.log('updateUserWebsite - userId', userId);
    console.log('updateUserWebsite - website', website);

    try {
        const res = await databases.updateDocument(
            dbEnv,
            usersCollEnv,
            userId,
            {
                website: website
            },
        );
        console.log('Website successfully updated.');
        return res;
    } catch (error) {
        console.error('Error updating the website:', error);
        return 'Something went wrong. Please try again later.'
    }
};

export const updateAuthUser = async (name) => {
    try {
        const authUsrnm = await account.updateName(name);

        console.log('Auth username updated successfully', authUsrnm);
        return authUsrnm;
    } catch (error) {
        console.error('Error updating auth username:', error);
        return 'Something went wrong. Please try again later.'
    }
};

export const checkIdExistsInAuth = async () => {
    try {
        const authId = await account.get();
        console.log('authId:', authId.$id);
        return authId.$id;
    } catch (error) {
        console.error('Error checking authId:', error);
    }
}

export const checkEmailExistsInAuth = async (email) => {
    try {
        // Trigger the cloud function with the user's email
        console.log('this email will be sent - dbhandler:', email);

        const payload = JSON.stringify({ email: email });
        console.log('Payload being sent:');
        console.log(payload);

        const user_auth_function_id = await dbFunctionKeysProvider('user_auth_function');

        if (!user_auth_function_id) {
            throw new Error('Failed to load function ID');
        }

        const response = await functions.createExecution(
            user_auth_function_id,
            payload
        );

        console.log('Function response:', response);
        console.log('Response status:', response.status);
        console.log('Response status code:', response.responseStatusCode);
        console.log('Response Body:', response.responseBody);

        if (response.status === 'completed') {
            try {
                const result = JSON.parse(response.responseBody);
                return result;
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                return false;
            }
        } else {
            console.error('Function execution failed:', execution.stderr);
            return false;
        }
    } catch (error) {
        console.error('Error checking email existence in Auth:', error);
        return false;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await databases.deleteDocument(
            dbEnv,
            usersCollEnv,
            userId,
        );
        console.log('User deleted successfully:', response);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

export const deleteAuthUser = async (userId) => {
    try {
        console.log('this userId will be deleted - dbhandler:', userId);
        const payload = JSON.stringify({ $id: userId });
        console.log('Payload being sent:');
        console.log(payload);

        const user_delete_function_id = await dbFunctionKeysProvider('user_delete_function');

        if (!user_delete_function_id) {
            throw new Error('Failed to load function ID');
        }

        const res = await functions.createExecution(
            user_delete_function_id,
            payload
        )
        if (res.status === 'completed') {
            try {
                const result = JSON.parse(res.responseBody);
                console.log(result);
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                return false;
            }
        } else {
            console.error("Failed to delete auth user");
        }
    } catch (error) {
        console.error('Error deleting auth user:', error);
    }
}

export const createUserSession = async (email, password) => {
    try {
        const userSession = await account.createEmailPasswordSession(email, password);
        console.log('Session created successfully:', userSession);
        return userSession;
    } catch (error) {
        console.error('Error creating session:', error);
        if (error.code === 401) {
            return 'Invalid credentials. Please check the email and password.';
        } else if (error.code === 429) {
            return 'Too many attempts. ';
        } else {
            return 'Something went wrong. Please try again later.';
        }
    }
}

export const getSession = async () => {
    try {
        const currentSession = await account.getSession('current');
        console.log('CURRENT SESS:', currentSession);
    } catch (error) {
        console.error('Error getting current session deets:', error);
    }
}

export const deleteUserSession = async () => {

    const currentSession = await account.getSession('current');

    console.log('currentSession', currentSession);

    try {
        if (currentSession) {
            await account.deleteSession(currentSession.$id);
            console.log('Session deleted successfully.');
        }
        console.log('REDIRECTING TO /');
    } catch (error) {
        console.error('Error deleting the session:', error);
    }
}

export const getSessionDetails = async () => {
    try {
        const sessDets = account.get();
        console.log('sessDets:', sessDets);
        return sessDets;
    } catch (error) {
        console.error('Error getting session details', error);
    }
}

export const deleteDoc = async (collectionEnv, doc_id) => {
    try {
        await databases.deleteDocument(
            dbEnv,
            collectionEnv,
            doc_id
        )
    } catch (error) {
        console.error('Error deleting doc:', error);
    }
}

export const createNotice = async ({ user_id, text, timestamp, expiresAt, noticeType, noticeGif, noticeUrl, science, technology, engineering, math, literature, history, philosophy, music, medicine, economics, law, polSci, sports
}) => {
    try {
        const response = await databases.createDocument(
            dbEnv,
            noticesCollEnv,
            ID.unique(),
            {
                user_id,
                text,
                timestamp,
                expiresAt,
                noticeType,
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
                sports: sports || false,
                noticeGif,
                noticeUrl
            },
            // [
            //     Permission.write(Role.users()),
            //     Permission.write(Role.guests())
            // ]
        );
        console.log('Notice created succesfully:', response);
        return response;
    } catch (error) {
        console.error('Error creating notice:', error);
    }
};

export const getUserNotices = async (user_id, limit, lastId) => {
    try {
        const queries = [
            Query.equal('user_id', user_id),
            Query.limit(limit),
            Query.orderDesc('timestamp'),
        ];

        if (lastId) {
            queries.push(Query.cursorAfter(lastId));
        }

        const response = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
            queries
        );

        return response.documents;

    } catch (error) {
        console.error('Error fetching notices:', error);
        return [];
    }
};

export const getNoticeByUserId = async (user_id, limit, offset) => {
    try {
        console.log('user_id, limit, offset - dbhandler', { user_id, limit, offset });

        if (user_id === null || undefined) {
            return [];
        }

        const res = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
            [
                Query.equal('user_id', user_id),
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc('timestamp')
            ]
        );
        return res.documents;
    } catch (error) {
        console.error('Error getting notice by user id:', error);
    }
}

export const getNoticeByTagname = async (tagnames) => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
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

export const getNoticeByNoticeId = async (notice_id) => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
            [
                Query.equal('$id', notice_id),
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error getting notices by notice_id:', error);
        return [];
    }
};

export const getAllNotices = async () => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
            [
                Query.orderDesc('timestamp')
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching notices:', error);
    }
}

// export const getFilteredNotices = async (selectedTags, limit, lastId) => {
//     try {
//         if (typeof selectedTags !== 'object' || selectedTags === null) {
//             throw new Error('selectedTags must be an object');
//         }

//         const queryList = Object.keys(selectedTags)
//             .filter(tagKey => selectedTags[tagKey] === true)
//             .map(tagKey => Query.equal(tagKey, true));

//         const queries = [
//             Query.notEqual('noticeType', ['organization']),
//             Query.limit(limit),
//             Query.orderDesc('timestamp'),
//         ];

//         // Add the cursor query if lastId exists
//         if (lastId) {
//             queries.push(Query.cursorAfter(lastId));
//         }

//         // Add additional filters based on selectedTags
//         if (queryList.length === 1) {
//             queries.push(queryList[0]);
//         } else if (queryList.length > 1) {
//             queries.push(Query.or(queryList));
//         }

//         const notices = await databases.listDocuments(
//             dbEnv,
//             noticesCollEnv,
//             queries
//         );

//         return notices.documents;
//     } catch (error) {
//         console.error('Error fetching filtered notices:', error);
//     }
// };

export const getFilteredNotices = async (selectedTags, limit, lastId, userId) => {
    try {
        if (typeof selectedTags !== 'object' || selectedTags === null) {
            throw new Error('selectedTags must be an object');
        }

        const unselectedTags = Object.values(selectedTags).filter((tagValue) => tagValue === false);

        console.log('unselectedTags:', unselectedTags);

        if (unselectedTags.length === 13) {
            return [];
        };

        const [blockedUsers, usersBlockingMe] = await Promise.all([
            getBlockedUsersByUser(userId),
            getUsersBlockingUser(userId)
        ]);

        const blockedIds = blockedUsers.map(user => user.blocked_id);
        const blockingIds = usersBlockingMe.map(user => user.blocker_id);
        const allBlockedIds = [...new Set([...blockedIds, ...blockingIds])];

        console.log('allBlockedIds', allBlockedIds);

        const queryList = Object.keys(selectedTags)
            .filter(tagKey => selectedTags[tagKey] === true)
            .map(tagKey => Query.equal(tagKey, true));

        const queries = [
            Query.notEqual('noticeType', ['organization']),
            ...(allBlockedIds.length > 0 ? allBlockedIds.map(id => Query.notEqual('user_id', id)) : []),
            Query.limit(limit),
            Query.orderDesc('timestamp'),
        ];

        if (lastId) {
            queries.push(Query.cursorAfter(lastId));
        }

        if (queryList.length === 1) {
            queries.push(queryList[0]);
        } else if (queryList.length > 1) {
            queries.push(Query.or(queryList));
        }

        const notices = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
            queries
        );

        if (notices.total === 0) {
            return;
        }

        return notices.documents;
    } catch (error) {
        console.error('Error fetching filtered notices:', error);
    }
};

export const updateNotice = async (noticeId, newText) => {
    try {
        const response = await databases.updateDocument(
            dbEnv,
            noticesCollEnv,
            noticeId,
            {
                text: newText
            },
            // [
            //     Permission.update(Role.users()),
            //     Permission.update(Role.guests())
            // ]
        );
        console.log('Notice updated successfully:', response);
        return response;
    } catch (error) {
        console.error('Error updating notice:', error);
    }
};

export const deleteNotice = async (noticeId) => {
    console.log('Attempting to delete notice with ID:', noticeId);
    try {

        await Promise.allSettled([
            removeAllSavesForNotice(noticeId),
            removeAllLikesForNotice(noticeId),
            deleteAllReactionsForOneNotice(noticeId),
        ])

        await deleteDoc(
            noticesCollEnv,
            noticeId
        );
        // const response = await databases.deleteDocument(
        //     dbEnv,
        //     noticesCollEnv,
        //     noticeId,
        // );
        console.log('Notice deleted successfully.');
    } catch (error) {
        if (error.code === 404) {
            console.log('Ha, 404. Kez inch. 🤪');
        } else {
            console.error('Error deleting notice:', error);
        }
    }
};

export const saveDeletedNoticeId = async (notice_id) => {
    console.log('Attempting to save notice ID of deleted Notice:', notice_id);
    try {
        const response = await databases.createDocument(
            dbEnv,
            import.meta.env.VITE_DELETED_NOTICES_COLLECTION,
            ID.unique(),
            { notice_id }
        );
        console.log('Deleted notice id added successfully:', response);
        return response;
    } catch (error) {
        console.error('Error adding deleted notice id:', error);
    }
};

export const deleteAllNotices = async (userId) => {

    try {
        const notices = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
            [Query.equal('user_id', userId)]
        );

        const deletionTasks = notices.documents.map(async (notice) => {

            await Promise.allSettled([
                removeAllLikesForNotice(notice.$id),
                removeAllSavesForNotice(notice.$id),
                deleteAllReactionsForOneNotice(notice.$id)
            ]);

            await deleteDoc(
                noticesCollEnv,
                notice.$id
            );
        });

        await Promise.all(deletionTasks);

        console.log(`All notices for user ${userId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user notices:', error);
        throw error;
    }
};

export const getUserInterests = async (userId) => {
    try {
        const response = await databases.getDocument(
            dbEnv,
            interestsCollEnv,
            userId
        );
        console.log('response in getUserInterests', response);

        if (response) {
            return response;
        } else {
            return;
        }
    } catch (error) {
        if (error.code === 404) {
            console.log('User hasn\'t set their interests yet.');
        } else {
            console.error('Error fetching user interests:', error);
        }
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
                dbEnv,
                interestsCollEnv,
                userId,
                interestsData,
            );
        } catch (updateError) {
            if (updateError.code === 404) {
                response = await databases.createDocument(
                    dbEnv,
                    interestsCollEnv,
                    userId,
                    interestsData,
                );
            } else {
                throw updateError;
            }
        }

        console.log('Interests updated successfully:', response);
        return response;
    } catch (error) {
        console.error('Error updating user interests:', error);
        return 'Something went wrong. Please try again later.';
    }
};

export const createUserPermissions = async (userId) => {
    try {
        const permissions = await databases.createDocument(
            dbEnv,
            permissionsCollEnv,
            userId,
            {
                btns_reaction_perm: true,
                txt_reaction_perm: true
            }
        )
        console.log('User permissions created successfully:', permissions);

        return { btns_reaction_perm: permissions.btns_reaction_perm, txt_reaction_perm: permissions.txt_reaction_perm };
    } catch (error) {
        console.error('Error getting user permissions:', error);
    }
}

export const getUserPermissions = async (userId) => {
    try {
        const permissions = await databases.getDocument(
            dbEnv,
            permissionsCollEnv,
            userId
        )
        console.log('perm in dbhandler.js:', permissions);

        return { btns_reaction_perm: permissions.btns_reaction_perm, txt_reaction_perm: permissions.txt_reaction_perm };
    } catch (error) {
        console.error('Error getting user permissions:', error);
    }
}

export const getUserPermissionsByIdQuery = async (userId) => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            permissionsCollEnv,
            [Query.equal('$id', userId)]
        );
        return response.documents;
    } catch (error) {
        console.error('Error querying user permission by ID:', error);
        throw error;
    }
};

export const updateUserPermissions = async (userId, btns_reaction_perm, txt_reaction_perm) => {
    try {

        let response;

        try {
            response = await databases.updateDocument(
                dbEnv,
                permissionsCollEnv,
                userId,
                {
                    btns_reaction_perm,
                    txt_reaction_perm
                }
            );
        } catch (updateError) {
            if (updateError.code === 404) {
                response = await databases.createDocument(
                    dbEnv,
                    permissionsCollEnv,
                    userId,
                    {
                        btns_reaction_perm,
                        txt_reaction_perm
                    }
                );
            } else {
                throw updateError;
            }
        }

        console.log({ btns_reaction_perm: response.btns_reaction_perm, txt_reaction_perm: response.txt_reaction_perm });
        return { btns_reaction_perm: response.btns_reaction_perm, txt_reaction_perm: response.txt_reaction_perm };
    } catch (error) {
        console.error('Error updating user permissions:', error);
        return 'Something went wrong. Please try again later.';
    }
};

export const deleteUserInterestsFromDB = async (userId) => {
    try {
        await deleteDoc(
            interestsCollEnv,
            userId
        )
        console.log(`${userId}'s interests doc deleted from DB.`);
    } catch (error) {
        console.error('Error deleting user\'s interests doc from DB:', error);
    }
}

export const createSave = async (notice_id, author_id, user_id) => {
    try {
        const response = await databases.createDocument(
            dbEnv,
            savesCollEnv,
            ID.unique(),
            {
                notice_id: notice_id,
                author_id: author_id,
                user_id: user_id
            },
            // [
            //     Permission.write(Role.users()),
            //     Permission.write(Role.guests())
            // ]
        );
        console.log('Save entry created successfully:', response);
        return response;
    } catch (error) {
        console.error('Error adding to saves:', error);
        throw error;
    }
};

export const removeSave = async (save_id) => {
    try {
        const response = await databases.deleteDocument(
            dbEnv,
            savesCollEnv,
            save_id,
        );
        console.log('Save removed successfully.');
        return response;
    } catch (error) {
        console.error('Error removing save:', error);
        throw error;
    }
}

export const removeAllSavesByUser = async (user_id) => {

    try {
        const saves = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            [Query.equal('user_id', user_id)]
        )

        const removeSavePromises = saves.documents.map(save =>
            // removeSave(save.$id)
            deleteDoc(
                savesCollEnv,
                save.$id
            )
        );

        await Promise.all(removeSavePromises);

        console.log(`All saves from user ${user_id} removed successfully.`);
    } catch (error) {
        console.error('Error removing all saves:', error);
    }
}

export const removeAllSavesForAuthor = async (author_id) => {

    try {
        const saves = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            [Query.equal('author_id', author_id)]
        )

        const removeSavePromises = saves.documents.map(save =>
            // removeSave(save.$id)
            deleteDoc(
                savesCollEnv,
                save.$id
            )
        );

        await Promise.all(removeSavePromises);

        console.log(`All saves for ${author_id}'s notices removed successfully.`);
    } catch (error) {
        console.error('Error removing all saves:', error);
    }
}

export const removeAllSavesForNotice = async (notice_id) => {

    try {
        const saves = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            [Query.equal('notice_id', notice_id)]
        )

        const removeSavePromises = saves.documents.map(save =>
            // removeSave(save.$id)
            deleteDoc(
                savesCollEnv,
                save.$id
            )
        );

        await Promise.all(removeSavePromises);

        console.log(`Removed all saves for notice id:`, notice_id);
    } catch (error) {
        console.error('Error removing saves from the db:', error);
    }
}

export const createLike = async (notice_id, author_id, user_id) => {
    try {
        const response = await databases.createDocument(
            dbEnv,
            likesCollEnv,
            ID.unique(),
            {
                notice_id: notice_id,
                author_id: author_id,
                user_id: user_id
            },
            // [
            //     Permission.write(Role.users()),
            //     Permission.write(Role.guests())
            // ]
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
            dbEnv,
            likesCollEnv,
            like_id,
        );
        console.log('Like removed successfully.');
        return response;
    } catch (error) {
        console.error('Error removing like:', error);
        throw error;
    }
}

export const removeAllLikesByUser = async (user_id) => {

    try {
        const likes = await databases.listDocuments(
            dbEnv,
            likesCollEnv,
            [Query.equal('user_id', user_id)]
        )

        const removeLikesPromises = likes.documents.map(like =>
            // removeLike(like.$id)
            deleteDoc(
                likesCollEnv,
                like.$id
            )
        );

        await Promise.all(removeLikesPromises);

        console.log(`All likes from user ${user_id} removed successfully.`);
    } catch (error) {
        console.error('Error removing all likes:', error);
    }
}

export const removeAllLikesForAuthor = async (author_id) => {

    try {
        const likes = await databases.listDocuments(
            dbEnv,
            likesCollEnv,
            [Query.equal('author_id', author_id)]
        )

        const removeLikesPromises = likes.documents.map(like =>
            // removeLike(like.$id)
            deleteDoc(
                likesCollEnv,
                like.$id
            )
        );

        await Promise.all(removeLikesPromises);

        console.log(`All likes for ${author_id}'s removed successfully.`);
    } catch (error) {
        console.error('Error removing all likes:', error);
    }
}

export const removeAllLikesForNotice = async (notice_id) => {

    try {
        const likes = await databases.listDocuments(
            dbEnv,
            likesCollEnv,
            [Query.equal('notice_id', notice_id)]
        )

        const removeLikesPromises = likes.documents.map(like =>
            // removeLike(like.$id)
            deleteDoc(
                dbEnv,
                likesCollEnv,
                like.$id
            )
        );

        await Promise.all(removeLikesPromises);

        console.log(`Removed all likes for notice id:`, notice_id);
    } catch (error) {
        console.error('Error removing likes from the db:', error);
    }
}

// The like icon + user's likes tab 
export const getUserLikes = async (user_id, noticeIds) => {
    try {
        const [blockedUsers, usersBlockingMe] = await Promise.all([
            getBlockedUsersByUser(user_id),
            getUsersBlockingUser(user_id)
        ]);

        const blockedIds = blockedUsers.map(user => user.blocked_id);
        const blockingIds = usersBlockingMe.map(user => user.blocker_id);
        const allBlockedIds = [...new Set([...blockedIds, ...blockingIds])];

        if (!Array.isArray(noticeIds) || noticeIds.length === 0) {
            return [];
        }

        const response = await databases.listDocuments(
            dbEnv,
            likesCollEnv,
            [
                Query.equal('user_id', user_id),
                Query.equal('notice_id', noticeIds),
                ...(allBlockedIds.length > 0 ? allBlockedIds.map(id => Query.notEqual('author_id', id)) : []),
                Query.orderDesc('$createdAt')
            ]
        );

        console.log('Filtered getUserLikes', response.documents);

        return response.documents;
    } catch (error) {
        console.error('Error fetching user likes:', error);
        return [];
    }
};

export const getUserLikesNotInFeed = async (user_id, visitor_id, limit, offset) => {

    try {
        const [blockedUsers, usersBlockingMe] = await Promise.all([
            getBlockedUsersByUser(visitor_id),
            getUsersBlockingUser(visitor_id)
        ]);

        // const asd = await isUserBlockedByOtherUser(otherUser_id, user_id);

        const blockedIds = blockedUsers.map(user => user.blocked_id);
        const blockerIds = usersBlockingMe.map(user => user.blocker_id);
        const allBlockedIds = [...new Set([...blockedIds, ...blockerIds])];

        console.log('dbhandler - getUserLikesNotInFeed blockedIds', blockedIds);
        console.log('dbhandler - getUserLikesNotInFeed blockerIds', blockerIds);

        // const asdasda = await getBlockedUsersByUserTwo(allBlockedIds)

        console.log('EEEEEEEEEEEEEEEEEEEE', allBlockedIds);


        console.log('dbhandler - getUserLikesNotInFeed user_id', user_id);
        console.log('dbhandler - getUserLikesNotInFeed limit', limit);
        console.log('dbhandler - getUserLikesNotInFeed offset', offset);

        const response = await databases.listDocuments(
            dbEnv,
            likesCollEnv,
            [
                Query.equal('user_id', user_id),
                // Query.equal('notice_id', noticeIdsInProfile),
                ...(allBlockedIds.length > 0 ? allBlockedIds.map(id => Query.notEqual('author_id', id)) : []),
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc('$createdAt')
            ]
        );

        console.log('dbhandler - getUserLikesNotInFeed', response.documents);

        return response.documents;
    } catch (error) {
        console.error('Error fetching user likes:', error);
        return [];
    }
};

// The full notice for likes
export const getAllLikedNotices = async (likedNoticeIds) => {
    try {
        if (likedNoticeIds.length === 0) {
            return [];
        }

        console.log('dbhandler - likedNoticeIds', likedNoticeIds);


        const allLikedNotices = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
            [
                Query.equal('$id', likedNoticeIds),
                // Query.notEqual('noticeType', ['organization']),
                // Query.limit(limit),
                // Query.offset(offset),
                Query.orderDesc('$createdAt')
            ]
        );

        console.log('dbhandler - full notice', allLikedNotices.documents);

        return allLikedNotices.documents;
    } catch (error) {
        console.error('Error fetching all liked notices:', error);
        return [];
    }
};

export const getAllLikesByNoticeId = async (notice_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            likesCollEnv,
            [Query.equal('notice_id', notice_id)]
        )
        return res;
    } catch (error) {
        console.error('Error getting all likes by notice id.', error);
    }
}

export const getAllLikesTotalByNoticeId = async (notice_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            likesCollEnv,
            [Query.equal('notice_id', notice_id)]
        )
        return res.documents;
    } catch (error) {
        console.error('Error getting all likes by notice id.', error);
    }
}

// The save icon + user's saves tab 
export const getUserSaves = async (user_id, noticeIds) => {
    try {
        if (!Array.isArray(noticeIds) || noticeIds.length === 0) {
            return [];
        }

        const [blockedUsers, usersBlockingMe] = await Promise.all([
            getBlockedUsersByUser(user_id),
            getUsersBlockingUser(user_id)
        ]);

        const blockedIds = blockedUsers.map(user => user.blocked_id);
        const blockingIds = usersBlockingMe.map(user => user.blocker_id);
        const allBlockedIds = [...new Set([...blockedIds, ...blockingIds])];

        const queries = [
            Query.equal('user_id', user_id),
            Query.equal('notice_id', noticeIds),
            ...(allBlockedIds.length > 0 ? allBlockedIds.map(id => Query.notEqual('author_id', id)) : []),
            Query.orderDesc('$createdAt')
        ];

        const response = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            queries
        );

        return response.documents;
    } catch (error) {
        console.error('Error getting saves:', error);
        return [];
    }
};

export const getUserSavesNotInFeed = async (user_id, visitor_id, limit, offset) => {
    try {

        const [blockedUsers, usersBlockingMe] = await Promise.all([
            getBlockedUsersByUser(visitor_id),
            getUsersBlockingUser(visitor_id)
        ]);

        const blockedIds = blockedUsers.map(user => user.blocked_id);
        const blockingIds = usersBlockingMe.map(user => user.blocker_id);
        const allBlockedIds = [...new Set([...blockedIds, ...blockingIds])];

        console.log('dbhandler - limit', limit);
        console.log('dbhandler - offset', offset);

        const response = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            [
                Query.equal('user_id', user_id),
                ...(allBlockedIds.length > 0 ? allBlockedIds.map(id => Query.notEqual('author_id', id)) : []),
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc('$createdAt')
            ]
        )
        return response.documents;
    } catch (error) {
        console.error('Error getting saves:', error);
    }
}

// The full notice for saves
export const getAllSavedNotices = async (saveNoticeIds) => {
    try {
        if (saveNoticeIds.length === 0) {
            return [];
        }

        const allSavedNotices = await databases.listDocuments(
            dbEnv,
            noticesCollEnv,
            [
                Query.equal('$id', saveNoticeIds),
                // Query.notEqual('noticeType', ['organization']),
                // Query.limit(limit),
                // Query.offset(offset),
                Query.orderDesc('$createdAt')
            ]
        );
        return allSavedNotices.documents;
    } catch (error) {
        console.error('Error fetching all save notices:', error);
        return [];
    }
};

export const getAllSavesByNoticeId = async (notice_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            [Query.equal('notice_id', notice_id)]
        )
        return res;
    } catch (error) {
        console.error('Error getting all saves by notice id.', error);
    }
}

export const getAllSavesTotalByNoticeId = async (notice_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            [Query.equal('notice_id', notice_id)]
        )
        return res.documents;
    } catch (error) {
        console.error('Error getting all saves by notice id.', error);
    }
}


export const createReport = async (notice_id, author_id, reason, user_id, noticeText) => {
    try {
        const response = await databases.createDocument(
            dbEnv,
            reportsCollEnv,
            ID.unique(),
            {
                notice_id: notice_id,
                author_id: author_id,
                reason: reason,
                user_id: user_id,
                noticeText: noticeText
            },
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
            dbEnv,
            followingCollEnv,
            [Query.equal('user_id', user_id)]
        );

        const existingFollow = followRecords.documents.find(
            (follow) => follow.otherUser_id === otherUser_id
        );

        if (existingFollow) {
            // If the follow relationship exists, unfollow by deleting the document 
            // await removeFollow(existingFollow.$id);
            await deleteDoc(
                followingCollEnv,
                existingFollow.$id
            )
            console.log(`${user_id} unfollowed ${otherUser_id} successfully.`);
            return { unfollowed: true };
        } else {
            // Otherwise, create a new follow entry
            const response = await databases.createDocument(
                dbEnv,
                followingCollEnv,
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

    console.log('following doc id', following_id);

    try {
        const response = await databases.deleteDocument(
            dbEnv,
            followingCollEnv,
            following_id //follow doc id
        )
        console.log('Follow removed successfully');
        return response;
    } catch (error) {
        console.error('Follow removal failed', error);
    }
}

export const removeAllFollows = async (user_id) => {

    try {
        const follows = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [Query.equal('user_id', user_id)]
        )

        const removeFollowPromises = follows.documents.map(follow =>
            // removeFollow(follow.$id)
            deleteDoc(
                followingCollEnv,
                follow.$id
            )
        );

        await Promise.all(removeFollowPromises);

        console.log(`All follows made by ${user_id} removed successfully.`);
    } catch (error) {
        console.error('Error removing all follows:', error);
    }
}

export const removeAllFollowed = async (user_id) => {

    try {
        const followeds = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [Query.equal('otherUser_id', user_id)]
        )

        const removeFollowPromises = followeds.documents.map(follow =>
            // removeFollow(follow.$id)
            deleteDoc(
                followingCollEnv,
                follow.$id
            )
        );

        await Promise.all(removeFollowPromises);

        console.log(`No account no longer follows ${user_id}.`);
    } catch (error) {
        console.error('Error removing all follows:', error);
    }
}

export const unfollow = async (user_id, otherUser_id) => {

    try {
        const res = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [
                Query.or([
                    Query.and([Query.equal('user_id', user_id), Query.equal('otherUser_id', otherUser_id)]),
                    Query.and([Query.equal('user_id', otherUser_id), Query.equal('otherUser_id', user_id)])
                ])
            ]
        )

        console.log('Follow instance FOUND:', res);

        for (const r of res.documents) {
            // await removeFollow(r.$id);
            await deleteDoc(
                followingCollEnv,
                r.$id
            );
        }

        console.log(`${user_id} successfully unfollowed ${otherUser_id}.`);

    } catch (error) {
        console.error('Error unfollowing:', error);
    }
}

export const followedByUserCount = async (user_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [
                Query.equal('user_id', user_id)
            ]
        )
        return res.total;
    } catch (error) {
        console.error('Error followed by count:', error);
    }
}

export const followingTheUserCount = async (user_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [
                Query.equal('otherUser_id', user_id)
            ]
        )
        return res.total;
    } catch (error) {
        console.error('Error followed by count:', error);
    }
}

export const getUserFollowingsById = async (user_id, limit, offset) => {
    console.log('Fetching followings with params:', {
        user_id,
        limit,
        offset
    });

    try {
        const response = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [
                Query.equal('user_id', user_id),
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc('$createdAt')
            ]
        )
        // console.log('Successfully got following document.', response.documents);
        return response.documents;
    } catch (error) {
        console.error('Could not get following document', error);
    }
}

export const getUserFollowersById = async (otherUser_id, limit, offset) => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [
                Query.equal('otherUser_id', otherUser_id),
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc('$createdAt')
            ]
        )
        // console.log('Successfully got following document.', response.documents);
        return response.documents;
    } catch (error) {
        console.error('Error getting other user following:', error);
    }
}

export const getFollowStatus = async (user_id, otherUser_id) => {
    console.log('getting follow status - 1', { user_id, otherUser_id });

    if (!user_id || !otherUser_id) {
        return;
    }

    try {
        const res = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [
                Query.and([Query.equal('user_id', user_id), Query.equal('otherUser_id', otherUser_id)])
            ]
        )
        console.log('AND QUERY', res);

        return res;
    } catch (error) {
        console.error('Error matching with user', error);
    }
}

export const getFollowingStatus = async (otherUser_id, user_id) => {
    console.log('Is other user following me?', { otherUser_id, user_id, });

    if (!user_id || !otherUser_id) {
        return;
    }

    try {
        const res = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [
                Query.and([Query.equal('user_id', otherUser_id), Query.equal('otherUser_id', user_id)])
            ]
        )
        console.log('AND QUERY', res);

        return res;
    } catch (error) {
        console.error('Error matching with user', error);
    }
}

export const getPersonalFeedAccounts = async (user_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            followingCollEnv,
            [
                Query.equal('user_id', user_id)
            ]
        )

        console.log("LET'S SEEEE:", res);

        if (res.total === 0) {
            return;
        }

        const otherUserIds = res.documents.map(otherUser => otherUser.otherUser_id)

        console.log("OTHERUSERIDS:", otherUserIds);

        const personalFeedUserAccnts = await getUserByIdQuery(otherUserIds);

        console.log("OTHERUSERACCNTS:", personalFeedUserAccnts);

        return personalFeedUserAccnts.documents;

    } catch (error) {
        console.error('Error getting personal feed acounts:', error);
    }
}

export const createReaction = async (sender_id, recipient_id, content, timestamp, notice_id, expiresAt, reactionGif) => {
    try {
        const response = await databases.createDocument(
            dbEnv,
            reactionsCollEnv,
            ID.unique(),
            {
                sender_id,
                recipient_id,
                content,
                timestamp,
                notice_id,
                expiresAt,
                reactionGif
            },
        )
        // console.log('Reaction created successfuly:', response);
        return response;
    } catch (error) {
        console.error('Error creating reaction:', error);
    }
}

export const deleteReaction = async (reactionId) => {
    console.log('Attempting to delete reaction with ID:', reactionId);
    try {
        const response = await databases.deleteDocument(
            dbEnv,
            reactionsCollEnv,
            reactionId,
        );
        console.log('Reaction deleted successfully:', response);
    } catch (error) {
        if (error.code === 404) {
            console.log('Ha, 404. Kez inch. 🤪');
        } else {
            console.error('Error deleting reaction:', error);
        }
    }
};

export const deleteAllSentReactions = async (sender_id) => {

    try {
        const reactions = await databases.listDocuments(
            dbEnv,
            reactionsCollEnv,
            [Query.equal('sender_id', sender_id)],
        );

        const deleteSentReactionPromises = reactions.documents.map(reaction =>
            // deleteReaction(reaction.$id)
            deleteDoc(
                reactionsCollEnv,
                reaction.$id
            )
        );

        await Promise.all(deleteSentReactionPromises);

        console.log(`All reactions from user ${sender_id} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user reactions:', error);
        throw error;
    }
}

export const deleteAllRecievedReactions = async (recipient_id) => {

    try {

        const reactions = await databases.listDocuments(
            dbEnv,
            reactionsCollEnv,
            [Query.equal('recipient_id', recipient_id)],
        );

        const deletePromises = reactions.documents.map(reaction =>
            // deleteReaction(reaction.$id)
            deleteDoc(
                reactionsCollEnv,
                reaction.$id
            )
        );

        await Promise.all(deletePromises);

        console.log(`All reactions for ${recipient_id}'s notices deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user reactions:', error);
        throw error;
    }
}

export const deleteAllReactionsForOneNotice = async (notice_id) => {

    try {
        console.log('deleteAllReactionsForOneNotice:', notice_id);

        const reactions = await databases.listDocuments(
            dbEnv,
            reactionsCollEnv,
            [Query.equal('notice_id', notice_id)],
        );

        const deleteOnReactionForOneNoticePromises = reactions.documents.map(reaction =>
            deleteDoc(
                reactionsCollEnv,
                reaction.$id
            )
        );

        await Promise.all(deleteOnReactionForOneNoticePromises);

        console.log(`All reactions for notice ${notice_id}'s deleted successfully.`);
    } catch (error) {
        console.error('Error deleting notice\'s reactions:', error);
        throw error;
    }
}

export const allReactionsForOneNotice = async (notice_id) => {
    try {
        console.log('allReactionsForOneNotice:', notice_id);

        const reactions = await databases.listDocuments(
            dbEnv,
            reactionsCollEnv,
            [Query.equal('notice_id', notice_id)],
        );

        console.log('reactions docs:', reactions);

    } catch (error) {
        console.error('Error deleting notice\'s reactions:', error);
        throw error;
    }
}

export const getAllReactions = async () => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            reactionsCollEnv
        )
        console.log('Successfully got ALL reactions.:', response);
        return response;
    } catch (error) {
        console.error('Error getting ALL reactions:', error);
    }
}

export const getAllReactionsBySenderId = async (sender_id) => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            reactionsCollEnv,
            [
                Query.equal('sender_id', sender_id),
            ]
        )
        console.log('Successfully got reactions by sender doc.:', response);
        return response;
    } catch (error) {
        console.error('Error getting reactions by sender:', error);
    }
}

export const getAllReactionsByRecipientId = async (recipient_id) => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            reactionsCollEnv,
            [
                Query.equal('recipient_id', recipient_id),
            ]
        )
        console.log('Successfully got reactions by recipient_id doc.:', response);
        return response;
    } catch (error) {
        console.error('Error getting reactions by recipient_id:', error);
    }
}

export const getAllReactionsByNoticeId = async (notice_id, limit, cursor = null) => {
    try {
        const queries = [
            Query.equal('notice_id', notice_id),
            Query.limit(limit),
            Query.orderDesc('$createdAt')
        ];

        if (cursor) {
            queries.push(Query.cursorAfter(cursor));
        }

        const response = await databases.listDocuments(
            dbEnv,
            reactionsCollEnv,
            queries
        )

        return response;
    } catch (error) {
        console.error('Error getting reactions by notice_id:', error);
    }
}

export const getReactionByReactionId = async (reactionId) => {
    try {
        const reaction = await databases.getDocument(
            dbEnv,
            reactionsCollEnv,
            reactionId
        )
        console.log('Success getting reaction:', reaction);
        return reaction;
    } catch (error) {
        console.error('Error getting reaction:', error);
    }
}

export const createReactionReport = async (reaction_id, author_id, reason, user_id, reaction_text) => {
    try {
        const response = await databases.createDocument(
            dbEnv,
            reportsReactionsCollEnv,
            ID.unique(),
            {
                reaction_id: reaction_id,
                author_id: author_id,
                reason: reason,
                user_id: user_id,
                reaction_text: reaction_text
            },
            // [
            //     Permission.write(Role.users()),
            //     Permission.write(Role.guests())
            // ]
        );
        console.log('Report created successfully');
        return response;
    } catch (error) {
        console.error('Error adding to reports:', error);
        throw error;
    }
}

export const createPassocde = async (user_id, passcode, accountType) => {
    try {
        console.log('usr id', user_id);
        console.log('passcode', passcode);
        console.log('accountType', accountType);
        const response = await databases.createDocument(
            dbEnv,
            passcodesCollEnv,
            ID.unique(),
            {
                user_id,
                passcode,
                accountType
            }
        )
        console.log('Passcode created successfuly.');
        return response;
    } catch (error) {
        console.error('Error creating passcode:', error);
    }
}

export const updatePassocde = async (user_id, passcode) => {
    try {
        console.log('usr id', user_id);

        const listResponse = await databases.listDocuments(
            dbEnv,
            passcodesCollEnv,
            [Query.equal('user_id', user_id)]
        );

        const documentId = listResponse.documents[0].$id;

        const updateResponse = await databases.updateDocument(
            dbEnv,
            passcodesCollEnv,
            documentId,
            { passcode: passcode }
        );

        console.log('Passcode updated successfully.');

        return updateResponse;

    } catch (error) {
        console.error('Error updating passcode:', error);
        return 'Something happened. Please try again later.'
    }
}

export const deletePassocde = async (user_id) => {

    try {
        const passcodeDocs = await databases.listDocuments(
            dbEnv,
            passcodesCollEnv,
            [Query.equal('user_id', user_id)]
        );

        if (passcodeDocs.total > 0) {

            const docId = passcodeDocs.documents[0].$id;

            await deleteDoc(
                passcodesCollEnv,
                docId
            )

            // await databases.deleteDocument(
            //     dbEnv,
            //     passcodesCollEnv,
            //     docId
            // )
        }

        console.log('Passcode deleted successfully.');

    } catch (error) {
        console.error('Error deleting passcode:', error);
    }
}

export const getPassocdeByOrganizationId = async (user_id) => {
    try {
        const response = await databases.listDocuments(
            dbEnv,
            passcodesCollEnv,
            [
                Query.equal('user_id', user_id)
            ]
        )
        return response;
    } catch (error) {
        console.error('Error getting passcode:', error);
    }
}

export const createBlock = async (user_id, currUser_id) => {
    try {
        const res = await databases.createDocument(
            dbEnv,
            blocksCollEnv,
            ID.unique(),
            {
                blocker_id: user_id,
                blocked_id: currUser_id
            }
        )
        console.log('User blocked successfully: ', res);
        return res;
    } catch (error) {
        console.error('Error blocking user:', error);
    }
}

export const getBlockedUsersByUser = async (blocker_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [
                Query.equal('blocker_id', blocker_id)
            ]
        )
        console.log('Blocked users:', res);
        return res.documents;
    } catch (error) {
        console.error('Error getting blocked users:', error);
    }
}

export const getBlockedUsersByUserTwo = async (user_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [
                Query.equal('blocker_id', user_id)
            ]
        )
        console.log('Blocked users:', res.documents);
        return res.documents;
    } catch (error) {
        console.error('Error getting blocked users:', error);
    }
}

export const getBlockedUsersByUserByBatch = async (blocker_id, limit, offset) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [
                Query.equal('blocker_id', blocker_id),
                Query.limit(limit),
                Query.offset(offset)
            ]
        )
        console.log('Blocked users:', res);
        return res.documents;
    } catch (error) {
        console.error('Error getting blocked users:', error);
    }
}

export const getUsersBlockingUser = async (blocked_id) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [
                Query.equal('blocked_id', blocked_id)
            ]
        )
        console.log('These accounts blocked you:', res);
        return res.documents;
    } catch (error) {
        console.error('Error getting users:', error);
    }
}

export const isOtherUserBlockedByUser = async (user_id, otherUser_id) => {
    console.log('Starting isOtherUserBlockedByUser...');

    try {
        const res = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [
                Query.and([
                    Query.equal('blocker_id', user_id),
                    Query.equal('blocked_id', otherUser_id)
                ])
            ]
        )

        console.log('RESULT isOtherUserBlockedByUser', res.documents);

        if (res.documents.length > 0) {
            console.log('Other user is blocked!', res.documents);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error getting block status:', error);
    }
}

export const isUserBlockedByOtherUser = async (otherUser_id, user_id) => {
    console.log('Starting isUserBlockedByOtherUser...');

    try {
        const res = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [
                Query.and([
                    Query.equal('blocker_id', otherUser_id),
                    Query.equal('blocked_id', user_id)
                ])
            ]
        )

        console.log('RESULT isUserBlockedByOtherUser', res.documents);

        if (res.documents.length > 0) {
            console.log('isOtherUserBlockedByUser', res.documents);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error getting block status:', error);
    }
}

export const removeBlockUsingBlockedId = async (blocked_id) => {

    try {
        console.log('To be removed:', blocked_id);

        const user = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [Query.equal('blocked_id', blocked_id)]
        );

        console.log('Removing block for - 1:', user);
        console.log('Removing block for - 2:', user.documents[0].$id);

        await deleteDoc(
            blocksCollEnv,
            user.documents[0].$id
        )

        // await databases.deleteDocument(
        //     dbEnv,
        //     blocksCollEnv,
        //     user.documents[0].$id
        // )

        console.log('Block removed succesfully');

    } catch (error) {
        console.error('Error removing block:', error);
    }
}

export const removeBlock = async (block_doc_id) => {

    console.log('block doc id', block_doc_id);

    try {
        const response = await databases.deleteDocument(
            dbEnv,
            blocksCollEnv,
            block_doc_id //block doc id
        )
        return response;
    } catch (error) {
        console.error('Block removal failed', error);
    }
}

export const removeAllBlocksForBlocker = async (blocker_id) => {

    try {
        const blocks = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [Query.equal('blocker_id', blocker_id)]
        )

        const removeBlockerPromises = blocks.documents.map(block =>
            // removeBlock(block.$id)
            deleteDoc(
                blocksCollEnv,
                block.$id
            )
        );

        await Promise.all(removeBlockerPromises);

        console.log(`All blocks made by ${blocker_id} removed successfully.`);
    } catch (error) {
        console.error('Error removing all follows:', error);
    }
}

export const removeAllBlocksForBlocked = async (blocked_id) => {

    try {
        const blocks = await databases.listDocuments(
            dbEnv,
            blocksCollEnv,
            [Query.equal('blocked_id', blocked_id)]
        )

        const removeBlockedPromises = blocks.documents.map(block =>
            // removeBlock(block.$id)
            deleteDoc(
                blocksCollEnv,
                block.$id
            )
        );

        await Promise.all(removeBlockedPromises);

        console.log(`${blocked_id} is no longer blocked by anyone.`);
    } catch (error) {
        console.error('Error removing all follows:', error);
    }
}

export const createUserReport = async (reported_id, reason, reporter_id) => {
    try {
        const response = await databases.createDocument(
            dbEnv,
            reportsUsersCollEnv,
            ID.unique(),
            {
                reported_id,
                reason,
                reporter_id
            },
        );
        console.log('Report created successfully');
        return response;
    } catch (error) {
        console.error('Error adding to reports:', error);
        throw error;
    }
}



export const deleteReport = async (report_id) => {
    try {
        await databases.deleteDocument(
            dbEnv,
            reportsUsersCollEnv,
            report_id
        )
        console.log('Report deleted successfully');

    } catch (error) {
        console.error('Error deleting report:', error);
    }
}

export const removeAllReportsReportingTheUser = async (reported_id) => {

    if (!reported_id) {
        console.log('reported_id is required');
    }

    try {
        const docs = await databases.listDocuments(
            dbEnv,
            reportsUsersCollEnv,
            [Query.equal('reported_id', reported_id)]
        );

        const deletePromises = docs.documents.map(doc =>
            // deleteReport(doc.$id)
            deleteDoc(
                reportsUsersCollEnv,
                doc.$id
            )
        );

        await Promise.all(deletePromises);

        console.log('Reports deleted successfully');
    } catch (error) {
        console.error('Error deleting reports:', error);
        throw error;
    }
}

export const removeAllReportsReportingTheUserNotice = async (author_id) => {

    if (!author_id) {
        console.log('author_id is required');
    }

    try {
        const docs = await databases.listDocuments(
            dbEnv,
            reportsUsersCollEnv,
            [Query.equal('author_id', author_id)]
        );

        const deletePromises = docs.documents.map(doc =>
            // deleteReport(doc.$id)
            deleteDoc(
                reportsUsersCollEnv,
                doc.$id
            )
        );

        await Promise.all(deletePromises);

        console.log('Reports deleted successfully');
    } catch (error) {
        console.error('Error deleting reports:', error);
        throw error;
    }
}

export { ID } from 'appwrite';
