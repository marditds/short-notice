import { Client, Storage, Account, Databases, ID, Query, Permission, Role, Functions } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT);

console.log('client - dbhandler.js', client);

export const account = new Account(client);

console.log('account - dbhandler.js', account);

const functions = new Functions(client);

console.log('functions - dbhandler.js', functions);

export default client;

const storage = new Storage(client);
export const databases = new Databases(client);

console.log('databases - dbhandler.js', databases);


// const users = await databases.listDocuments(
//     import.meta.env.VITE_DATABASE,
//     import.meta.env.VITE_USERS_COLLECTION
// );

// const notices = await databases.listDocuments(
//     import.meta.env.VITE_DATABASE,
//     import.meta.env.VITE_NOTICES_COLLECTION
// );


export const uploadAvatar = async (file) => {

    console.log('dbhandler - uploadAvatar', file);

    try {
        const response = await storage.createFile(
            import.meta.env.VITE_AVATAR_BUCKET,
            ID.unique(),
            file,
            // [
            //     Permission.write(Role.users()),
            //     Permission.write(Role.guests())

            // ]
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
        const response = await storage.deleteFile(
            import.meta.env.VITE_AVATAR_BUCKET,
            fileId,
            // [
            //     Permission.delete(Role.users()),
            //     Permission.delete(Role.guests())
            // ]
        );
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
            {
                avatar: profilePictureId
            },
            // [
            //     Permission.update(Role.users()),
            //     Permission.update(Role.guests())
            // ]
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
            {
                avatar: ''
            },
            // [
            //     Permission.delete(Role.users()),
            //     Permission.delete(Role.guests())
            // ]
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
        // console.error('Error fetching user by ID:', error);
        throw error;
    }
};

export const getUserByIdQuery = async (userId) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            [Query.equal('$id', userId)]
        );
        return response;
    } catch (error) {
        // console.error('Error fetching user by ID:', error);
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
    console.log('otherUsername', username);

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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
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

export const createUser = async ({ id, email, given_name, username, accountType }) => {
    try {

        const existingUser = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            [Query.equal('email', email)],
            // [
            //     Permission.write(Role.users()),
            //     Permission.write(Role.guests())
            // ]
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
        // const result = await account.listIdentities(
        //     [Query.equal('email', email)] // queries (optional)
        // );

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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId,
            {
                username: username
            },
            // [
            // Permission.update(Role.users(userId)),
            // Permission.update(Role.guests())
            // ]
        );
        console.log('Username successfully updated.');
        return res;
    } catch (error) {
        console.error('Error updating the username:', error);

    }
};

export const updateUserWebsite = async ({ userId, website }) => {

    console.log('updateUserWebsite - userId', userId);
    console.log('updateUserWebsite - website', website);

    try {
        const res = await databases.updateDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId,
            {
                website: website
            },
            // [
            // Permission.update(Role.users(userId)),
            // Permission.update(Role.guests())
            // ]
        );
        console.log('Website successfully updated.');
        return res;
    } catch (error) {
        console.error('Error updating the website:', error);
    }
};

export const updateAuthUser = async (name) => {
    try {
        const authUsrnm = await account.updateName(name);

        console.log('Auth username updated successfully', authUsrnm);
    } catch (error) {
        console.error('Error updating auth username:', error);
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

        const response = await functions.createExecution(
            import.meta.env.VITE_USER_AUTH_FUNCTION_ID,  // your function ID
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_USERS_COLLECTION,
            userId,
            // [
            //     Permission.delete(Role.users()),
            //     Permission.delete(Role.guests())
            // ]
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

        const res = await functions.createExecution(
            import.meta.env.VITE_USER_DELETE_FUNCTION_ID,
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
            console.error("Failed to delete atuh user");
        }
    } catch (error) {
        console.error('Error deleting auth user:', error);
    }
}

export const createUserSession = async (email) => {
    try {
        const userSession = await account.createEmailPasswordSession(email, 'TmbkaberdiArum55');
        console.log('Session created successfully:', userSession);
        return userSession;
    } catch (error) {
        console.error('Error creating session:', error);
    }
}

export const deleteUserSession = async () => {

    const currentSession = await account.getSession('current');
    console.log('currentSession', currentSession);
    try {

        if (currentSession) {
            await account.deleteSession(currentSession.$id);
            console.log('Session delete successfully');
        }
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

// export const getSessionDetails = async (email) => {
//     try {
//         console.log('this email will be sent - dbhandler:', email);
//         console.log('type of email', typeof (email));

//         const payload = JSON.stringify({ email: email });
//         console.log('Payload being sent:');
//         console.log(payload);

//         const exec = await functions.createExecution(
//             import.meta.env.VITE_USER_SESSION_FUNCTION_ID,  // your function ID
//             payload
//         )

//         console.log('Function response:', exec);
//         console.log('Response status:', exec.status);
//         console.log('Response status code:', exec.responseStatusCode);
//         console.log('Response Body:', exec.responseBody);

//         if (exec.status === 'completed') {
//             try {
//                 const result = JSON.parse(exec.responseBody);
//                 console.log(result);
//                 return result;
//                 // return result;
//             } catch (parseError) {
//                 console.error('Error parsing response:', parseError);
//                 return false;
//             }
//         } else {
//             console.error('Function execution failed:', execution.stderr);
//             return false;
//         }


//         // const sessDets = await account?.getSession('current');
//         // console.log('sessDets:', sessDets);
//         // return sessDets;
//     } catch (error) {
//         console.error('Error getting session details:', error);

//     }
// }

// const createGoogleSession = async () => {
//     try {
//         let createSession = await account.createOAuth2Session(
//             'google'
//         )
//         console.log('createSession - App.jsx:', createSession);
//     } catch (error) {
//         console.error('Error creating session:', error);
//     }
// }

export const createNotice = async ({ user_id, text, timestamp, expiresAt, noticeType, noticeGif, noticeUrl, science, technology, engineering, math, literature, history, philosophy, music, medicine, economics, law, polSci, sports
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
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

export const getNoticeByNoticeId = async (notice_id) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
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
//             import.meta.env.VITE_DATABASE,
//             import.meta.env.VITE_NOTICES_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            queries
        );

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
        const response = await databases.deleteDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            noticeId,
            [
                Permission.delete(Role.users())
            ]
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

export const saveDeletedNoticeId = async (notice_id) => {
    console.log('Attempting to save notice ID of deleted Notice:', notice_id);
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
            [Query.equal('user_id', userId)]
        );

        for (const notice of notices.documents) {
            await removeAllLikesForNotice(notice.$id);
            await removeAllSavesForNotice(notice.$id);
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
                interestsData,
                // [
                //     Permission.update(Role.users()),
                //     Permission.update(Role.guests())
                // ]
            );
        } catch (updateError) {
            if (updateError.code === 404) {
                response = await databases.createDocument(
                    import.meta.env.VITE_DATABASE,
                    import.meta.env.VITE_INTERESTS_COLLECTION,
                    userId,
                    interestsData,
                    // [
                    //     Permission.write(Role.users()), Permission.write(Role.guests())
                    // ]
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

export const createSave = async (notice_id, author_id, user_id) => {
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SAVES_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SAVES_COLLECTION,
            save_id,
            [
                Permission.delete(Role.users())
            ]
        );
        console.log('Save removed successfully:', response);
        return response;
    } catch (error) {
        console.error('Error removing save:', error);
        throw error;
    }
}

export const removeAllSaves = async (user_id) => {
    try {
        const saves = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SAVES_COLLECTION,
            [
                Query.equal('user_id', user_id)
            ]
        )

        for (const save of saves.documents) {
            await removeSave(save.$id);
        }

        console.log(`All saves for user ${user_id} removed successfully.`);
    } catch (error) {
        console.error('Error removing all saves:', error);
    }
}

export const removeAllSavesForNotice = async (notice_id) => {
    try {
        const saves = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SAVES_COLLECTION,
            [
                Query.equal('notice_id', notice_id)
            ]
        )
        for (const save of saves.documents) {
            await removeSave(save.$id);
        }
        console.log(`Removed all saves for notice id:`, notice_id);
    } catch (error) {
        console.error('Error removing saves from the db:', error);
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
            like_id,
            // [
            //     Permission.delete(Role.users()),
            //     Permission.delete(Role.guests())
            // ]
        );
        console.log('Like removed successfully:', response);
        return response;
    } catch (error) {
        console.error('Error removing like:', error);
        throw error;
    }
}

export const removeAllLikes = async (user_id) => {
    try {
        const likes = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
            [
                Query.equal('user_id', user_id)
            ]
        )

        for (const like of likes.documents) {
            await removeLike(like.$id);
        }

        console.log(`All likes for user ${user_id} removed successfully.`);
    } catch (error) {
        console.error('Error removing all likes:', error);
    }
}

export const removeAllLikesForNotice = async (notice_id) => {
    try {
        const likes = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
            [
                Query.equal('notice_id', notice_id)
            ]
        )
        for (const like of likes.documents) {
            await removeLike(like.$id);
        }
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_LIKES_COLLECTION,
            [
                Query.equal('notice_id', notice_id)
            ]
        )
        return res;
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SAVES_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_SAVES_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_NOTICES_COLLECTION,
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

export const createReport = async (notice_id, author_id, reason, user_id, noticeText) => {
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REPORTS_COLLECTION,
            ID.unique(),
            {
                notice_id: notice_id,
                author_id: author_id,
                reason: reason,
                user_id: user_id,
                noticeText: noticeText
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

export const createFollow = async (user_id, otherUser_id) => {
    try {
        // Check if follow relationship already exists
        const followRecords = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.equal('user_id', user_id)
            ],
            [
                Permission.write(Role.users()),
                Permission.write(Role.guests())
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

export const removeAllFollows = async (user_id) => {
    try {
        const follows = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.equal('user_id', user_id)
            ]
        )

        for (const follow of follows.documents) {
            await removeFollow(follow.$id);
        }

        console.log(`All follows made by ${user_id} removed successfully.`);
    } catch (error) {
        console.error('Error removing all follows:', error);
    }
}

export const unfollow = async (user_id, otherUser_id) => {
    try {
        const res = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.or([
                    Query.and([Query.equal('user_id', user_id), Query.equal('otherUser_id', otherUser_id)]),
                    Query.and([Query.equal('user_id', otherUser_id), Query.equal('otherUser_id', user_id)])
                ])
            ]
        )

        console.log('Follow instance FOUND:', res);

        for (const r of res.documents) {
            await removeFollow(r.$id);
        }
    } catch (error) {
        console.error('Error unfollowing:', error);
    }
}

export const followedByUserCount = async (user_id) => {
    try {
        const res = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
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

    try {
        const res = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
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

export const getPersonalFeedAccounts = async (user_id) => {
    try {
        const res = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_FOLLOWING_COLLECTION,
            [
                Query.equal('user_id', user_id)
            ]
        )

        console.log("LET'S SEEEE:", res);

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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REACTIONS_COLLECTION,
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
            // [
            //     Permission.write(Role.users()),
            //     Permission.write(Role.guests())
            // ]
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REACTIONS_COLLECTION,
            reactionId,
            [
                Permission.delete(Role.users()),
                Permission.delete(Role.guests())
            ]
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

export const deleteAllReactions = async (sender_id) => {
    try {
        const reactions = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REACTIONS_COLLECTION,
            [Query.equal('sender_id', sender_id)],
            [
                Permission.delete(Role.users()),
                Permission.delete(Role.guests())
            ]
        );

        for (const reaction of reactions.documents) {
            await deleteReaction(reaction.$id);
        }

        console.log(`All reactions from user ${sender_id} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user reactions:', error);
        throw error;
    }
}

export const getAllReactions = async () => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REACTIONS_COLLECTION
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REACTIONS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REACTIONS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REACTIONS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REACTIONS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REPORTS_REACTIONS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_PASSCODES_COLLECTION,
            ID.unique(),
            {
                user_id,
                passcode,
                accountType
            }
        )
        console.log('Passcode created successfuly:', response);
        return response;
    } catch (error) {
        console.error('Error creating passcode:', error);
    }
}

export const updatePassocde = async (user_id, passcode) => {
    try {
        console.log('usr id', user_id);
        console.log('passcode', passcode);

        const listResponse = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_PASSCODES_COLLECTION,
            [Query.equal('user_id', user_id)]
        );

        const documentId = listResponse.documents[0].$id;

        const updateResponse = await databases.updateDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_PASSCODES_COLLECTION,
            documentId,
            { passcode: passcode }
        );

        console.log('Passcode updated successfully:', updateResponse);

        return updateResponse;

    } catch (error) {
        console.error('Error updating passcode:', error);
    }
}

export const getPassocdeByOrganizationId = async (user_id) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_PASSCODES_COLLECTION,
            [
                Query.equal('user_id', user_id)
            ]
        )
        console.log('Passcode gotten successfuly:', response);
        return response;
    } catch (error) {
        console.error('Error getting passcode:', error);
    }
}

export const createBlock = async (user_id, currUser_id) => {
    try {
        const res = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
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
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
            [
                Query.equal('blocked_id', blocked_id)
            ]
        );

        console.log('Removing block for - 1:', user);
        console.log('Removing block for - 2:', user.documents[0].$id);

        await databases.deleteDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_BLOCKS_COLLECTION,
            user.documents[0].$id
        )

        console.log('Block removed succesfully');

    } catch (error) {
        console.error('Error removing block:', error);
    }
}

export const createUserReport = async (reported_id, reason, reporter_id) => {
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_REPORTS_USERS_COLLECTION,
            ID.unique(),
            {
                reported_id,
                reason,
                reporter_id
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

export { ID } from 'appwrite';
