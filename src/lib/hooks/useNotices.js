import { useState, useEffect } from 'react';
import { createNotice, getUserNotices, updateNotice, deleteNotice } from '../../lib/context/dbhandler';
import { UserId } from '../../components/User/UserId.jsx';

const useNotices = (googleUserData) => {
    const [user_id, setUserId] = useState(null);
    const [userNotices, setUserNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNotice, setIsAddingNotice] = useState(false);
    const [isRemovingNotice, setIsRemovingNotice] = useState(false);
    const [removingNoticeId, setRemovingNoticeId] = useState(null);


    useEffect(() => {
        const fetchUserNotices = async () => {
            if (googleUserData) {
                try {
                    const id = await UserId(googleUserData);
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
                    if (notice.expiresIn && new Date(notice.expiresIn) <= now) {
                        deleteNotice(notice.$id);
                        return false;
                    }
                    return true;
                })
            );
        }, 60000);

        return () => clearInterval(checkExpiredNotices);

    }, [googleUserData]);

    const addNotice = async (text, duration) => {

        if (user_id) {

            const now = new Date();
            const expiresIn = duration * 60000;

            const newNotice = {
                user_id: user_id,
                text,
                timestamp: now.toISOString(),
                expiresIn: Math.floor(expiresIn / 1000)
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

        setRemovingNoticeId(noticeId);

        try {
            await deleteNotice(noticeId);
            setUserNotices((prevNotices) => prevNotices.filter((notice) => notice.$id !== noticeId));
        } catch (error) {
            console.error('Error deleting notice:', error);
        } finally {
            setRemovingNoticeId(null);
        }

    };



    return {
        user_id,
        userNotices,
        isLoading,
        isAddingNotice,
        isRemovingNotice,
        removingNoticeId,
        addNotice,
        editNotice,
        removeNotice,
    };
};

export default useNotices;
