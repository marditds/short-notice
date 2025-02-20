import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Notices } from '../../../components/User/Notices';
import { Button } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { FeedHeader } from '../../../components/User/Feed/FeedHeader/FeedHeader';
import { EndAsterisks } from '../../../components/User/EndAsterisks';
import { InterestsTags } from '../../../components/User/Settings/InterestsTags';

const UserFeed = () => {

    const { googleUserData } = useUserContext();

    const {
        user_id,
        personalFeedLikedNotices,
        personalFeedSavedNotices,
        likedNotices,
        savedNotices,
        isInterestsLoading,
        tagCategories,
        isInterestsUpdating,
        selectedTags,
        isAnyTagSelected,
        setIsAnyTagSelected,
        setSelectedTags,
        toggleInterestsTag,
        deselectAllInterestTags,
        updateInterests,
        setLikedNotices,
        fetchUserInterests,
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
        onGemeniRun
    } = useNotices(googleUserData);

    const { fetchUsersData, getUserAccountByUserId } = useUserInfo(googleUserData);

    const { isLargeScreen, isExtraLargeScreen } = screenUtils();

    const [geminiRes, setGeminiRes] = useState('');


    // const [selectedTags, setSelectedTags] = useState({});
    const [isTagSelected, setIsTagSelected] = useState(false);
    // const [isAnyTagSelected, setIsAnyTagSelected] = useState(false);

    const [generalFeedNotices, setGeneralFeedNotices] = useState([]);
    const [isLoadingGeneralFeedNotices, setIsLoadingGeneralFeedNotices] = useState(false);

    const [personalFeedNotices, setPersonalFeedNotices] = useState([]);
    const [isLoadingPersonalFeedNotices, setIsLoadingPersonalFeedNotices] = useState(true);

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

    useEffect(() => {
        console.log('isFeedToggled STATUS:', isFeedToggled);

    }, [isFeedToggled])

    // Fetch User's interests  
    useEffect(() => {
        const fetchUserInterests = async () => {
            if (user_id) {
                try {
                    const userInterests = await getInterests(user_id);

                    console.log('DRAMATIC:', userInterests);

                    setIsAnyTagSelected(Object.values(userInterests).some(tagKey => tagKey === true));

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

    // Fetch user interests tags from DB
    useEffect(() => {
        fetchUserInterests();
    }, [user_id, tagCategories]);


    // Fetch selected tags for UI
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

    useEffect(() => {
        console.log('isAnyTagSelected', isAnyTagSelected);
    }, [isAnyTagSelected])

    // Fetch feed (general)-(initial)
    useEffect(() => {
        const fetchInitialGeneralFeed = async () => {

            try {
                setIsLoadingGeneralFeedNotices(true)
                setIsLoadingMoreInitial(true);
                setIsLoadingMore(true);

                console.log('Limit:', limit);
                console.log('Last ID:', lastId);

                const abc = Object.values(selectedTags).some(tagKey => tagKey === true);

                console.log('RRRRRRRRRRRRRR:', abc);

                const feedNotices = await getFeedNotices(selectedTags, limit, null);

                console.log('Fetched notices:', feedNotices);

                await fetchUsersData(feedNotices, setGeneralFeedNotices, avatarUtil);

                if (feedNotices.length < limit) {
                    setHasMoreGeneralNotices(false);
                } else {
                    setHasMoreGeneralNotices(true);
                    setLastId(feedNotices[feedNotices.length - 1]?.$id);
                }

            } catch (error) {
                console.error('Error fetching initial feed notices:', error);
            } finally {
                setIsLoadingGeneralFeedNotices(false)
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
                // setIsLoadingMorePersonal(true);

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
                // setIsLoadingMorePersonal(false);
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
        // console.log('STATUS isAnyTagSelected 1', isAnyTagSelected); 
        if (isAnyTagSelected === true) {
            // console.log('STATUS isAnyTagSelected 2', isAnyTagSelected);
            setIsFeedToggled((prev) => !prev);
        } else {
            // console.log('STATUS isAnyTagSelected 3', isAnyTagSelected);
            setIsFeedToggled(false);
            setGeneralFeedNotices([]);
        }
    };

    // useEffect(() => {
    //     handleFeedToggle();
    // }, [isAnyTagSelected === false])

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

    const onGemeniRunClick = () => {
        const geminiResult = onGemeniRun();

        geminiResult.then(res => setGeminiRes(res));

        // setGeminiRes(geminiResult);
    };

    // Render loading state while data is being fetched
    // if (
    // (isLoadingPersonalFeedNotices)
    // &&
    // (personalFeedNotices.length === 0 || generalFeedNotices.length === 0)
    // ) {
    //     return <div className='pt-5 h-100 user-feed__loading-div'>
    //         <div>
    //             <Loading /><span className='ms-2'>{`Loading your feed...`}</span>
    //         </div>
    //     </div>;
    // }

    return (
        <div style={{ marginTop: '100px' }} className='position-relative w-100'>
            <FeedHeader
                isTagSelected={isTagSelected}
                isAnyTagSelected={isAnyTagSelected}
                isFeedToggled={isFeedToggled}
                handleFeedToggle={handleFeedToggle}
                handleRefresh={handleRefresh}
            />

            <div className='w-100 d-flex'>

                {/* Feed tag selection */}
                <div className='position-relative d-xl-block d-none'>
                    <Row className='flex-column position-fixed w-25'>
                        {
                            !isInterestsLoading
                                ?
                                <InterestsTags
                                    tagCategories={tagCategories}
                                    selectedTags={selectedTags}
                                    isInterestsUpdating={isInterestsUpdating}
                                    isAnyTagSelected={isAnyTagSelected}
                                    toggleInterestsTag={toggleInterestsTag}
                                    updateInterests={updateInterests}
                                    // setIsAnyTagSelected={setIsAnyTagSelected}
                                    // handleFeedToggle={handleFeedToggle}
                                    handleRefresh={handleRefresh}
                                    deselectAllInterestTags={deselectAllInterestTags}
                                />
                                :
                                <Loading />
                        }
                        {/* <Col> */}
                        <p className='mb-0' style={{ marginLeft: '10px' }}>
                            <i className='bi bi-info-square' /> Ineterest tags are applicable to your general feed only.
                        </p>
                        {/* </Col> */}
                        <Col>
                            <p>
                                <Button onClick={onGemeniRunClick}>Generate Result</Button> <br />
                                {
                                    geminiRes
                                }
                            </p>
                        </Col>
                    </Row>
                </div>

                <div className={`${!isLargeScreen ? 'w-75' : 'w-100'} ms-auto`}>
                    {/* Feed notices */}
                    {
                        (!isLoadingPersonalFeedNotices || !isLoadingGeneralFeedNotices) &&
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
                    }

                    {/* Loading component */}
                    {
                        (isLoadingPersonalFeedNotices || isLoadingGeneralFeedNotices) &&
                        <div className='h-100 user-feed__loading-div my-5'>
                            <div className='my-5'>
                                <Loading />
                                <span className='ms-2'>
                                    Loading {feedType} feed...
                                </span>
                            </div>
                        </div>
                    }

                    {/* Tag selection message */}
                    {
                        !isAnyTagSelected && isFeedToggled ?
                            <div className='h-100'>
                                <p className='text-center'>
                                    {`To view notices in your general feed, you must select at least one interest tag in your ${isExtraLargeScreen ? 'side menu' : 'settings'}`}.
                                </p>
                            </div>
                            :
                            null
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
                                disabled={(isLoadingMore || isLoadingMorePersonal) ? true : false}
                                className={` my-4 notices__load-more-notices-btn ${(isLoadingMoreInitial || isLoadingMorePersonalInitial) ? 'd-none' : 'd-block'}`}
                            >
                                {isLoadingMore || isLoadingMorePersonal ?
                                    <><Loading size={16} /> Loading...</>
                                    : 'Load More'}
                            </Button>
                            :
                            <div className='my-4'>
                                {!isFeedToggled && <EndAsterisks />}
                                {(isFeedToggled && isAnyTagSelected) && <EndAsterisks />}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserFeed