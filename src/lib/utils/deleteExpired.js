
export const deleteExpired = async (notices, removeNotice) => {

    const now = new Date();
    const TIMEZONE_OFFSET_HOURS = 8;
    const TIMEZONE_OFFSET_MS = TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;

    const unExpiredNotices = notices.filter((notice) => {

        const expirationTime = new Date(notice.expiresAt).getTime();

        const adjustedExpirationTime = expirationTime + TIMEZONE_OFFSET_MS;

        if (notice.expiresAt && adjustedExpirationTime <= now) {
            console.log('Deleting notice with this text:', notice.text);
            removeNotice(notice.$id);
            return false;
        } else {
            return true;
        }
    })

    return unExpiredNotices;
}