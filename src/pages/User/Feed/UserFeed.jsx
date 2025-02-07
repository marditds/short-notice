import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { Notices } from '../../../components/User/Notices';
import { useUnblockedNotices } from '../../../lib/utils/blockFilter';
// import { deleteExpired } from '../../../lib/utils/deleteExpired';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Button } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { FeedHeader } from '../../../components/User/Feed/FeedHeader/FeedHeader';
import { EndAsterisks } from '../../../components/User/EndAsterisks';

const UserFeed = () => {

    const { isSmallScreen, isMediumScreen } = screenUtils();

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
        handleSave,
        handleReportNotice,
        handleLike,
        handleReact,
        getReactionsForNotice,
        getReactionByReactionId,
        reportReaction,
        getNoticesByUser,
        // removeNotice,
        // deleteExpiredNotice,
        // noticesReactions, 
        // fetchReactionsForNotices,
        // setNoticesReactions
    } = useNotices(googleUserData);

    const { fetchUsersData, getUserAccountByUserId, getPersonalFeedAccounts } = useUserInfo(googleUserData);
    const { filterBlocksFromFeed } = useUnblockedNotices();

    const [generalFeedNotices, setGeneralFeedNotices] = useState([]);
    const [personalFeedNotices, setPersonalFeedNotices] = useState([]);
    const [isLoadingPersonalFeedNotices, setIsLoadingPersonalFeedNotices] = useState(false);

    const [isFeedToggled, setIsFeedToggled] = useState(false);

    // General Feed
    const [limit] = useState(10);
    const [lastId, setLastId] = useState(null);
    const [hasMoreGeneralNotices, setHasMoreGeneralNotices] = useState(true);
    const [isLoadingMoreInitial, setIsLoadingMoreInitial] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadMore, setLoadMore] = useState(false);

    // Personal Feed
    const [limitPersonal] = useState(10);
    const [lastIdPersonal, setLastIdPersonal] = useState(null);
    const [hasMorePersonalNotices, setHasMorePersonalNotices] = useState(true);
    const [isLoadingMorePersonal, setIsLoadingMorePersonal] = useState(false);
    const [isLoadingMorePersonalInitial, setIsLoadingMorePersonalInitial] = useState(false);
    const [loadMorePersonal, setLoadMorePersonal] = useState(false);


    const notices = !isFeedToggled ? personalFeedNotices : generalFeedNotices;
    const feedType = !isFeedToggled ? 'personal' : 'general';

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
            try {
                setIsLoadingMoreInitial(true);
                setIsLoadingMore(true);

                console.log('Limit:', limit);
                console.log('Last ID:', lastId);

                const notices = await getFeedNotices(selectedTags, limit, null);

                console.log('Fetched notices:', notices);

                // const filteredNotices = await filterBlocksFromFeed(notices, user_id);
                // console.log('Filtered notices - general:', filteredNotices);

                // const unExpiredNotices = await deleteExpiredNotice(filteredNotices);

                // console.log('unExpiredNotices', unExpiredNotices);

                await fetchUsersData(notices, setGeneralFeedNotices, avatarUtil);

                if (notices.length < limit) {
                    setHasMoreGeneralNotices(false);
                } else {
                    setHasMoreGeneralNotices(true);
                    setLastId(notices[notices.length - 1]?.$id);
                }

            } catch (error) {
                console.error('Error fetching initial feed notices:', error);
            } finally {
                setIsLoadingMore(false);
                setIsLoadingMoreInitial(false);
            }
        };

        // const fetchInitialGeneralFeed = async () => {
        //     const fetchBatchRecursively = async (currentLastId = null, accumulator = []) => {
        //         try {
        //             setIsLoadingMoreInitial(true);
        //             setIsLoadingMore(true);

        //             console.log('Fetching batch with Limit:', limit, 'Last ID:', currentLastId);

        //             const notices = await getFeedNotices(selectedTags, limit, currentLastId);
        //             console.log('Fetched notices:', notices);

        //             if (notices.length === 0) {
        //                 // No more notices to fetch
        //                 setHasMoreGeneralNotices(false);
        //                 return accumulator;
        //             }

        //             const filteredNotices = await filterBlocksFromFeed(notices, user_id);
        //             console.log('Filtered notices - general:', filteredNotices);

        //             if (filteredNotices.length === 0 && notices.length === limit) {
        //                 // All notices were filtered out, but there might be more
        //                 // Recursively fetch the next batch
        //                 const nextLastId = notices[notices.length - 1].$id;
        //                 return fetchBatchRecursively(nextLastId, accumulator);
        //             }

        //             // Combine with previously accumulated notices
        //             const combinedNotices = [...accumulator, ...filteredNotices];

        //             // If we don't have enough notices yet and there might be more
        //             if (combinedNotices.length < limit && notices.length === limit) {
        //                 const nextLastId = notices[notices.length - 1].$id;
        //                 return fetchBatchRecursively(nextLastId, combinedNotices);
        //             }

        //             // We have enough notices or reached the end
        //             setHasMoreGeneralNotices(notices.length === limit);
        //             return combinedNotices;
        //         } catch (error) {
        //             console.error('Error in recursive fetch:', error);
        //             return accumulator;
        //         }
        //     };

        //     try {
        //         const finalNotices = await fetchBatchRecursively();

        //         if (finalNotices.length > 0) {
        //             await fetchUsersData(finalNotices, setGeneralFeedNotices, avatarUtil);
        //             setLastId(finalNotices[finalNotices.length - 1]?.$id);
        //         }
        //     } catch (error) {
        //         console.error('Error fetching initial feed notices:', error);
        //     } finally {
        //         setIsLoadingMore(false);
        //         setIsLoadingMoreInitial(false);
        //     }
        // };

        if (isFeedToggled && generalFeedNotices.length === 0) {
            fetchInitialGeneralFeed();
        }
    }, [isFeedToggled]);

    // Fetch feed (general)-(subsequent) 
    useEffect(() => {
        if (!loadMore) return;
        const fetchSubsequentGeneralFeed = async () => {
            try {
                setIsLoadingMore(true);

                console.log('Limit:', limit);
                console.log('Last ID:', lastId);

                const notices = await getFeedNotices(selectedTags, limit, lastId);
                console.log('Fetched notices:', notices);

                // const filteredNotices = await filterBlocksFromFeed(notices, user_id);
                // console.log('Filtered notices - general:', filteredNotices);

                // const unExpiredNotices = await deleteExpiredNotice(filteredNotices);

                // console.log('unExpiredNotices', unExpiredNotices);

                await fetchUsersData(notices, setGeneralFeedNotices, avatarUtil);

                if (notices.length < limit) {
                    setHasMoreGeneralNotices(false);
                } else {
                    setLastId(notices[notices.length - 1]?.$id);
                }
            } catch (error) {
                console.error('Error loading more notices:', error);
            } finally {
                setIsLoadingMore(false);
                setLoadMore(false);
            }
        };

        // const fetchSubsequentGeneralFeed = async () => {
        //     const fetchBatchRecursively = async (currentLastId, accumulator = []) => {
        //         try {
        //             console.log('Limit:', limit);
        //             console.log('Last ID:', currentLastId);

        //             const notices = await getFeedNotices(selectedTags, limit, currentLastId);
        //             console.log('Fetched notices:', notices);

        //             if (notices.length === 0) {
        //                 setHasMoreGeneralNotices(false);
        //                 return accumulator;
        //             }

        //             const filteredNotices = await filterBlocksFromFeed(notices, user_id);
        //             console.log('Filtered notices - general:', filteredNotices);

        //             if (filteredNotices.length === 0 && notices.length === limit) {
        //                 // All notices were filtered out, but there might be more
        //                 // Recursively fetch the next batch
        //                 const nextLastId = notices[notices.length - 1].$id;
        //                 return fetchBatchRecursively(nextLastId, accumulator);
        //             }

        //             // Combine with previously accumulated notices
        //             const combinedNotices = [...accumulator, ...filteredNotices];

        //             // If we haven't gotten enough notices yet and there might be more
        //             if (combinedNotices.length < limit && notices.length === limit) {
        //                 const nextLastId = notices[notices.length - 1].$id;
        //                 return fetchBatchRecursively(nextLastId, combinedNotices);
        //             }

        //             setHasMoreGeneralNotices(notices.length === limit);
        //             return combinedNotices;
        //         } catch (error) {
        //             console.error('Error in recursive fetch:', error);
        //             return accumulator;
        //         }
        //     };

        //     try {
        //         setIsLoadingMore(true);

        //         const finalNotices = await fetchBatchRecursively(lastId);

        //         if (finalNotices.length > 0) {
        //             await fetchUsersData(finalNotices, setGeneralFeedNotices, avatarUtil);
        //             setLastId(finalNotices[finalNotices.length - 1]?.$id);
        //         }
        //     } catch (error) {
        //         console.error('Error loading more notices:', error);
        //     } finally {
        //         setIsLoadingMore(false);
        //         setLoadMore(false);
        //     }
        // };

        if (isFeedToggled && loadMore) {
            fetchSubsequentGeneralFeed();
        }
    }, [loadMore, lastId, isFeedToggled]);

    // Fetch feed (personal)-(initial)
    useEffect(() => {
        const fetchInitialPersonalFeed = async () => {
            try {
                setIsLoadingMorePersonalInitial(true);
                setIsLoadingPersonalFeedNotices(true);
                setIsLoadingMorePersonal(true);

                const followedByUser = await getPersonalFeedAccounts(user_id);
                console.log('followedByUser', followedByUser);

                const followedUserIds = followedByUser.map((user) => user.$id);

                console.log('followedUserIds', followedUserIds);

                const allNotices = await getNoticesByUser(followedUserIds, limitPersonal, null);

                console.log('allNotices', allNotices);

                let usrNtcs = allNotices.flat();

                console.log('notices BEFORE filtering:', usrNtcs);

                // const filteredNotices = await filterBlocksFromFeed(usrNtcs, user_id);

                // console.log('Filtered notices - personal:', filteredNotices);

                // filteredNotices.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                // console.log('filteredNotices - Personal', filteredNotices);

                // const unExpiredNotices = await deleteExpiredNotice(filteredNotices);

                // console.log('unExpiredNotices', unExpiredNotices);

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
                setIsLoadingMorePersonal(false);
                setIsLoadingMorePersonalInitial(false);
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

                const followedByUser = await getPersonalFeedAccounts(user_id);

                const followedUserIds = followedByUser.map((user) => user.$id);

                console.log('followedUserIds', followedUserIds);

                const allNotices = await getNoticesByUser(followedUserIds, limitPersonal, lastIdPersonal);

                console.log('allNotices', allNotices);

                let usrNtcs = allNotices.flat();

                // const filteredNotices = await filterBlocksFromFeed(usrNtcs, user_id);

                // console.log('Filtered notices - personal:', filteredNotices);

                // const unExpiredNotices = await deleteExpiredNotice(filteredNotices);

                // console.log('unExpiredNotices', unExpiredNotices);

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

    const handleFeedToggle = () => {
        setIsFeedToggled((prev) => !prev);
    };

    const handleRefresh = () => {
        if (isFeedToggled) {
            // Refresh General Feed
            setGeneralFeedNotices([]);
            setLastId(null);
            setHasMoreGeneralNotices(true);
            setLoadMore(true);
        } else {
            // Refresh Personal Feed 
            setPersonalFeedNotices([]);
            setLastIdPersonal(null);
            setHasMorePersonalNotices(true);
            setLoadMorePersonal(true);
        }
    };

    // Render loading state while data is being fetched
    if (
        (isLoadingPersonalFeedNotices)
        // &&
        // (personalFeedNotices.length === 0 || generalFeedNotices.length === 0)
    ) {
        return <div className='pt-5 h-100 user-feed__loading-div'>
            <div>
                <Loading /><span className='ms-2'>{`Loading your feed...`}</span>
            </div>
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
            {
                notices.length !== 0 ?
                    <Notices
                        notices={notices}
                        user_id={user_id}
                        likedNotices={likedNotices}
                        savedNotices={savedNotices}
                        handleLike={handleLike}
                        handleSave={handleSave}
                        handleReportNotice={handleReportNotice}
                        handleReact={handleReact}
                        getReactionsForNotice={getReactionsForNotice}
                        getUserAccountByUserId={getUserAccountByUserId}
                        getReactionByReactionId={getReactionByReactionId}
                        reportReaction={reportReaction}
                    />
                    :
                    <div className='h-100 user-feed__loading-div my-5'>
                        <div className='my-5'>
                            <Loading />
                            <span className='ms-2'>
                                Loading {feedType} feed...
                            </span>
                        </div>
                    </div>
            }

            {/* Load More Button */}
            <div className="d-flex justify-content-center">
                {(!isFeedToggled && hasMorePersonalNotices) || (isFeedToggled && hasMoreGeneralNotices) ?
                    <Button
                        onClick={() => {
                            if (!isFeedToggled) {
                                setLoadMorePersonal(true);
                            } else {
                                setLoadMore(true);
                            }
                        }}
                        // disabled={(isFeedToggled && (isLoadingMore || !hasMoreGeneralNotices)) ||
                        //     (!isFeedToggled && (isLoadingMorePersonal || !hasMorePersonalNotices)) || isLoadingPersonalFeedNotices}
                        disabled={(isLoadingPersonalFeedNotices || isLoadingMore || isLoadingMorePersonal) ? true : false}
                        className={` my-4 notices__load-more-notices-btn ${(isLoadingMoreInitial || isLoadingMorePersonalInitial) ? 'd-none' : 'd-block'}`}
                    >
                        {isLoadingMore || isLoadingMorePersonal ?
                            <><Loading size={16} /> Loading...</>
                            : 'Load More'}
                    </Button>
                    :
                    <div className='my-4'>
                        <EndAsterisks />
                    </div>
                }
            </div>
        </div>
    )
}

export default UserFeed