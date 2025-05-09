import { endpointEnv, projectEnv, avatarBucketEnv } from '../context/dbhandler';

export const getAvatarUrl = (avatarId) => {
    if (!avatarId) return null;

    console.log(`Getting avatar for ${avatarId}.`);

    const url = `${endpointEnv}/storage/buckets/${avatarBucketEnv}/files/${avatarId}/view?project=${projectEnv}`;
    return url;
};

export const getCroppedAvatar = (imageSrc, croppedAreaPixels, originalType) => {
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

            let outputType = originalType;
            let quality = 0.92;

            if (originalType === 'image/jpeg' || originalType === 'image/jpg') {
                quality = 0.8;
            }

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, outputType, quality);
        };
        image.onerror = (error) => reject(error);
    });
};
