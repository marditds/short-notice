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

    }, [googleUserData]);

    const addNotice = async (text) => {

        if (user_id) {
            const newNotice = {
                user_id: user_id,
                text,
                timestamp: new Date(),
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
