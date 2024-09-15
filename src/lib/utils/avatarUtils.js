export const getAvatarUrl = (avatarId) => {
    if (!avatarId) return null;

    const url = `${import.meta.env.VITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_AVATAR_BUCKET}/files/${avatarId}/view?project=${import.meta.env.VITE_PROJECT}&mode=admin`;
    return url;
};
