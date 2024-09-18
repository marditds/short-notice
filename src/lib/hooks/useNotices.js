import { useState, useEffect } from 'react';
import { createNotice, getUserNotices, updateNotice, deleteNotice, getAllNotices, getFilteredNotices, updateUserInterests, getUserInterests, createSpreads, fetchSpreads } from '../../lib/context/dbhandler';
import { UserId } from '../../components/User/UserId.jsx';

const useNotices = (googleUserData) => {
    const [user_id, setUserId] = useState(null);
    const [userNotices, setUserNotices] = useState([]);
    const [userSpreads, setUserSpreads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNotice, setIsAddingNotice] = useState(false);
    const [isRemovingNotice, setIsRemovingNotice] = useState(false);
    const [removingNoticeId, setRemovingNoticeId] = useState(null);


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

    useEffect(() => {
        const fetchUserSpreads = async () => {
            if (user_id) {
                const spreads = await getSpreads();
                // setUserSpreads(spreads);
                console.log('Fetched spreads collection for user:', spreads);

                // Fetch all notices and compare with spreads
                const allNotices = await getAllNotices();
                const matchedNotices = compareNoticesWithSpreads(allNotices, spreads);
                setUserSpreads(matchedNotices);
                console.log('Users spreads:', matchedNotices);

            }
        };

        fetchUserSpreads();
    }, [user_id]);

    const compareNoticesWithSpreads = (notices, spreads) => {
        return notices.filter(notice =>
            spreads.some(spread => spread.notice_id === notice.$id)
        );
    };

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

    const addSpreads = async (user_id, author_id, notice_id, timestamp) => {
        try {
            const response = await createSpreads(user_id, author_id, notice_id, timestamp);
            console.log('Spreading!', response);
        } catch (error) {
            console.error('Not spreading:', error);

        }
    }

    const getSpreads = async () => {
        try {
            if (user_id) {
                const spreads = await fetchSpreads(user_id);
                setUserSpreads(spreads);
                // console.log('Got User Spreads:', spreads);
                return spreads;
            } else {
                console.log('User ID is not available');
                return [];
            }
        } catch (error) {
            console.error('Error fetching spreads:', error);
        }
    }


    return {
        user_id,
        userNotices,
        userSpreads,
        isLoading,
        isAddingNotice,
        isRemovingNotice,
        removingNoticeId,
        addNotice,
        editNotice,
        removeNotice,
        getFeedNotices,
        getInterests,
        setRemovingNoticeId,
        updateInterests,
        addSpreads,
        getSpreads
    };
};

export default useNotices;
