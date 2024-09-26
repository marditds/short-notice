import { useState, useEffect } from 'react';
import { createNotice, getUserNotices, updateNotice, deleteNotice, getAllNotices, getFilteredNotices, updateUserInterests, getUserInterests, createSpreads, getUserSpreads, removeSpread, createReport, createLike, removeLike, getUserLikes, getAllLikedNotices as fetchAllLikedNotices } from '../../lib/context/dbhandler';
import { UserId } from '../../components/User/UserId.jsx';

const useNotices = (googleUserData) => {
    const [user_id, setUserId] = useState(null);
    const [userNotices, setUserNotices] = useState([]);
    const [userSpreads, setUserSpreads] = useState([]);
    const [likedNotices, setLikedNotices] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNotice, setIsAddingNotice] = useState(false);
    const [isRemovingNotice, setIsRemovingNotice] = useState(false);
    const [removingNoticeId, setRemovingNoticeId] = useState(null);

    // Fetch User Notces
    useEffect(() => {
        const fetchUserNotices = async () => {
            if (googleUserData) {
                try {
                    const id = await UserId(googleUserData);

                    console.log('TYPE OF USER ID:', typeof (id));

                    setUserId(id);

                    if (id) {
                        const notices = await getUserNotices(id);
                        setUserNotices(notices);
                    }
                } catch (error) {
                    console.error('Error fetching user notices:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchUserNotices();

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

    // Fetch User Spreads
    useEffect(() => {
        const fetchUserSpreads = async () => {
            if (user_id) {
                const spreads = await getUserSpreads(user_id);

                // console.log('Spreads', spreads);

                const allNotices = await getAllNotices();

                // console.log('allNotices', allNotices);

                const matchedNotices = compareNoticesWithSpreads(allNotices, spreads);
                setUserSpreads(matchedNotices);
            }
        };

        fetchUserSpreads();
    }, [user_id]);

    const compareNoticesWithSpreads = (notices, spreads) => {
        return notices.filter(notice =>
            spreads.some(spread => spread.notice_id === notice.$id)
        );
    };

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
            } catch (error) {
                console.error('Error adding notice:', error);
            } finally {
                setIsAddingNotice(false);
            }
        }
    };

    const editNotice = async (noticeId, newText) => {
        await updateNotice(noticeId, newText);
        setUserNotices((prevNotices) =>
            prevNotices.map((notice) =>
                notice.$id === noticeId ? { ...notice, text: newText } : notice
            )
        );
    };

    const removeNotice = async (noticeId) => {

        console.log('Attempting to delete notice with ID:', noticeId);
        console.log('Current notices:', userNotices);

        setIsRemovingNotice(true);
        setRemovingNoticeId(noticeId);

        try {
            await deleteNotice(noticeId);
            setUserNotices((prevNotices) => prevNotices.filter((notice) => notice.$id !== noticeId));
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

    const getFeedNotices = async (selectedTags) => {
        try {
            // console.log('selected tags', selectedTags);

            const notices = await getFilteredNotices(selectedTags);
            return notices;
        } catch (error) {
            console.error('Error fetching filtered notices:', error);
        }
    };

    const getNoticesByUser = async (user_id) => {
        try {
            const response = await getUserNotices(user_id);
            return response;
        } catch (error) {
            console.error('Error getNoticesByUser - useNotices');
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

    const addSpreads = async (notice_id, author_id) => {
        try {
            if (userSpreads[notice_id]) {
                await removeSpread(userSpreads[notice_id]);
                setUserSpreads((prevSpreads) => {
                    const updatedSpreads = { ...prevSpreads };
                    delete updatedSpreads[notice_id];
                    return updatedSpreads;
                });
            } else {
                const newSpread = await createSpreads(notice_id, author_id, user_id);
                setUserSpreads((prevSpread) => ({
                    ...prevSpread,
                    [notice_id]: newSpread.$id,
                }));
            }
        } catch (error) {
            console.error('Error toggling spreads:', error);
        }
    }

    const reportNotice = async (notice_id, author_id, reason, user_id) => {
        try {
            const response = await createReport(notice_id, author_id, reason, user_id);
            console.log('Reporting!', response);
        } catch (error) {
            console.error('Not reporting:', error);
        }
    }

    const likeNotice = async (notice_id, author_id) => {
        try {
            if (likedNotices[notice_id]) {
                // Remove like if already liked
                await removeLike(likedNotices[notice_id]);
                setLikedNotices((prevLikes) => {
                    const updatedLikes = { ...prevLikes };
                    delete updatedLikes[notice_id]; // Remove from liked notices
                    return updatedLikes;
                });
            } else {
                // Create a new like if not liked yet
                const newLike = await createLike(notice_id, author_id, user_id);
                setLikedNotices((prevLikes) => ({
                    ...prevLikes,
                    [notice_id]: newLike.$id, // Add the new like
                }));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const getAllLikedNotices = async () => {
        try {

            const userLikes = await getUserLikes(user_id);

            const likedNoticeIds = userLikes.map(like => like.notice_id);

            return await fetchAllLikedNotices(likedNoticeIds);

        } catch (error) {
            console.error('Error fetching all liked notices:', error);
            return [];
        }
    };



    return {
        user_id,
        userNotices,
        userSpreads,
        likedNotices,
        isLoading,
        isAddingNotice,
        isRemovingNotice,
        removingNoticeId,
        addNotice,
        editNotice,
        removeNotice,
        getFeedNotices,
        getNoticesByUser,
        getInterests,
        setRemovingNoticeId,
        updateInterests,
        addSpreads,
        getAllLikedNotices,
        reportNotice,
        likeNotice,

    };
};

export default useNotices;
