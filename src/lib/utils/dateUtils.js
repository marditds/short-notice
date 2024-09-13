export const formatDateToLocal = (isoString) => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month} ${day}, ${hours}:${minutes}`;
};


export const calculateCountdown = (expiresAt) => {
    const currentTime = new Date();
    const expiryTime = new Date(expiresAt);

    const difference = expiryTime - currentTime;

    if (difference <= 0) {
        return "Expiring soon";
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
};