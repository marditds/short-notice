import { useState, useEffect, useCallback } from 'react';
import { createNotice, getUserNotices, updateNotice, deleteNotice, deleteAllNotices, getFilteredNotices, updateUserInterests, getUserInterests, createSave, getUserSaves, removeSave, createReport, createLike, removeLike, getUserLikes, getAllLikedNotices as fetchAllLikedNotices, getAllLikesByNoticeId as fetchAllLikesByNoticeId, getAllSavedNotices as fetchAllSavedNotices, createReaction, deleteReaction, getAllReactionsBySenderId as fetchAllReactionsBySenderId, getAllReactions as fetchAllReactions, getAllReactionsByRecipientId as fetchAllReactionsByRecipientId, getNoticeByNoticeId as fetchNoticeByNoticeId, getAllReactionsByNoticeId as fetchAllReactionsByNoticeId, getReactionByReactionId as fetchReactionByReactionId, deleteAllReactions, createReactionReport, getNoticeByUserId as fetchNoticeByUserId } from '../../lib/context/dbhandler';
import { UserId } from '../../components/User/UserId.jsx';
import { useUnblockedNotices } from '../utils/blockFilter.js';

const useNotices = (googleUserData) => {
    const [user_id, setUserId] = useState(null);
    const [userNotices, setUserNotices] = useState([]);
    const [latestNotice, setLatestNotice] = useState({});
    const [savedNotices, setSaveNotices] = useState([]);
    const [likedNotices, setLikedNotices] = useState({});
    const [noticesReactions, setNoticesReactions] = useState([]);
    const [saveReactions, setSaveReactions] = useState([]);
    const [likedReactions, setLikedReactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNotice, setIsAddingNotice] = useState(false);
    const [isRemovingNotice, setIsRemovingNotice] = useState(false);
    const [removingNoticeId, setRemovingNoticeId] = useState(null);

    const { filterBlocksFromLikesSaves } = useUnblockedNotices();

    // Fetch User Notces
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

        const checkExpiredNotices = setInterval(() => {
            const now = new Date();
            setUserNotices((prevNotices) =>
                prevNotices.filter((notice) => {
                    if (notice.expiresAt && new Date(notice.expiresAt) <= now) {
                        deleteNotice(notice.$id);
                        return false;
                    }
                    return true;
                })
            );
        }, 10000);

        return () => clearInterval(checkExpiredNotices);

    }, [googleUserData]);

    // Fetch User Saves
    useEffect(() => {
        const fetchUserSaves = async () => {
            try {
                const userSaves = await getUserSaves(user_id);

                const saveNoticesMap = {};
                userSaves.forEach(save => {
                    saveNoticesMap[save.notice_id] = save.$id;
                });
                setSaveNotices(saveNoticesMap);
            } catch (error) {
                console.error('Error fetching user saves:', error);
            }
        };

        if (user_id) {
            fetchUserSaves();
        }
    }, [user_id]);

    // Fetch User Likes
    useEffect(() => {
        const fetchUserLikes = async () => {
            try {
                const userLikes = await getUserLikes(user_id);

                const likedNoticesMap = {};
                userLikes.forEach(like => {
                    likedNoticesMap[like.notice_id] = like.$id;
                });
                setLikedNotices(likedNoticesMap);
            } catch (error) {
                console.error('Error fetching user likes:', error);
            }
        };

        if (user_id) {
            fetchUserLikes();
        }
    }, [user_id]);


    const addNotice = async (text, duration, noticeType, selectedTags) => {

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

        const updtNtc = await updateNotice(noticeId, newText);
        setUserNotices((prevNotices) =>
            prevNotices.map((notice) =>
                notice.$id === noticeId ? { ...notice, text: newText } : notice
            )
        );
        console.log('updtNtc', updtNtc);

        return updtNtc;
    };

    const removeNotice = async (noticeId) => {

        console.log('Attempting to delete notice with ID:', noticeId);

        setIsRemovingNotice(true);
        setRemovingNoticeId(noticeId);

        try {
            const removedNotice = await deleteNotice(noticeId);
            // setUserNotices((prevNotices) => prevNotices.filter((notice) => notice.$id !== noticeId));
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

    const removeAllNoticesByUser = async (user_id) => {
        try {
            const response = await deleteAllNotices(user_id);
            return response;
        } catch (error) {
            console.error('Error deleting all notices:', error);
        }
    }

    const getFeedNotices = async (selectedTags, limit, lastId) => {
        try {
            const notices = await getFilteredNotices(selectedTags, limit, lastId);
            console.log('notices - getFeedNotices', notices);
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

    const saveNotice = async (notice_id, author_id) => {
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

    const likeNotice = async (notice_id, author_id) => {
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

            const noticesWithoutTwoWayBlock = await filterBlocksFromLikesSaves(userLikes, user_id);

            const likedNoticeIds = noticesWithoutTwoWayBlock.map(like => like.notice_id);

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


            const noticesWithoutTwoWayBlock = await filterBlocksFromLikesSaves(userSaves, user_id);

            const saveNoticeIds = noticesWithoutTwoWayBlock.map(like => like.notice_id);

            return await fetchAllSavedNotices(saveNoticeIds, limit, offset);

        } catch (error) {
            // console.error('Error fetching all save notices:', error);
            return [];
        }
    };

    const reportNotice = async (notice_id, author_id, reason, noticeText) => {
        try {
            await createReport(notice_id, author_id, reason, user_id, noticeText);
            console.log('Notice reported successfully!');
        } catch (error) {
            console.error('Error reporting notice:', error);
            throw error;
        }
    };

    const sendReaction = async (otherUser_id, content, notice_id, expiresAt) => {

        const now = new Date();

        try {
            const response = createReaction(user_id, otherUser_id, content, now, notice_id, expiresAt);
            console.log('Success sending reaction');
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
        isRemovingNotice,
        removingNoticeId,
        noticesReactions,
        saveReactions,
        likedReactions,
        addNotice,
        editNotice,
        removeNotice,
        getFeedNotices,
        fetchUserNotices,
        getNoticesByUser,
        getNoticeByNoticeId,
        getInterests,
        setRemovingNoticeId,
        updateInterests,
        saveNotice,
        getAllLikedNotices,
        getNoticeByUserId,
        getAllLikesByNoticeId,
        getAllSavedNotices,
        reportNotice,
        likeNotice,
        setLikedNotices,
        removeAllNoticesByUser,
        removeAllReactionsByUser,
        sendReaction,
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
