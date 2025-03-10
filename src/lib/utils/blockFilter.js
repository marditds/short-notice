import useUserInfo from "../hooks/useUserInfo";

export const useUnblockedNotices = () => {

    const {
        getBlockedUsersByUser,
        getUsersBlockingUser
    } = useUserInfo();

    // For Profiles
    const filterBlocksFromLikesSaves = async (unfilteredBatch, user_id) => {
        const blockedUsersByUser = await getBlockedUsersByUser(user_id);

        console.log('blockedUsersByUser', blockedUsersByUser);

        const noticesFromAccountsNotBlockedByUser = unfilteredBatch.filter((instance) =>
            blockedUsersByUser.every((user) => instance.author_id !== user.blocked_id)
        );

        console.log('noticesFromAccountsNotBlockedByUser', noticesFromAccountsNotBlockedByUser);

        const usersBlockingUser = await getUsersBlockingUser(user_id);

        console.log('usersBlockingUser', usersBlockingUser);

        var noticesWithoutTwoWayBlock = [];

        noticesWithoutTwoWayBlock = noticesFromAccountsNotBlockedByUser.filter((instance) => usersBlockingUser.every((user) => instance.author_id !== user.blocker_id));

        return noticesWithoutTwoWayBlock;
    }

    // For Feed
    const filterBlocksFromFeed = async (unfilteredBatch, user_id) => {
        const blockedUsersByUser = await getBlockedUsersByUser(user_id);

        console.log('blockedUsersByUser', blockedUsersByUser);

        const noticesFromAccountsNotBlockedByUser = unfilteredBatch.filter((instance) =>
            blockedUsersByUser.every((user) => instance.user_id !== user.blocked_id)
        );

        console.log('noticesFromAccountsNotBlockedByUser', noticesFromAccountsNotBlockedByUser);

        const usersBlockingUser = await getUsersBlockingUser(user_id);

        console.log('usersBlockingUser', usersBlockingUser);

        var noticesWithoutTwoWayBlock = [];

        noticesWithoutTwoWayBlock = noticesFromAccountsNotBlockedByUser.filter((instance) => usersBlockingUser.every((user) => instance.user_id !== user.blocker_id));

        return noticesWithoutTwoWayBlock;
    }

    return {
        filterBlocksFromLikesSaves,
        filterBlocksFromFeed
    }
}

