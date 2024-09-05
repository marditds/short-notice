export const formatDateToLocal = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};
