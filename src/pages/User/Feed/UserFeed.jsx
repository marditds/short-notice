import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { Notices } from '../../../components/User/Notices';
import { useUnblockedNotices } from '../../../lib/utils/blockFilter';
import { Button } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { FeedHeader } from '../../../components/User/Feed/FeedHeader/FeedHeader';

const UserFeed = () => {

    const [tagCategories, setTagCategories] = useState([
        {
            group: 'STEM',
            tags: [
                { name: 'Science', key: 'science' },
                { name: 'Technology', key: 'technology' },
                { name: 'Engineering', key: 'engineering' },
                { name: 'Math', key: 'math' }
            ],
            values: [false, false, false, false]
        },
        {
            group: 'Humanities and Arts',
            tags: [
                { name: 'Literature', key: 'literature' },
                { name: 'History', key: 'history' },
                { name: 'Philosophy', key: 'philosophy' },
                { name: 'Music', key: 'music' }
            ],
            values: [false, false, false, false]
        },
        {
            group: 'Social Sciences and Professions',
            tags: [
                { name: 'Medicine', key: 'medicine' },
                { name: 'Economics', key: 'economics' },
                { name: 'Law', key: 'law' },
                { name: 'Political Science', key: 'polSci' },
                { name: 'Sports', key: 'sports' }
            ],
            values: [false, false, false, false, false]
        }
    ]);

    const [selectedTags, setSelectedTags] = useState({});
    const [isTagSelected, setIsTagSelected] = useState(false);
    const { googleUserData } = useUserContext();

    const {
        user_id,
        likedNotices,
        savedNotices,
        getInterests,
        getFeedNotices,
        saveNotice,
        reportNotice,
        likeNotice,
        sendReaction,
        getReactionsForNotice,
        getReactionByReactionId,
        reportReaction,
        getNoticesByUser,
        // noticesReactions, 
        // fetchReactionsForNotices,
        // setNoticesReactions
    } = useNotices(googleUserData);

    const { fetchUsersData, getUserAccountByUserId, fetchAccountsFollowedByUser } = useUserInfo(googleUserData);
    const { filterBlocksFromFeed } = useUnblockedNotices();

    const [generalFeedNotices, setGeneralFeedNotices] = useState([]);
    const [personalFeedNotices, setPersonalFeedNotices] = useState([]);

    const [isLoadingGeneralFeedNotices, setIsLoadingGeneralFeedNotices] = useState(false);
    const [isLoadingPersonalFeedNotices, setIsLoadingPersonalFeedNotices] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const [isFeedToggled, setIsFeedToggled] = useState(false);

    // General Feed
    const [limit] = useState(10);
    const [lastId, setLastId] = useState(null);
    const [hasMoreGeneralNotices, setHasMoreGeneralNotices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadMore, setLoadMore] = useState(false);

    // Personal Feed
    const [limitPersonal] = useState(10);
    const [lastIdPersonal, setLastIdPersonal] = useState(null);
    const [hasMorePersonalNotices, setHasMorePersonalNotices] = useState(true);
    const [isLoadingMorePersonal, setIsLoadingMorePersonal] = useState(false);
    const [loadMorePersonal, setLoadMorePersonal] = useState(false);


    // Fetch User's interests  
    useEffect(() => {
        const fetchUserInterests = async () => {
            if (user_id) {
                try {
                    const userInterests = await getInterests(user_id);

                    if (userInterests) {
                        setSelectedTags(userInterests);
                    }
                } catch (error) {
                    console.error('Error fetching user interests:', error);
                }
            }
        };

        fetchUserInterests();
    }, [user_id, tagCategories]);

    // Fetch selected tags
    useEffect(() => {
        try {
            const falseVal = Object.values(selectedTags).filter((tag) => tag === false);

            function indexOfAll(array, value) {
                const indices = [];
                for (let i = 0; i < array.length; i++) {
                    if (array[i] === value) {
                        indices.push(i);
                    }
                }
                return indices;
            }

            const indices = indexOfAll(falseVal, false);
            console.log('Indices of false values:', indices.length);

            if (indices.length < 13) {
                setIsTagSelected(true);
            } else {
                setIsTagSelected(false);
            }
        } catch (error) {
            console.error('Error fetching selected tags:', error);
        }
    }, [selectedTags])

    // Fetch feed (general)-(initial)
    useEffect(() => {
        const fetchInitialGeneralFeed = async () => {
            setIsLoadingGeneralFeedNotices(true);
            setIsLoadingUsers(true);
            try {
                console.log('Limit:', limit);
                console.log('Last ID:', lastId);

                const notices = await getFeedNotices(selectedTags, limit, null);

                console.log('Fetched notices:', notices);

                const filteredNotices = await filterBlocksFromFeed(notices, user_id);
                console.log('Filtered notices:', filteredNotices);

                await fetchUsersData(filteredNotices, setGeneralFeedNotices, avatarUtil);

                if (filteredNotices.length < limit) {
                    setHasMoreGeneralNotices(false);
                } else {
                    setHasMoreGeneralNotices(true);
                    setLastId(filteredNotices[filteredNotices.length - 1].$id);
                }
            } catch (error) {
                console.error('Error fetching initial feed notices:', error);
            } finally {
                setIsLoadingGeneralFeedNotices(false);
                setIsLoadingUsers(false);
            }
        };
        if (isFeedToggled && generalFeedNotices.length === 0) {
            fetchInitialGeneralFeed();
        }
    }, [isFeedToggled]);

    // Fetch feed (general)-(subsequent) 
    useEffect(() => {
        if (!loadMore) return;
        const fetchSubsequentGeneralFeed = async () => {
            setIsLoadingMore(true);
            try {
                console.log('Limit:', limit);
                console.log('Last ID:', lastId);

                const notices = await getFeedNotices(selectedTags, limit, lastId);
                console.log('Fetched notices:', notices);

                const filteredNotices = await filterBlocksFromFeed(notices, user_id);
                console.log('Filtered notices:', filteredNotices);

                await fetchUsersData(filteredNotices, setGeneralFeedNotices, avatarUtil);

                if (filteredNotices.length < limit) {
                    setHasMoreGeneralNotices(false);
                } else {
                    setLastId(filteredNotices[filteredNotices.length - 1].$id);
                }
            } catch (error) {
                console.error('Error loading more notices:', error);
            } finally {
                setIsLoadingMore(false);
                setLoadMore(false);
            }
        };
        if (isFeedToggled && loadMore) {
            fetchSubsequentGeneralFeed();
        }
    }, [loadMore, lastId, isFeedToggled]);

    // Fetch feed (personal)-(initial)
    useEffect(() => {
        const fetchInitialPersonalFeed = async () => {
            try {
                setIsLoadingPersonalFeedNotices(true);
                setIsLoadingUsers(true);
                setIsLoadingMorePersonal(true);

                const followedByUser = await fetchAccountsFollowedByUser(user_id);
                console.log('followedByUser', followedByUser);

                const allNotices = await Promise.all(
                    followedByUser.map((user) =>
                        getNoticesByUser(user.$id, limitPersonal, lastIdPersonal)
                    )
                );

                let usrNtcs = allNotices.flat();

                usrNtcs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                console.log('usrNtcs - Personal', usrNtcs);

                await fetchUsersData(usrNtcs, setPersonalFeedNotices, avatarUtil);

                if (usrNtcs.length < limitPersonal) {
                    setHasMorePersonalNotices(false);
                } else {
                    setHasMorePersonalNotices(true);
                    setLastIdPersonal(usrNtcs[usrNtcs.length - 1].$id);
                }
            } catch (error) {
                console.error('Error fetching personal feed', error);
            } finally {
                setIsLoadingPersonalFeedNotices(false);
                setIsLoadingUsers(false);
                setIsLoadingMorePersonal(false);
            }
        };
        fetchInitialPersonalFeed();
    }, [user_id]);

    // Fetch feed (personal)-(subsequent)
    useEffect(() => {
        if (!loadMorePersonal) return;

        const fetchSubsequentPersonalFeed = async () => {
            try {
                setIsLoadingMorePersonal(true);

                const followedByUser = await fetchAccountsFollowedByUser(user_id);

                const allNotices = await Promise.all(
                    followedByUser.map((user) =>
                        getNoticesByUser(user.$id, limitPersonal, lastIdPersonal)
                    )
                );

                let usrNtcs = allNotices.flat();

                usrNtcs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                console.log('usrNtcs - Personal', usrNtcs);

                await fetchUsersData(usrNtcs, setPersonalFeedNotices, avatarUtil);

                if (usrNtcs.length < limitPersonal) {
                    setHasMorePersonalNotices(false);
                } else {
                    setLastIdPersonal(usrNtcs[usrNtcs.length - 1].$id);
                }
            } catch (error) {
                console.error('Error fetching more personal feed', error);
            } finally {
                setIsLoadingMorePersonal(false);
                setLoadMorePersonal(false);
            }
        };
        if (loadMorePersonal) {
            fetchSubsequentPersonalFeed();
        }
    }, [loadMorePersonal]);

    useEffect(() => {
        console.log('personalFeedNotices:', personalFeedNotices);
    }, [personalFeedNotices])


    // const handleTagSelect = (categoryName, tagIndex, tag, isSelected) => {

    //     console.log('Tag:', tag.key);

    //     setSelectedTags(prevTags => ({
    //         ...prevTags,
    //         [tag.key]: !prevTags[tag.key]
    //     }));

    // };

    //Fetch reactions to feed notices  
    // useEffect(() => {
    //     try {
    //         fetchReactionsForNotices(feedNotices, setNoticesReactions);
    //     } catch (error) {
    //         console.error(error);
    //     }

    // }, [feedNotices])


    const handleSave = async (notice) => {
        try {
            await saveNotice(notice.$id, notice.user_id, user_id);
        } catch (error) {
            console.error('Error creating save entry:', error);
        }
    };


    const handleLike = async (notice) => {
        try {
            await likeNotice(notice.$id, notice.user_id, user_id)
        } catch (error) {
            console.error('Could not like notice');
        }
    }

    const handleReport = async (notice_id, author_id, reason) => {
        try {
            await reportNotice(notice_id, author_id, reason);
            return 'Report success';
        } catch (error) {
            console.error('Could not report notice');
        }
    }

    const handleReact = async (currUserId, content, notice_id, expiresAt) => {
        try {
            await sendReaction(currUserId, content, notice_id, expiresAt);
            console.log('Success handleReact.');
        } catch (error) {
            console.error('Failed handleReact:', error);
        }
    }

    const handleFeedToggle = () => {
        setIsFeedToggled((prev) => !prev);
    };

    const handleRefresh = () => {
        if (isFeedToggled) {
            // Refresh General Feed
            console.log('Refreshing general feed...');
            setGeneralFeedNotices([]);
            setLastId(null);
            setHasMoreGeneralNotices(true);
            setLoadMore(true);
        } else {
            // Refresh Personal Feed
            console.log('Refreshing personal feed...');
            setPersonalFeedNotices([]);
            setLastIdPersonal(null);
            setHasMorePersonalNotices(true);
            setLoadMorePersonal(true);
        }
    };

    // Render loading state while data is being fetched
    if (
        (isLoadingGeneralFeedNotices || isLoadingUsers || isLoadingPersonalFeedNotices) &&
        (personalFeedNotices.length === 0 || generalFeedNotices.length === 0)
    ) {
        return <div className='mt-5'>
            <Loading size={24} />{`Loading ${!isFeedToggled ? 'personal' : 'general'} feed...`}
        </div>;
    }

    return (
        <div style={{ marginTop: '100px' }}>

            <FeedHeader
                isTagSelected={isTagSelected}
                isFeedToggled={isFeedToggled}
                handleFeedToggle={handleFeedToggle}
                handleRefresh={handleRefresh}
            />

            <Notices
                notices={!isFeedToggled ? personalFeedNotices : generalFeedNotices}
                user_id={user_id}
                likedNotices={likedNotices}
                savedNotices={savedNotices}
                // reactions={noticesReactions}
                handleLike={handleLike}
                handleSave={handleSave}
                handleReport={handleReport}
                handleReact={handleReact}
                getReactionsForNotice={getReactionsForNotice}
                getUserAccountByUserId={getUserAccountByUserId}
                getReactionByReactionId={getReactionByReactionId}
                reportReaction={reportReaction}
            />

            {/* Load More Button */}
            <div className="d-flex justify-content-center mt-4">
                {(!isFeedToggled && hasMorePersonalNotices) || (isFeedToggled && hasMoreGeneralNotices) ?
                    <Button
                        onClick={() => {
                            if (!isFeedToggled) {
                                setLoadMorePersonal(true);
                            } else {
                                setLoadMore(true);
                            }
                        }}
                        disabled={(isFeedToggled && (isLoadingMore || !hasMoreGeneralNotices)) ||
                            (!isFeedToggled && (isLoadingMorePersonal || !hasMorePersonalNotices))}
                    >
                        {isLoadingMore || isLoadingMorePersonal ?
                            <><Loading size={24} /> Loading...</>
                            : 'Load More'}
                    </Button>
                    : 'No more notices'}
            </div>
        </div>
    )
}

export default UserFeed