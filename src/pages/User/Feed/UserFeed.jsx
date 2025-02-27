import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Notices } from '../../../components/User/Notices';
import { Button } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { FeedBody } from '../../../components/User/Feed/FeedBody/FeedBody';
import { EndAsterisks } from '../../../components/User/EndAsterisks';
import { InterestsTags } from '../../../components/User/Settings/InterestsTags';
import { ComposeNotice } from '../../../components/User/ComposeNotice';

const UserFeed = () => {

    const { googleUserData, accountType } = useUserContext();

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
        isAddingNotice,
        fetchedInterests,
        isGeminiLoading,
        onGeminiRunClick,
        setLastThreeNoticesInFeed,
        toggleInterestsTag,
        deselectAllInterestTags,
        updateInterests,
        setLikedNotices,
        fetchUserInterests,
        setPersonalFeedLikedNotices,
        setPersonalFeedSavedNotices,
        setSavedNotices,
        getPersonalFeedNotices,
        getFeedNotices,
        handleSave,
        handleReportNotice,
        handleLike,
        handleReact,
        getReactionsForNotice,
        getReactionByReactionId,
        reportReaction,
        addNotice,
    } = useNotices(googleUserData);

    const { fetchUsersData, getUserAccountByUserId } = useUserInfo(googleUserData);

    const { isLargeScreen } = screenUtils();

    const [noticeText, setNoticeText] = useState('');

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

    // Fetch user interests tags
    useEffect(() => {
        fetchUserInterests();
    }, [user_id]);

    useEffect(() => {
        console.log('isFeedToggled STATUS:', isFeedToggled);
    }, [isFeedToggled])

    useEffect(() => {
        console.log('fetchedInterests:', fetchedInterests);
    }, [fetchedInterests])

    useEffect(() => {
        console.log('isAnyTagSelected', isAnyTagSelected);
    }, [isAnyTagSelected])

    useEffect(() => {
        console.log("FeedBody detected interest changes:", selectedTags);
    }, [selectedTags]);

    // Fetch feed (general)-(initial)
    useEffect(() => {
        const fetchInitialGeneralFeed = async () => {

            console.log('Selected Tags in fetchInitialGeneralFeed', selectedTags);

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

    const handleFeedToggle = () => {
        if (isAnyTagSelected === true) {
            setIsFeedToggled((prev) => !prev);
        } else {
            setIsFeedToggled(false);
            setGeneralFeedNotices([]);
        }
    };

    const handleRefresh = () => {
        if (isFeedToggled) {
            // Refresh General Feed
            setGeneralFeedNotices([]);
            setLastThreeNoticesInFeed([]);
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
        <div style={{ marginTop: '80px' }} className='w-100'>
            <FeedBody
                isAnyTagSelected={isAnyTagSelected}
                isFeedToggled={isFeedToggled}
                handleFeedToggle={handleFeedToggle}
                handleRefresh={handleRefresh}
                sideContent={<> {!isInterestsLoading
                    ?
                    <InterestsTags
                        tagCategories={tagCategories}
                        selectedTags={selectedTags}
                        isInterestsUpdating={isInterestsUpdating}
                        isAnyTagSelected={isAnyTagSelected}
                        toggleInterestsTag={toggleInterestsTag}
                        updateInterests={updateInterests}
                        onUpdateInterests={handleRefresh}
                        deselectAllInterestTags={deselectAllInterestTags}
                    />
                    :
                    <Loading />
                }

                    <p className='mb-3' style={{ marginLeft: '10px' }}>
                        <i className='bi bi-info-square' /> Ineterest tags are applicable to your general feed only.
                    </p>
                    <hr className='mt-0' />
                    <div style={{ marginInline: '10px' }}>
                        <ComposeNotice
                            noticeText={noticeText}
                            noticeType={accountType}
                            isGeminiLoading={isGeminiLoading}
                            isAddingNotice={isAddingNotice}
                            setNoticeText={setNoticeText}
                            addNotice={addNotice}
                            onGemeniRunClick={async () => await onGeminiRunClick(setNoticeText)}
                        />
                    </div>
                </>
                }
            >

                {/* Feed notices */}
                {
                    (!isLoadingPersonalFeedNotices || !isLoadingGeneralFeedNotices)
                    &&
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
                                {`To view notices in your general feed, you must select at least one interest tag in your ${!isLargeScreen ? 'side menu' : 'navigation bar' + <i className='bi bi-tag d-flex justify-content-center align-items-center' /> + ' or settings'}`}.
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
                            className={`my-4 notices__load-more-notices-btn ${(isLoadingMoreInitial || isLoadingMorePersonalInitial) ? 'd-none' : 'd-block'}`}
                        >
                            {isLoadingMore || isLoadingMorePersonal ?
                                <><Loading size={16} /> Loading...</>
                                : 'Load More'}
                        </Button>
                        :
                        <div className={`${isAnyTagSelected && 'my-4'}`}>
                            {!isFeedToggled && <EndAsterisks />}
                            {(isFeedToggled && isAnyTagSelected) && <EndAsterisks />}
                        </div>
                    }
                </div>
            </FeedBody>

        </div>
    )
}

export default UserFeed