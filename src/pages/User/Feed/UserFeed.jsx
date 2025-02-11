import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { Notices } from '../../../components/User/Notices';
import { Button } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { FeedHeader } from '../../../components/User/Feed/FeedHeader/FeedHeader';
import { EndAsterisks } from '../../../components/User/EndAsterisks';

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
        personalFeedLikedNotices,
        personalFeedSavedNotices,
        likedNotices,
        savedNotices,
        setLikedNotices,
        setPersonalFeedLikedNotices,
        setPersonalFeedSavedNotices,
        setSavedNotices,
        getInterests,
        getPersonalFeedNotices,
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

                const allNotices = await getPersonalFeedNotices(limitPersonal, null);

                console.log('allNotices', allNotices);

                let usrNtcs = allNotices.flat();

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

                const allNotices = await getPersonalFeedNotices(limitPersonal, lastIdPersonal);

                console.log('allNotices', allNotices);

                let usrNtcs = allNotices.flat();

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
                        likedNotices={!isFeedToggled ? personalFeedLikedNotices : likedNotices}
                        savedNotices={!isFeedToggled ? personalFeedSavedNotices : savedNotices}
                        handleLike={handleLike}
                        setLikedNotices={!isFeedToggled ? setPersonalFeedLikedNotices : setLikedNotices}
                        handleSave={handleSave}
                        setSavedNotices={!isFeedToggled ? setPersonalFeedSavedNotices : setSavedNotices}
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