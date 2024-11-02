import { useState, useEffect, useCallback } from 'react';
import { createNotice, getUserNotices, updateNotice, deleteNotice, deleteAllNotices, getFilteredNotices, updateUserInterests, getUserInterests, createSpread, getUserSpreads, removeSpread, createReport, createLike, removeLike, getUserLikes, getAllLikedNotices as fetchAllLikedNotices, getAllSpreadNotices as fetchAllSpreadNotices, createReaction, getAllReactionsBySenderId as fetchAllReactionsBySenderId, getAllReactions as fetchAllReactions, getAllReactionsByRecipientId as fetchAllReactionsByRecipientId, getNoticeByNoticeId as fetchNoticeByNoticeId, getAllReactionsByNoticeId as fetchAllReactionsByNoticeId } from '../../lib/context/dbhandler';
import { UserId } from '../../components/User/UserId.jsx';

const useNotices = (googleUserData) => {
    const [user_id, setUserId] = useState(null);
    const [userNotices, setUserNotices] = useState([]);
    const [spreadNotices, setSpreadNotices] = useState([]);
    const [likedNotices, setLikedNotices] = useState({});
    const [noticesReactions, setNoticesReactions] = useState([]);
    const [spreadReactions, setSpreadReactions] = useState([]);
    const [likedReactions, setLikedReactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNotice, setIsAddingNotice] = useState(false);
    const [isRemovingNotice, setIsRemovingNotice] = useState(false);
    const [removingNoticeId, setRemovingNoticeId] = useState(null);

    // const [offset, setOffset] = useState(0);  
    // const [limit] = useState(10);  

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

    // Fetch User Likes
    useEffect(() => {
        const fetchUserSpreads = async () => {
            try {
                const userSpreads = await getUserSpreads(user_id);

                const spreadNoticesMap = {};
                userSpreads.forEach(spread => {
                    spreadNoticesMap[spread.notice_id] = spread.$id;
                });
                setSpreadNotices(spreadNoticesMap);
            } catch (error) {
                console.error('Error fetching user spreads:', error);
            }
        };

        if (user_id) {
            fetchUserSpreads();
        }
    }, [user_id]);

    // Fetch User Spreads
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


    const addNotice = async (text, duration, selectedTags) => {

        if (user_id) {

            const now = new Date();
            const expiresAt = new Date(now.getTime() + duration * 3600000);

            const newNotice = {
                user_id: user_id,
                text,
                timestamp: now.toISOString(),
                expiresAt: expiresAt.toISOString(),

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
                setUserNotices((prevNotices) => [createdNotice, ...prevNotices]);
                return createdNotice;

            } catch (error) {
                console.error('Error adding notice:', error);
            } finally {
                setIsAddingNotice(false);
            }
        }
    };

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
        console.log('Current notices:', userNotices);

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

    const getFeedNotices = async (selectedTags, limit, offset) => {
        try {
            // console.log('selected tags', selectedTags);

            const notices = await getFilteredNotices(selectedTags, limit, offset);
            console.log('notices - getFeedNotices', notices);

            return notices;
        } catch (error) {
            console.error('Error fetching filtered notices:', error);
        }
    };

    const getNoticesByUser = useCallback(async (user_id, limit, offset) => {
        try {
            const response = await getUserNotices(user_id, limit, offset);
            return response;
        } catch (error) {
            console.error('Error getNoticesByUser - useNotices');
        }
    }, [googleUserData]);

    // In UserProfile.jsx and OtherUserProfile.jsx
    const fetchUserNotices = async (id, setNotices, limit, offset) => {
        if (!id) return;

        try {
            const usrNotices = await getNoticesByUser(id, limit, offset);

            setNotices(prevNotices => {
                const newNotices = usrNotices.filter(notice =>
                    !prevNotices.some(existingNotice => existingNotice.$id === notice.$id)
                );

                return [...prevNotices, ...newNotices];
            });

            const now = new Date().getTime();

            setNotices(prevNotices =>
                prevNotices.filter(notice => {
                    if (notice.expiresAt) {
                        const expiresAtDate = new Date(notice.expiresAt);
                        expiresAtDate.setHours(expiresAtDate.getHours() + 7); // Adjust for the 7-hour difference

                        if (expiresAtDate <= now) {
                            deleteNotice(notice.$id);
                            return false;
                        }
                    }
                    return true;
                })
            );

            // setNotices(prevNotices =>
            //     prevNotices.filter(notice => {
            //         if (notice.expiresAt) {
            //             const expirationTime = new Date(notice.expiresAt).getTime();

            //           
            //             if (now >= expirationTime) {
            //                 deleteNotice(notice.$id); 
            //                 return false; 
            //             }
            //         }
            //         return true;
            //     })
            // );

            // setNotices(prevNotices =>
            //     prevNotices.filter(notice => {
            //         if (notice.expiresAt && new Date(notice.expiresAt) <= now) {
            //             deleteNotice(notice.$id);
            //             return false; 
            //         }
            //         return true; 
            //     })
            // );

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

    const spreadNotice = async (notice_id, author_id) => {
        try {
            if (spreadNotices[notice_id]) {
                await removeSpread(spreadNotices[notice_id]);
                setSpreadNotices((prevSpreads) => {
                    const updatedSpreads = { ...prevSpreads };
                    delete updatedSpreads[notice_id];
                    return updatedSpreads;
                });
            } else {
                const newSpread = await createSpread(notice_id, author_id, user_id);
                setSpreadNotices((prevSpread) => ({
                    ...prevSpread,
                    [notice_id]: newSpread.$id,
                }));
            }
        } catch (error) {
            console.error('Error toggling spreads:', error);
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

    const getAllLikedNotices = async (user_id, limit, offset) => {
        try {

            const userLikes = await getUserLikes(user_id);

            const likedNoticeIds = userLikes.map(like => like.notice_id);

            return await fetchAllLikedNotices(likedNoticeIds, limit, offset);

        } catch (error) {
            console.error('Error fetching all liked notices:', error);
            return [];
        }
    };

    const getAllSpreadNotices = async (user_id, limit, offset) => {
        try {

            const userSpreads = await getUserSpreads(user_id);

            const spreadNoticeIds = userSpreads.map(like => like.notice_id);

            return await fetchAllSpreadNotices(spreadNoticeIds, limit, offset);

        } catch (error) {
            // console.error('Error fetching all spread notices:', error);
            return [];
        }
    };

    const reportNotice = async (notice_id, author_id, reason) => {
        try {
            await createReport(notice_id, author_id, reason, user_id);
            console.log('Notice reported successfully!');
        } catch (error) {
            console.error('Error reporting notice:', error);
            throw error;
        }
    };

    const sendReaction = async (otherUser_id, content, notice_id) => {

        const now = new Date();

        try {
            const response = createReaction(user_id, otherUser_id, content, now, notice_id);
            console.log('Success sending reaction');
            return response;
        } catch (error) {
            console.error('Failed to send reaction:', error);
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
    const getReactionsForNotice = async (notice_id) => {
        try {
            const response = await fetchAllReactionsByNoticeId(notice_id);
            console.log('getAllReactionsByNoticeId', response);
            return response;
        } catch (error) {
            console.error('ERROR - getAllReactionsByNoticeId', error);
        }
    }


    // const fetchReactionsForNotices = async (usrNtcs, setReactionsState) => {
    //     if (usrNtcs.length > 0) {
    //         const allReactions = [];

    //         // console.log('userNotices', usrNtcs);

    //         for (const notice of usrNtcs) {
    //             const res = await fetchAllReactionsByNoticeId(notice?.$id);

    //             console.log('res', res);

    //             const noticeReactions = res.documents || [];

    //             if (noticeReactions) {
    //                 allReactions.push(...noticeReactions);
    //             }
    //         }
    //         console.log(eval(`allReactions for ${setReactionsState}`, allReactions))
    //         // console.log(`allReactions for ${(setReactionsState)}`, allReactions);

    //         setReactionsState(allReactions);
    //     }
    // };




    return {
        user_id,
        userNotices,
        spreadNotices,
        likedNotices,
        isLoading,
        isAddingNotice,
        isRemovingNotice,
        removingNoticeId,
        noticesReactions,
        spreadReactions,
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
        spreadNotice,
        getAllLikedNotices,
        getAllSpreadNotices,
        reportNotice,
        likeNotice,
        setLikedNotices,
        removeAllNoticesByUser,
        sendReaction,
        getReactionsForNotice,
        // fetchReactionsForNotices,
        setNoticesReactions,
        setSpreadReactions,
        setLikedReactions
    };
};

export default useNotices;
