export const formatDateToLocal = (isoString) => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month} ${day} ${hours}:${minutes}`;
};
