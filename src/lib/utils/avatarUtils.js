export const getAvatarUrl = (avatarId) => {
    if (!avatarId) return null;

    const url = `${import.meta.env.VITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_AVATAR_BUCKET}/files/${avatarId}/view?project=${import.meta.env.VITE_PROJECT}`;
    return url;
};

export const getCroppedAvatar = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        };
        image.onerror = (error) => reject(error);
    });
}
