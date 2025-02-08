import { useState, useEffect, useCallback } from 'react';
import { createNotice, getUserNotices, updateNotice, deleteNotice, saveDeletedNoticeId, deleteAllNotices, getFilteredNotices, updateUserInterests, getUserInterests, createSave, getUserSaves, removeSave, createReport, createLike, removeLike, getUserLikes, getAllLikedNotices as fetchAllLikedNotices, getAllLikesByNoticeId as fetchAllLikesByNoticeId, getAllSavedNotices as fetchAllSavedNotices, createReaction, deleteReaction, getAllReactionsBySenderId as fetchAllReactionsBySenderId, getAllReactions as fetchAllReactions, getAllReactionsByRecipientId as fetchAllReactionsByRecipientId, getNoticeByNoticeId as fetchNoticeByNoticeId, getAllReactionsByNoticeId as fetchAllReactionsByNoticeId, getReactionByReactionId as fetchReactionByReactionId, deleteAllReactions, createReactionReport, getNoticeByUserId as fetchNoticeByUserId, removeAllSavesForNotice, removeAllLikesForNotice } from '../../lib/context/dbhandler';
import { UserId } from '../../components/User/UserId.jsx';
import { useUnblockedNotices } from '../utils/blockFilter.js';

const useNotices = (googleUserData) => {
    const [user_id, setUserId] = useState(null);
    // const [userNotices, setUserNotices] = useState([]);
    const [latestNotice, setLatestNotice] = useState({});
    const [generalFeedNotices, setGeneralFeedNotices] = useState([]);
    const [savedNotices, setSaveNotices] = useState([]);
    const [likedNotices, setLikedNotices] = useState({});
    const [noticesReactions, setNoticesReactions] = useState([]);
    const [saveReactions, setSaveReactions] = useState([]);
    const [likedReactions, setLikedReactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNotice, setIsAddingNotice] = useState(false);
    const [isRemovingNotice, setIsRemovingNotice] = useState(false);
    const [removingNoticeId, setRemovingNoticeId] = useState(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const { filterBlocksFromLikesSaves } = useUnblockedNotices();

    // Fetch User Identity
    useEffect(() => {
        const obtainUserById = async () => {
            if (googleUserData) {
                try {
                    const id = await UserId(googleUserData);

                    setUserId(id);

                } catch (error) {
                    console.error('Error obtaining user by id:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        obtainUserById();

    }, [googleUserData]);

    // Fetch User Saves
    // useEffect(() => {
    //     const fetchUserSaves = async () => {
    //         try {
    //             const userSaves = await getUserSaves(user_id);

    //             const saveNoticesMap = {};
    //             userSaves.forEach(save => {
    //                 saveNoticesMap[save.notice_id] = save.$id;
    //             });
    //             setSaveNotices(saveNoticesMap);
    //         } catch (error) {
    //             console.error('Error fetching user saves:', error);
    //         }
    //     };

    //     if (user_id) {
    //         fetchUserSaves();
    //     }
    // }, [user_id]);
    useEffect(() => {
        const fetchUserSaves = async () => {
            try {
                if (!user_id || generalFeedNotices.length === 0) return;

                const noticeIdsInFeed = generalFeedNotices.map(notice => notice.$id);
                const userSaves = await getUserSaves(user_id, noticeIdsInFeed);

                setSaveNotices(prevSaves => {
                    const updatedSaves = { ...prevSaves };
                    userSaves.forEach(save => {
                        updatedSaves[save.notice_id] = save.$id;
                    });
                    return updatedSaves;
                });
            } catch (error) {
                console.error('Error fetching user saves:', error);
            }
        };

        fetchUserSaves();
    }, [user_id, generalFeedNotices]);



    // Fetch User Likes
    // useEffect(() => {
    //     const fetchUserLikes = async () => {
    //         try {
    //             const userLikes = await getUserLikes(user_id);

    //             const likedNoticesMap = {};
    //             userLikes.forEach(like => {
    //                 likedNoticesMap[like.notice_id] = like.$id;
    //             });
    //             setLikedNotices(likedNoticesMap);
    //         } catch (error) {
    //             console.error('Error fetching user likes:', error);
    //         }
    //     };
    //     if (user_id) {
    //         fetchUserLikes();
    //     }
    // }, [user_id]);

    useEffect(() => {
        const fetchUserLikes = async () => {
            try {
                if (!user_id || generalFeedNotices.length === 0) return;

                const noticeIdsInFeed = generalFeedNotices.map(notice => notice.$id);
                const userLikes = await getUserLikes(user_id, noticeIdsInFeed);

                setLikedNotices(prevLikes => {
                    const updatedLikes = { ...prevLikes };
                    userLikes.forEach(like => {
                        updatedLikes[like.notice_id] = like.$id;
                    });
                    return updatedLikes;
                });
            } catch (error) {
                console.error('Error fetching user likes:', error);
            }
        };

        fetchUserLikes();
    }, [user_id, generalFeedNotices]);




    const addNotice = async (text, duration, noticeType, selectedTags, noticeGif) => {

        if (user_id) {

            const now = new Date();
            const expiresAt = new Date(now.getTime() + duration * 3600000);

            const newNotice = {
                user_id: user_id,
                text,
                timestamp: now.toISOString(),
                expiresAt: expiresAt.toISOString(),
                noticeType: noticeType,

                science: selectedTags['science'] || false,
                technology: selectedTags['technology'] || false,
                engineering: selectedTags['engineering'] || false,
                math: selectedTags['math'] || false,
                literature: selectedTags['literature'] || false,
                history: selectedTags['history'] || false,
                philosophy: selectedTags['philosophy'] || false,
                music: selectedTags['music'] || false,
                medicine: selectedTags['medicine'] || false,
                economics: selectedTags['economics'] || false,
                law: selectedTags['law'] || false,
                polSci: selectedTags['polSci'] || false,
                sports: selectedTags['sports'] || false,

                noticeGif
            };

            setIsAddingNotice(true);

            try {
                const createdNotice = await createNotice(newNotice);

                setLatestNotice(createdNotice);
                console.log('THIS WILL BE THE LATEST NOTICE:', createdNotice);

                return createdNotice;

            } catch (error) {
                console.error('Error adding notice:', error);
            } finally {
                setIsAddingNotice(false);
            }

            // try {
            //     const createdNotice = await createNotice(newNotice);
            //     setUserNotices((prevNotices) => [createdNotice, ...prevNotices]);
            //     return createdNotice;

            // } catch (error) {
            //     console.error('Error adding notice:', error);
            // } finally {
            //     setIsAddingNotice(false);
            // }
        }
    };

    useEffect(() => {
        console.log('THIS IS THE LATEST NOTICE:', latestNotice);
    }, [latestNotice])

    const editNotice = async (noticeId, newText) => {
        setIsSavingEdit(true);
        try {
            const updtNtc = await updateNotice(noticeId, newText);

            console.log('updtNtc', updtNtc);

            return updtNtc;
        }
        catch (error) {
            console.error('Error updating the notice:', error);
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleSaveEdit = async (editingNoticeId, noticeText, userProfileNotices, setUserProfileNotices, setEditingNoticeId, setNoticeText, setShowEditModal) => {

        if (editingNoticeId && noticeText.trim()) {

            console.log('EditingNoticeId + noticeText', { editingNoticeId, noticeText });

            const noticeToUpdate = userProfileNotices.find(notice => notice.$id === editingNoticeId);

            console.log('noticeToUpdate', noticeToUpdate);

            let updatedNotice = null;
            if (noticeToUpdate) {
                updatedNotice = {
                    ...noticeToUpdate,
                    text: noticeText
                };

                const updtdntc = await editNotice(editingNoticeId, updatedNotice.text);

                console.log('editingNoticeId', editingNoticeId);

                console.log('updtdntc.text', updtdntc.text);

                setUserProfileNotices(prevNotices =>
                    prevNotices.map((notice) =>
                        notice.$id === editingNoticeId ?
                            { ...notice, text: updtdntc.text } : notice)
                );
                setEditingNoticeId(null);
                setNoticeText('');
                setShowEditModal(false);
            }
        }
    };

    const removeNotice = async (noticeId) => {

        console.log('Attempting to delete notice with ID:', noticeId);

        setIsRemovingNotice(true);
        setRemovingNoticeId(noticeId);

        try {
            if (noticeId) {
                await removeAllSavesForNotice(noticeId);

                await removeAllLikesForNotice(noticeId);

            }
            const removedNotice = await deleteNotice(noticeId);
            return removedNotice;
        } catch (error) {
            if (error.code === 404) {
                console.log('Notice already deleted or does not exist:', noticeId);
            } else {
                console.error('Error deleting notice:', error);
            }
        } finally {
            setRemovingNoticeId(null);
            setIsRemovingNotice(false);
        }

    };

    const handleDelete = async (setUserProfileNotices, setShowDeleteModal) => {
        if (removingNoticeId) {
            console.log('removingNoticeId', removingNoticeId);
            await removeNotice(removingNoticeId);
            setUserProfileNotices(prevNotices => prevNotices.filter(notice => notice.$id !== removingNoticeId));
            setRemovingNoticeId(null);
            setShowDeleteModal(false);
        }
    }

    const removeAllNoticesByUser = async (user_id) => {
        try {
            const response = await deleteAllNotices(user_id);
            return response;
        } catch (error) {
            console.error('Error deleting all notices:', error);
        }
    }

    const deleteExpiredNotice = async (notices) => {
        try {
            const unExpiredNotices = notices.filter((notice) => {
                if (notice.expiresAt) {
                    const expirationTime = new Date(notice.expiresAt);
                    const now = new Date();

                    console.log('Expiration Check:', {
                        expirationTime: expirationTime,
                        now: now,
                        isExpired: now > expirationTime
                    });

                    if (now > expirationTime) {
                        console.log('Expired notice text:', notice.text);

                        console.log('Now saving the deleting notice id:', notice.$id);
                        saveDeletedNoticeId(notice.$id);

                        console.log('Now deleting the notice id:', notice.$id);
                        setTimeout(() => (
                            removeNotice(notice.$id)
                        ), 3000)

                        return false;
                    }
                }
                return true;
            });

            return unExpiredNotices;

        } catch (error) {
            'Error deleting expired notices:', error;
        }
    }

    const getFeedNotices = async (selectedTags, limit, lastId) => {
        try {
            const notices = await getFilteredNotices(selectedTags, limit, lastId, user_id);
            console.log('notices - getFeedNotices', notices);
            setGeneralFeedNotices(notices);
            return notices;
        } catch (error) {
            console.error('Error fetching filtered notices:', error);
        }
    };

    const getNoticesByUser = useCallback(async (user_id, limit, lastId) => {
        try {
            const response = await getUserNotices(user_id, limit, lastId);

            return response;
        } catch (error) {
            console.error('Error getNoticesByUser - useNotices');
        }
    }, [googleUserData]);

    const fetchUserNotices = async (id, limit, lastId) => {
        if (!id) return;

        try {
            const usrNotices = await getNoticesByUser(id, limit, lastId);

            // setNotices(prevNotices => {
            //     const newNotices = usrNotices.filter(notice =>
            //         !prevNotices.some(existingNotice => existingNotice.$id === notice.$id)
            //     );

            //     console.log('FETCHED NTCS:', newNotices);

            //     return [...prevNotices, ...newNotices];
            // });

            // const now = new Date().getTime();

            // setNotices(prevNotices =>
            //     prevNotices.filter(notice => {
            //         if (notice.expiresAt) {
            //             const expiresAtDate = new Date(notice.expiresAt);
            //             expiresAtDate.setHours(expiresAtDate.getHours() + 8); // Adjusting the 8-hour difference

            //             if (expiresAtDate <= now) {
            //                 deleteNotice(notice.$id);
            //                 return false;
            //             }
            //         }
            //         return true;
            //     })
            // );

            console.log('usrNotices - useNotices:', usrNotices);

            return usrNotices;

        } catch (error) {
            console.error('Error fetchUserNotices - useNotices');
        }
    }

    const getNoticeByNoticeId = async (notice_id) => {
        try {
            const res = fetchNoticeByNoticeId(notice_id);

            console.log('Success fetching notices by notice_id', res);
            return res;

        } catch (error) {
            console.error('Error fetching notices by notice_id', error);
        }
    }

    const updateInterests = async (user_id, selectedTags) => {
        try {
            const interests = await updateUserInterests(user_id, selectedTags);
            return interests;
        } catch (error) {
            console.error('Error updating user interests:', error);

        }
    }

    const getInterests = async (user_id) => {
        try {
            const interests = await getUserInterests(user_id);
            return interests;
        } catch (error) {
            console.error('Error gettin user interests:', error);
        }
    }

    const handleSave = async (notice_id, author_id) => {
        try {
            if (savedNotices[notice_id]) {
                await removeSave(savedNotices[notice_id]);
                setSaveNotices((prevSaves) => {
                    const updatedSaves = { ...prevSaves };
                    delete updatedSaves[notice_id];
                    return updatedSaves;
                });
            } else {
                const newSave = await createSave(notice_id, author_id, user_id);
                setSaveNotices((prevSave) => ({
                    ...prevSave,
                    [notice_id]: newSave.$id,
                }));
            }
        } catch (error) {
            console.error('Error toggling saves:', error);
        }
    }

    const handleLike = async (notice_id, author_id) => {
        try {
            if (likedNotices[notice_id]) {
                await removeLike(likedNotices[notice_id]);
                setLikedNotices((prevLikes) => {
                    const updatedLikes = { ...prevLikes };
                    delete updatedLikes[notice_id];
                    return updatedLikes;
                });
            } else {
                const newLike = await createLike(notice_id, author_id, user_id);
                setLikedNotices((prevLikes) => ({
                    ...prevLikes,
                    [notice_id]: newLike.$id,
                }));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const getAllLikedNotices = async (userId, limit, offset) => {
        try {

            const userLikes = await getUserLikes(userId);

            console.log('userLikes', userLikes);

            // const noticesWithoutTwoWayBlock = await filterBlocksFromLikesSaves(userLikes, user_id);

            const likedNoticeIds = userLikes.map(like => like.notice_id);

            return await fetchAllLikedNotices(likedNoticeIds, limit, offset);

        } catch (error) {
            console.error('Error fetching all liked notices:', error);
            return [];
        }
    };

    const getNoticeByUserId = async (id, limit, offset) => {
        try {
            console.log('LIMIT - useNotice', limit);

            const res = await fetchNoticeByUserId(id, limit, offset);

            console.log('NOTICES:', res);

            // setUserNotices(res);
            // setUserNotices((preVal) => [...preVal, ...res]);

            return res;
        } catch (error) {
            console.error('Error fetching notice by user id:', error);
        }
    }

    const getAllLikesByNoticeId = async (noticeId) => {
        try {
            const res = await fetchAllLikesByNoticeId(noticeId);
            console.log('All likes for a notice by its id:', res);
            return res.documents;
        } catch (error) {
            console.error('Error fetching all likes by notice id.', error);
        }
    }

    const getAllSavedNotices = async (userId, limit, offset) => {
        try {

            const userSaves = await getUserSaves(userId);

            console.log('userSaves', userSaves);

            // const noticesWithoutTwoWayBlock = await filterBlocksFromLikesSaves(userSaves, user_id);

            const saveNoticeIds = userSaves.map(save => save.notice_id);

            return await fetchAllSavedNotices(saveNoticeIds, limit, offset);

        } catch (error) {
            console.error('Error fetching all save notices:', error);
            return [];
        }
    };

    const handleReportNotice = async (notice_id, author_id, reason, noticeText) => {
        try {
            await createReport(notice_id, author_id, reason, user_id, noticeText);
            console.log('Notice reported successfully!');
        } catch (error) {
            console.error('Error reporting notice:', error);
            throw error;
        }
    };

    const handleReact = async (otherUser_id, content, notice_id, expiresAt, reactionGif) => {

        const now = new Date();

        try {
            const response = createReaction(user_id, otherUser_id, content, now, notice_id, expiresAt, reactionGif);
            // console.log('Success sending reaction:', response);
            return response;
        } catch (error) {
            console.error('Failed to send reaction:', error);
        }
    }

    const removeReaction = async (reactionId) => {
        try {
            await deleteReaction(reactionId);
            console.log('Reaction removed successfully.');
        } catch (error) {
            console.error('Error removing reaction:', error);
        }
    }

    const removeAllReactionsByUser = async (user_id) => {
        try {
            const response = await deleteAllReactions(user_id);
            return response;
        } catch (error) {
            console.error('Error deleting all reactions:', error);
        }
    }

    const getAllReactions = async () => {
        try {
            const response = await fetchAllReactions();

            console.log('fetchAllReactions', response);

            return response;
        } catch (error) {
            console.error('Error - fetchAllReactions', error);
        }
    }

    const getAllReactionsBySenderId = async (user_id) => {
        try {
            const response = await fetchAllReactionsBySenderId(user_id);
            console.log('getAllReactionsBySenderId', response);
            return response;
        } catch (error) {
            console.error('ERRO - getAllReactionsBySenderId', error);
        }
    }

    const getAllReactionsByRecipientId = async (recipient_id) => {
        try {
            const response = await fetchAllReactionsByRecipientId(recipient_id);
            // console.log('getAllReactionsByRecipientId', response);

            // setReactions(response.documents);

            return response;
        } catch (error) {
            console.error('ERROR - getAllReactionsByRecipientId', error);
        }
    }

    // Get reactions from DB
    const getReactionsForNotice = async (notice_id, limit, cursor = null) => {
        try {
            const response = await fetchAllReactionsByNoticeId(notice_id, limit, cursor);
            console.log('getAllReactionsByNoticeId', response);
            return response;
        } catch (error) {
            console.error('ERROR - getAllReactionsByNoticeId', error);
        }
    }

    const getReactionByReactionId = async (reactionId) => {
        try {
            const reaction = await fetchReactionByReactionId(reactionId);
            console.log('Succes fetching reaction:', reaction);
            return reaction;
        } catch (error) {
            console.error('Error fetching reaction', error);
        }
    }

    const reportReaction = async (reaction_id, author_id, reason, reaction_text) => {
        try {
            await createReactionReport(reaction_id, author_id, reason, user_id, reaction_text);
            console.log('Reporting reacion successful!');
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    }

    return {
        user_id,
        // userNotices,
        latestNotice,
        savedNotices,
        likedNotices,
        isLoading,
        isAddingNotice,
        isSavingEdit,
        isRemovingNotice,
        removingNoticeId,
        noticesReactions,
        saveReactions,
        likedReactions,
        addNotice,
        editNotice,
        handleSaveEdit,
        removeNotice,
        handleDelete,
        deleteExpiredNotice,
        getFeedNotices,
        fetchUserNotices,
        getNoticesByUser,
        getNoticeByNoticeId,
        getInterests,
        setRemovingNoticeId,
        updateInterests,
        handleSave,
        getAllLikedNotices,
        getNoticeByUserId,
        getAllLikesByNoticeId,
        getAllSavedNotices,
        handleReportNotice,
        handleLike,
        setLikedNotices,
        removeAllNoticesByUser,
        removeAllReactionsByUser,
        handleReact,
        removeReaction,
        getReactionsForNotice,
        getReactionByReactionId,
        reportReaction,
        // fetchReactionsForNotices,
        setNoticesReactions,
        setSaveReactions,
        setLikedReactions
    };
};

export default useNotices;