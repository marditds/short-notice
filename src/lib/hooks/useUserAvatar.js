import { useState, useEffect } from 'react';
import { uploadAvatar, updateUserProfile, getUserById } from '../context/dbhandler';

export const useUserAvatar = (userId) => {

    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        const fetchUserAvatar = async () => {

            if (!userId) {
                console.log("No userId, skipping fetch");
                return;
            }
            const retryFetch = async (retries = 3, delay = 1000) => {
                try {
                    const user = await getUserById(userId);

                    if (user && user.avatar) {
                        const url = `${import.meta.env.VITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_AVATAR_BUCKET}/files/${user.avatar}/view?project=${import.meta.env.VITE_PROJECT}&mode=admin`;

                        setAvatarUrl(url);
                    } else {
                        console.log("No avatar found for user");
                        setAvatarUrl('');
                    }
                } catch (error) {
                    if (retries > 0) {
                        console.log(`Retrying fetch... (${retries} attempts left)`);
                        setTimeout(() => retryFetch(retries - 1, delay), delay);
                    } else {
                        console.error('Error fetching user profile picture:', error);
                        setAvatarUrl('');
                    }
                }
            };
            retryFetch();
        };

        fetchUserAvatar();
    }, [userId]);

    const handleAvatarUpload = async (e) => {

        const file = e.target.files[0];

        if (file) {
            try {
                const fileId = await uploadAvatar(file);

                await updateUserProfile(userId, fileId);
                const url = `${import.meta.env.VITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_AVATAR_BUCKET}/files/${fileId}/view?project=${import.meta.env.VITE_PROJECT}&mode=admin`;

                setAvatarUrl(url);
            } catch (error) {
                console.error('Profile picture upload failed:', error);
            }
        }
    }

    return { avatarUrl, handleAvatarUpload };
}
