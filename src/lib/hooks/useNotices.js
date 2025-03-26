import { useState, useEffect, useCallback } from 'react';
import { createNotice, getUserNotices, updateNotice, deleteNotice, saveDeletedNoticeId, deleteAllNotices, getFilteredNotices, updateUserInterests, getUserInterests, createSave, getUserSaves, removeSave, createReport, createLike, removeLike, getUserLikes, getAllLikedNotices as fetchAllLikedNotices, getAllLikesByNoticeId as fetchAllLikesByNoticeId, getUserLikesNotInFeed, getUserSavesNotInFeed, getAllSavedNotices as fetchAllSavedNotices, createReaction, deleteReaction, getAllReactionsBySenderId as fetchAllReactionsBySenderId, getAllReactions as fetchAllReactions, getAllReactionsByRecipientId as fetchAllReactionsByRecipientId, getNoticeByNoticeId as fetchNoticeByNoticeId, getAllReactionsByNoticeId as fetchAllReactionsByNoticeId, getReactionByReactionId as fetchReactionByReactionId, deleteAllReactions, createReactionReport, getNoticeByUserId as fetchNoticeByUserId, removeAllSavesForNotice, removeAllLikesForNotice } from '../../lib/context/dbhandler';
import { useUserContext } from '../context/UserContext.jsx';
import useUserInfo from './useUserInfo.js';
import useGemini from './useGemini';
import { UserId } from '../../components/User/UserId.jsx';
// import { useUnblockedNotices } from '../utils/blockFilter.js';

const useNotices = (data) => {

    const { userId: user_id } = useUserContext();

    const { getPersonalFeedAccounts } = useUserInfo();

    const { runGemini } = useGemini();

    // User(s) info
    // const [user_id, setUserId] = useState(null);
    const [fellowUserId, setFellowUserId] = useState(null)

    // Notices + likes/saves
    const [latestNotice, setLatestNotice] = useState({});
    const [generalFeedNotices, setGeneralFeedNotices] = useState([]);
    const [personalFeedNotices, setPersonalFeedNotices] = useState([]);

    const [personalFeedLikedNotices, setPersonalFeedLikedNotices] = useState({});
    const [personalFeedSavedNotices, setPersonalFeedSavedNotices] = useState({});

    const [savedNotices, setSavedNotices] = useState([]);
    const [likedNotices, setLikedNotices] = useState({});

    const [noticesReactions, setNoticesReactions] = useState([]);
    const [saveReactions, setSaveReactions] = useState([]);
    const [likedReactions, setLikedReactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNotice, setIsAddingNotice] = useState(false);
    const [isRemovingNotice, setIsRemovingNotice] = useState(false);
    const [removingNoticeId, setRemovingNoticeId] = useState(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Gemini
    const [geminiRes, setGeminiRes] = useState('');
    const [isGeminiLoading, setIsGeminiLoading] = useState(false);
    const templateItems = {
        personal: [
            'Morning Thoughts',
            'A Song That Matches My Mood',
            'Life Hack I Just Discovered!',
            'One Thing I\'m Grateful for Today',
            'A Random Fact You Didn\'t Know About Me'
        ],
        business: [
            'Flash Sale Alert',
            'A Brief Explanation of What\'s Coming',
            'Customer Shoutout',
            'Limited-Time Offer',
            'Question for Customers',
            'Quick Tip for Using Our Product',
            'Big Product Announcement'
        ],
        organization: [
            'Important Team Update',
            'Reminder: Upcoming Meeting Details',
            'Quick Motivation for the Team',
            'Shoutout to Team Member',
            'Policy Change Notice',
            'Fast Feedback from Team',
            'Celebrating a Team Win'
        ]
    };

    //    Interests
    const [fetchedInterests, setFetchedInterests] = useState({});
    const [selectedTags, setSelectedTags] = useState({});
    const [isAnyTagSelected, setIsAnyTagSelected] = useState(false);
    const [isInterestsLoading, setIsInterestsLoading] = useState(false);

    const [isInterestsUpdating, setIsInterestsUpdating] = useState(false);
    const [tagCategories, setTagCategories] = useState([
        {
            group: 'STEM',
            tags: [
                { name: 'Science', key: 'science' },
                { name: 'Technology', key: 'technology' },
                { name: 'Engineering', key: 'engineering' },
                { name: 'Math', key: 'math' }
            ],
            values: [false, false, false, false]
        },
        {
            group: 'Humanities and Arts',
            tags: [
                { name: 'Literature', key: 'literature' },
                { name: 'History', key: 'history' },
                { name: 'Philosophy', key: 'philosophy' },
                { name: 'Music', key: 'music' }
            ],
            values: [false, false, false, false]
        },
        {
            group: 'Social Sciences and Professions',
            tags: [
                { name: 'Medicine', key: 'medicine' },
                { name: 'Economics', key: 'economics' },
                { name: 'Law', key: 'law' },
                { name: 'Political Science', key: 'polSci' },
                { name: 'Sports', key: 'sports' }
            ],
            values: [false, false, false, false, false]
        }
    ]);

    // Fetch User Identity
    // useEffect(() => {
    //     const obtainUserById = async () => {
    //         if (data) {
    //             try {
    //                 const id = await UserId(data);

    //                 setUserId(id);

    //             } catch (error) {
    //                 console.error('Error obtaining user by id:', error);
    //             } finally {
    //                 setIsLoading(false);
    //             }
    //         } else {
    //             setIsLoading(false);
    //         }
    //     };

    //     obtainUserById();

    // }, [data]);

    // Fetch User Saves for general feed
    useEffect(() => {
        const fetchUserSaves = async () => {
            try {
                if (!user_id || generalFeedNotices.length === 0) return;

                const noticeIdsInFeed = generalFeedNotices.map(notice => notice.$id);
                const userSaves = await getUserSaves(user_id, noticeIdsInFeed);

                setSavedNotices(prevSaves => {
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

    // Fetch user saves for personal feed
    useEffect(() => {
        const fetchPersonalFeedSaves = async () => {
            try {
                if (!user_id || personalFeedNotices.length === 0) return;

                const noticeIdsInFeed = personalFeedNotices.map(notice => notice.$id);
                const userSaves = await getUserSaves(user_id, noticeIdsInFeed);

                setPersonalFeedSavedNotices(prevSaves => {
                    const updatedSaves = { ...prevSaves };
                    userSaves.forEach(save => {
                        updatedSaves[save.notice_id] = save.$id;
                    });
                    return updatedSaves;
                });
            } catch (error) {
                console.error('Error fetching personal feed saves:', error);
            }
        };

        fetchPersonalFeedSaves();
    }, [user_id, personalFeedNotices]);

    // Fetch user likes for general feed 
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

    // Fetch user likes for personal feed
    useEffect(() => {
        const fetchPersonalFeedLikes = async () => {
            try {
                if (!user_id || personalFeedNotices.length === 0) return;

                const noticeIdsInFeed = personalFeedNotices.map(notice => notice.$id);
                const userLikes = await getUserLikes(user_id, noticeIdsInFeed);

                setPersonalFeedLikedNotices(prevLikes => {
                    const updatedLikes = { ...prevLikes };
                    userLikes.forEach(like => {
                        updatedLikes[like.notice_id] = like.$id;
                    });
                    return updatedLikes;
                });
            } catch (error) {
                console.error('Error fetching personal feed likes:', error);
            }
        };

        fetchPersonalFeedLikes();
    }, [user_id, personalFeedNotices]);

    useEffect(() => {
        const fetchLikesOnFellowUsersNoticesInTheirProfile = async () => {
            try {
                if (!user_id || !fellowUserId) return;

                const noticeIdsInFeed = personalFeedNotices.map(notice => notice.$id);
                const userLikes = await getUserLikes(user_id, noticeIdsInFeed);

            } catch (error) {
                console.error('Error fetching personal feed likes:', error);
            }
        };

        fetchLikesOnFellowUsersNoticesInTheirProfile();
    }, [user_id, fellowUserId]);


    const addNotice = async (text, duration, noticeType, selectedTags, noticeGif, noticeUrl) => {

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

                noticeGif,
                noticeUrl
            };

            setIsAddingNotice(true);

            try {
                const createdNotice = await createNotice(newNotice);

                setLatestNotice(createdNotice);
                console.log('THIS WILL BE THE LATEST NOTICE:', createdNotice);
                console.log('expiresAt', expiresAt);


                return createdNotice;

            } catch (error) {
                console.error('Error adding notice:', error);
            } finally {
                setIsAddingNotice(false);
            }
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

        if (!noticeId) {
            console.error("Invalid notice ID");
            return;
        }

        setIsRemovingNotice(true);
        setRemovingNoticeId(noticeId);

        try {

            const [deleteNoticeRes, likesRes, savesRes] = await Promise.allSettled([
                deleteNotice(noticeId),
                removeAllSavesForNotice(noticeId),
                removeAllLikesForNotice(noticeId)
            ])

            if (deleteNoticeRes.status === "fulfilled") {
                console.log("Notice deleted successfully:", noticeId);
                return deleteNoticeRes.value; // Return deleted notice details
            } else {
                console.error("Error deleting notice:", deleteNoticeRes.reason);
            }

            // Log errors for likes & saves deletion (optional)
            if (likesRes.status === "rejected") {
                console.error("Error deleting likes:", likesRes.reason);
            }
            if (savesRes.status === "rejected") {
                console.error("Error deleting saves:", savesRes.reason);
            }
            // const removedNotice = await deleteNotice(noticeId);
            // return removedNotice;
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
            console.log('SELECTED TAGS IN useNotices:', selectedTags);

            const notices = await getFilteredNotices(selectedTags, limit, lastId, user_id);
            console.log('useNotices - getFeedNotices', notices);

            setGeneralFeedNotices(notices);
            return notices;
        } catch (error) {
            console.error('Error fetching filtered notices:', error);
        }
    };

    const getPersonalFeedNotices = async (limit, lastId) => {
        try {

            const accountsFollowedByUser = await getPersonalFeedAccounts(user_id);

            const idsForAccountsFollowedByUser = accountsFollowedByUser?.map((user) => user.$id);

            const notices = await getNoticesByUser(idsForAccountsFollowedByUser, limit, lastId);

            console.log('PERSONAL FEED NOTICES', notices);

            setPersonalFeedNotices(notices);

            return notices;

        } catch (error) {
            console.error('Error fetching personal feed notices:', error);
        }
    }

    const getNoticesByUser = useCallback(async (user_id, limit, lastId) => {
        try {
            const response = await getUserNotices(user_id, limit, lastId);

            return response;
        } catch (error) {
            console.error('Error getNoticesByUser - useNotices');
        }
    }, [data]);

    const fetchUserNotices = async (id, limit, lastId) => {
        if (!id) return;

        try {
            const usrNotices = await getNoticesByUser(id, limit, lastId);

            console.log('usrNotices - useNotices:', usrNotices);

            return usrNotices;

        } catch (error) {
            console.error('Error fetchUserNotices - useNotices');
        }
    }

    const getNoticeByNoticeId = async (notice_id) => {
        try {
            const res = await fetchNoticeByNoticeId(notice_id);

            console.log('Success fetching notices by notice_id', res);
            return res;

        } catch (error) {
            console.error('Error fetching notices by notice_id', error);
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

    const updateInterests = async () => {
        setIsInterestsUpdating(true);
        if (user_id) {
            try {
                const interests = await updateUserInterests(user_id, selectedTags);
                console.log('Interests updated:', interests);
                setIsAnyTagSelected(Object.values(interests).some(tagKey => tagKey === true));
                setFetchedInterests(interests);
                return interests;
            } catch (error) {
                console.error('Error updating user interests:', error);
            } finally {
                setIsInterestsUpdating(false);
            }
        } else {
            console.error('User ID not found');
        }
    }

    const fetchUserInterests = async () => {
        setIsInterestsLoading(true);
        if (user_id) {
            try {
                const userInterests = await getInterests(user_id);
                if (userInterests) {
                    const newSelectedTags = {};
                    tagCategories.forEach(category => {
                        category.tags.forEach(tag => {
                            newSelectedTags[tag.key] = userInterests[tag.key] || false;
                        });
                    });
                    setSelectedTags(newSelectedTags);
                    setIsAnyTagSelected(Object.values(userInterests).some(tagKey => tagKey === true));
                    setFetchedInterests(userInterests);
                    console.log('fetchUserInterests - useNotices', userInterests);
                }
            } catch (error) {
                console.error('Error fetching user interests:', error);
                if (error.code === 404) {
                    const newSelectedTags = {};
                    tagCategories.forEach(category => {
                        category.tags.forEach(tag => {
                            newSelectedTags[tag.key] = false;
                        });
                    });
                    setSelectedTags(newSelectedTags);
                }
            } finally {
                setIsInterestsLoading(false);
            }
        }
    };

    const toggleInterestsTag = (tagKey) => {
        setSelectedTags(prevSelectedTags => ({
            ...prevSelectedTags,
            [tagKey]: !prevSelectedTags[tagKey]
        }));
    };

    const deselectAllInterestTags = () => {
        setSelectedTags({});
    }

    const handleSave = async (notice_id, author_id, savedNoticesArr, setSaveFunc) => {
        try {
            if (savedNoticesArr[notice_id]) {
                await removeSave(savedNoticesArr[notice_id]);
                setSaveFunc((prevSaves) => {
                    const updatedSaves = { ...prevSaves };
                    delete updatedSaves[notice_id];
                    return updatedSaves;
                });
            } else {
                const newSave = await createSave(notice_id, author_id, user_id);
                setSaveFunc((prevSave) => ({
                    ...prevSave,
                    [notice_id]: newSave.$id,
                }));
            }
        } catch (error) {
            console.error('Error toggling saves:', error);
        }
    }

    const handleLike = async (notice_id, author_id, likedNoticesArr, setLikeFunc) => {
        try {
            if (likedNoticesArr[notice_id]) {
                await removeLike(likedNoticesArr[notice_id]);
                setLikeFunc((prevLikes) => {
                    const updatedLikes = { ...prevLikes };
                    delete updatedLikes[notice_id];
                    return updatedLikes;
                });
            } else {
                const newLike = await createLike(notice_id, author_id, user_id);
                setLikeFunc((prevLikes) => ({
                    ...prevLikes,
                    [notice_id]: newLike.$id,
                }));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const getNoticeByUserId = async (id, limit, offset) => {
        try {
            console.log('LIMIT - useNotice', limit);

            const res = await fetchNoticeByUserId(id, limit, offset);

            console.log('NOTICES:', res);

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

    // For saves icon 
    const fetchUserSaves = async (user_id, noticeIds) => {
        try {
            const res = await getUserSaves(user_id, noticeIds);

            console.log('FETCH USER SAVES', res);

            return res;
        } catch (error) {
            console.error('Error fetching SAVES in profile:', error);
        }
    }

    // For likes icon
    const fetchUserLikes = async (user_id, noticeIds) => {
        try {
            const res = await getUserLikes(user_id, noticeIds);

            console.log('FETCH USER LIKES', res);

            return res;
        } catch (error) {
            console.error('Error fetching likes in profile:', error);
        }
    }

    // For likes tab
    const getAllLikedNotices = async (userId, visitor_id, limit, offset) => {
        try {

            console.log('Starting getAllLikedNotices in unseNotices.js');

            const userLikes = await getUserLikesNotInFeed(userId, visitor_id, limit, offset);

            console.log('useNotice - getUserLikesNotInFeed', userLikes);

            const likedNoticeIds = userLikes.map(like => like.notice_id);

            console.log('useNotice - likedNoticeIds', likedNoticeIds);

            return await fetchAllLikedNotices(likedNoticeIds);

        } catch (error) {
            console.error('Error fetching all liked notices:', error);
            return [];
        }
    };

    // For saves tab
    const getAllSavedNotices = async (userId, visitor_id, limit, offset) => {
        try {

            const userSaves = await getUserSavesNotInFeed(userId, visitor_id, limit, offset);

            console.log('userSaves', userSaves);

            const saveNoticeIds = userSaves.map(save => save.notice_id);

            console.log('saveNoticeIds', saveNoticeIds);

            return await fetchAllSavedNotices(saveNoticeIds);

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
            const response = await createReaction(user_id, otherUser_id, content, now, notice_id, expiresAt, reactionGif);
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

    const onGeminiRun = async (templateSubject) => {

        try {
            setIsGeminiLoading(true);

            console.log('templateSubject in onGeminiRun', templateSubject);

            var geminiResult = '';

            if (templateSubject !== null) {
                var promptTxt = `Generate a template for ${templateSubject} in 300 characters or less. You may include emojis, but they must be within the character limit. Including emojis is optional. Always include placeholder(s) in the text.`;

                geminiResult = await runGemini(promptTxt);

                console.log('geminiRes - useNotices:', geminiResult);

                console.log(typeof (geminiResult));

                setGeminiRes(geminiResult);
            } else {
                geminiResult = 'You must select a template from the provided menu.';
            }

            return geminiResult;
        } catch (error) {
            console.error('Error running Gemini:', error);
        } finally {
            setIsGeminiLoading(false);
        }
    }

    const onGeminiRunClick = async (templateSubject, setNoticeText) => {
        console.log('templateSubject - useNotices.js', templateSubject);

        const aws = await onGeminiRun(templateSubject);

        setNoticeText(aws);
    }

    const hakop = () => {
        console.log('hakopppppppppppppp');
    }

    return {
        hakop,
        user_id,
        // userNotices,
        latestNotice,
        personalFeedLikedNotices,
        personalFeedSavedNotices,
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
        tagCategories,
        templateItems,
        isInterestsLoading,
        isInterestsUpdating,
        selectedTags,
        isAnyTagSelected,
        fetchedInterests,
        geminiRes,
        isGeminiLoading,
        setIsAnyTagSelected,
        setTagCategories,
        fetchUserInterests,
        toggleInterestsTag,
        deselectAllInterestTags,
        setSelectedTags,
        setFellowUserId,
        addNotice,
        editNotice,
        handleSaveEdit,
        removeNotice,
        handleDelete,
        deleteExpiredNotice,
        getFeedNotices,
        getPersonalFeedNotices,
        fetchUserNotices,
        getNoticesByUser,
        getNoticeByNoticeId,
        fetchUserLikes,
        fetchUserSaves,
        getInterests,
        setRemovingNoticeId,
        updateInterests,
        handleSave,
        setPersonalFeedSavedNotices,
        setSavedNotices,
        getAllLikedNotices,
        getNoticeByUserId,
        getAllLikesByNoticeId,
        getAllSavedNotices,
        handleReportNotice,
        handleLike,
        setLikedNotices,
        setPersonalFeedLikedNotices,
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
        setLikedReactions,
        onGeminiRun,
        onGeminiRunClick
    };
};

export default useNotices;