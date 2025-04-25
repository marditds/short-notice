import { useState, useEffect } from 'react';
import { uploadAvatar, deleteAvatarFromStrg, updateAvatar, deleteAvatarFromDoc, getUserById, getAllUsersByString } from '../context/dbhandler';
import { getAvatarUrl } from '../utils/avatarUtils';

export const useUserAvatar = (userId) => {

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileFormatError, setFileFormatError] = useState('');
    const [avatarUploadSuccessMsg, setAvatarUploadSuccessMsg] = useState('');

    useEffect(() => {
        // console.time('avatar-fetch');
        setIsAvatarLoading(true);

        const fetchUserAvatar = async () => {

            if (userId === null) {
                console.log("No userId, skipping fetch");
                return;
            }

            // const retryFetch = async (retries = 3, delay = 1000) => {
            try {
                const user = await getUserById(userId);

                if (user && user.avatar) {

                    const url = getAvatarUrl(user.avatar);

                    setAvatarUrl(url);
                } else {
                    console.log("No avatar found for user");
                    setAvatarUrl(null);
                }
            } catch (error) {
                console.error('Error fetching Avatar:', error);
                // if (retries > 0) {
                //     console.log(`Retrying fetch... (${retries} attempts left)`);
                //     setTimeout(() => retryFetch(retries - 1, delay), delay);
                // }
            } finally {
                setIsAvatarLoading(false);
            }
            // };
            // retryFetch();
        };
        fetchUserAvatar();
        // fetchUserAvatar().finally(() => console.timeEnd('avatar-fetch'));
    }, [userId, avatarUrl]);

    const getUserAvatarById = async (userId) => {
        try {
            const user = await getUserById(userId);
            console.log('user,', user);

            const url = getAvatarUrl(user.avatar);
            console.log('getAvatarUrl,', url);

            return url;

        } catch (error) {
            console.error('Error getting user avatar:', error);
        }
    }

    useEffect(() => {
        console.log('isAvatarLoading', isAvatarLoading);
    }, [isAvatarLoading])

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
            console.log('Avatar uploading starting...');

            try {
                // console.log('file in handleAvatarUpload:', file);

                if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                    setFileFormatError('Accepted file formats are PNG and JPG/JPEG.');
                    setAvatarUploadSuccessMsg('');
                    return;
                }

                const uploadedAvatarFile = await uploadAvatar(file);

                // console.log('uploadedAvatarFile in handleAvatarUpload:', uploadedAvatarFile);

                if (typeof uploadedAvatarFile === 'string') {
                    setFileFormatError(uploadedAvatarFile);
                    setAvatarUploadSuccessMsg('');
                    return;
                }

                if (uploadedAvatarFile.mimeType !== 'image/png' && uploadedAvatarFile.mimeType !== 'image/jpeg' && uploadedAvatarFile.mimeType !== 'image/jpg') {
                    setFileFormatError('Accepted file formats are PNG and JPG/JPEG.');
                    setAvatarUploadSuccessMsg('');
                    return;
                }

                const updateAvatarRes = await updateAvatar(userId, uploadedAvatarFile.$id);

                const url = `${import.meta.env.VITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_AVATAR_BUCKET}/files/${uploadedAvatarFile.$id}/view?project=${import.meta.env.VITE_PROJECT}&mode=admin`;

                setAvatarUrl(url);

                if (typeof updateAvatarRes === 'string') {
                    setFileFormatError(updateAvatarRes);
                    setAvatarUploadSuccessMsg('');
                    return;
                }

                if ((typeof updateAvatarRes !== 'string') && (updateAvatarRes !== undefined)) {
                    setAvatarUploadSuccessMsg('Avatar uploaded successfully.');
                    setFileFormatError('');
                }

            } catch (error) {
                console.error('Profile picture upload failed:', error);
                setFileFormatError('Avatar upload failed. Please try again later.');
                setAvatarUploadSuccessMsg('');
            } finally {
                setIsUploading(false);
                console.log('Avatar uploading done.');

            }
        }
    }

    const handleDeleteAvatarFromStrg = async (fileId) => {

        // console.log('fileId in handleDeleteAvatarFromStrg:', fileId);

        try {
            const response = await deleteAvatarFromStrg(fileId);
            // console.log('Avatar deleted from storage:', response);

        } catch (error) {
            console.error('Error deleting avatar from storage:', error);
        }
    };

    const handleDeleteAvatarFromDoc = async () => {
        try {
            const response = await deleteAvatarFromDoc(userId);
            // console.log('Avatar deleted from doc successfully:', response);
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
        isUploading,
        isAvatarLoading,
        fileFormatError,
        avatarUploadSuccessMsg,
        setAvatarUrl,
        getUserAvatarById,
        handleAvatarUpload,
        handleDeleteAvatarFromStrg,
        handleDeleteAvatarFromDoc,
        extractFileIdFromUrl,
        setFileFormatError,
        setAvatarUploadSuccessMsg
    };
}