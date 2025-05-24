export const forbiddenUsrnms = ['feed', 'profile', 'settings', 'legal', 'user', 'users', 'username', 'usernames'];

export const usrnmMaxLngth = 16;

export const usrnmTruncateLngth = 9;

export const truncateUsername = (username) => {
    if (typeof username !== 'string') {
        throw new Error('Username must be a string');
    }
    const usrnm = username.length <= usrnmTruncateLngth ? username : username.slice(0, usrnmTruncateLngth) + '...';
    return usrnm;
};
