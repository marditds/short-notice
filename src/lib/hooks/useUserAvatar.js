import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { endpointEnv, projectEnv, avatarBucketEnv, uploadAvatar, deleteAvatarFromStrg, updateAvatar, deleteAvatarFromDoc, getUserById, getAllUsersByString } from '../context/dbhandler';
import { getAvatarUrl } from '../utils/avatarUtils';
import { useUserContext } from '../context/UserContext';

export const useUserAvatar = (id) => {

    const { userId } = useUserContext();

    const location = useLocation();

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileFormatError, setFileFormatError] = useState(null);
    const [avatarUploadSuccessMsg, setAvatarUploadSuccessMsg] = useState(null);


    const fetchUserAvatarForProfile = async (user_id) => {

        if (!user_id) {
            return;
        }

        try {
            setIsAvatarLoading(true);
            const user = await getUserById(user_id);

            console.log('THIS IS USER IN fetchUserAvatar:', user);

            if (user && user.avatar) {

                const url = getAvatarUrl(user.avatar);

                setAvatarUrl(url);
            } else {
                console.log("No avatar found for user");
                setAvatarUrl(null);
            }
        } catch (error) {
            console.error('Error fetching Avatar:', error);

        } finally {
            setIsAvatarLoading(false);
        }
    };

    useEffect(() => {
        console.log('isAvatarLoading', isAvatarLoading);
    }, [isAvatarLoading])

    const getUserAvatarById = async () => {
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

    const getUserAvatarByString = async (str) => {
        try {
            const users = await getAllUsersByString(str);
            console.log('users,', users);

        } catch (error) {
            console.error('Error getting user avatar:', error);
        }
    }

    const handleAvatarUpload = async (e) => {

        const file = e.target.files[0];

        if (file) {

            // setIsUploading(true);
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

                const url = `${endpointEnv}/storage/buckets/${avatarBucketEnv}/files/${uploadedAvatarFile.$id}/view?project=${projectEnv}&mode=admin`;

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
                // setIsUploading(false);
                console.log('Avatar uploading done.');

            }
        }
    }

    const handleDeleteAvatarFromStrg = async (fileId) => {
        try {
            const response = await deleteAvatarFromStrg(fileId);

        } catch (error) {
            console.error('Error deleting avatar from storage:', error);
        }
    };

    const handleDeleteAvatarFromDoc = async () => {
        try {
            const response = await deleteAvatarFromDoc(userId);

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
        fetchUserAvatarForProfile,
        getUserAvatarById,
        handleAvatarUpload,
        handleDeleteAvatarFromStrg,
        handleDeleteAvatarFromDoc,
        setIsUploading,
        extractFileIdFromUrl,
        setFileFormatError,
        setAvatarUploadSuccessMsg
    };
}