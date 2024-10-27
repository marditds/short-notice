import { useState, useEffect } from 'react';
import { uploadAvatar, deleteAvatarFromStrg, updateAvatar, deleteAvatarFromDoc, getUserById, getUserByUsername, getAllUsersByString } from '../context/dbhandler';
import { getAvatarUrl } from '../utils/avatarUtils';

const useUserAvatar = (userId) => {

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        console.time('avatar-fetch');
        const fetchUserAvatar = async () => {

            if (userId === null) {
                console.log("No userId, skipping fetch");
                return;
            }

            const retryFetch = async (retries = 3, delay = 1000) => {
                try {
                    const user = await getUserById(userId);

                    if (user && user.avatar) {

                        const url = getAvatarUrl(user.avatar);

                        setAvatarUrl(url);
                    } else {
                        console.log("No avatar found for user");
                        setAvatarUrl('');
                    }
                } catch (error) {
                    if (retries > 0) {
                        console.log(`Retrying fetch... (${retries} attempts left)`);
                        setTimeout(() => retryFetch(retries - 1, delay), delay);
                    }
                    // else {
                    //     console.error('Error fetching user profile picture:', error);
                    //     setAvatarUrl('');
                    // }
                }
            };
            retryFetch();
        };

        fetchUserAvatar();
        fetchUserAvatar().finally(() => console.timeEnd('avatar-fetch'));
    }, [userId]);

    const getUserAvatarById = async (userId) => {
        try {
            const user = await getUserById(userId);
            console.log('user,', user);

            const url = getAvatarUrl(user.avatar);
            console.log('url,', url);

            return url;

        } catch (error) {
            console.error('Error getting user avatar:', error);
        }
    }

    const getUserAvatarByString = async (str) => {
        try {
            const users = await getAllUsersByString(str);
            console.log('users,', users);

            // const url = getAvatarUrl(user.avatar);
            // console.log('url,', url);

            // return url;

        } catch (error) {
            console.error('Error getting user avatar:', error);
        }
    }

    const handleAvatarUpload = async (e) => {

        const file = e.target.files[0];

        if (file) {

            setIsUploading(true);

            try {
                const fileId = await uploadAvatar(file);

                await updateAvatar(userId, fileId);

                const url = `${import.meta.env.VITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_AVATAR_BUCKET}/files/${fileId}/view?project=${import.meta.env.VITE_PROJECT}&mode=admin`;

                setAvatarUrl(url);
            } catch (error) {
                console.error('Profile picture upload failed:', error);
            } finally {
                setIsUploading(false);
            }
        }
    }

    const handleDeleteAvatarFromStrg = async (fileId) => {
        try {
            const response = await deleteAvatarFromStrg(fileId);
            console.log('Avatar deleted from storage:', response);

        } catch (error) {
            console.error('Error deleting avatar from storage:', error);
        }
    };

    const handleDeleteAvatarFromDoc = async () => {
        try {
            const response = await deleteAvatarFromDoc(userId);
            console.log('Avatar deleted from doc successfully:', response);
        } catch (error) {
            console.error('Error deleting avatar from doc:', error);
        }
    }

    const extractFileIdFromUrl = (url) => {
        const parts = url.split('/');
        const fileId = parts[parts.length - 2];
        return fileId;
    };

    return {
        avatarUrl,
        setAvatarUrl,
        isUploading,
        getUserAvatarById,
        handleAvatarUpload,
        handleDeleteAvatarFromStrg,
        handleDeleteAvatarFromDoc,
        extractFileIdFromUrl
    };
}

export default useUserAvatar;
