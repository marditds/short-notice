import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNotices } from '../../../lib/hooks/useNotices';
import { useUserInfo } from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl } from '../../../lib/utils/avatarUtils';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Notices } from '../../../components/User/Notices';
import { Button } from 'react-bootstrap';
import { LoadingSpinner } from '../../../components/Loading/LoadingSpinner';
import { FeedBody } from '../../../components/User/Feed/FeedBody/FeedBody';
import { EndAsterisks } from '../../../components/User/EndAsterisks';
import { InterestsTags } from '../../../components/User/Settings/InterestsTags';
import { ComposeNotice } from '../../../components/User/ComposeNotice';

const UserFeed = () => {

    const { accountType, userId, username, isLoggedIn, userEmail } = useOutletContext();

    const {
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
    } = useNotices(userEmail);

    const { fetchUsersData, getUserAccountByUserId, getUsersByIdQuery } = useUserInfo(userEmail);

    const { isLargeScreen } = screenUtils();

    const [noticeText, setNoticeText] = useState('');

    const [generalFeedNotices, setGeneralFeedNotices] = useState([]);
    const [isLoadingGeneralFeedNotices, setIsLoadingGeneralFeedNotices] = useState(false);

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

    // Fetch user interests tags
    useEffect(() => {
        fetchUserInterests();
    }, [userId]);

    // Fetch feed (general)-(initial)
    useEffect(() => {
        const fetchInitialGeneralFeed = async () => {

            try {
                setIsLoadingGeneralFeedNotices(true)
                setIsLoadingMoreInitial(true);
                setIsLoadingMore(true);

                const feedNotices = await getFeedNotices(selectedTags, limit, null);

                console.log('Fetched notices:', feedNotices);

                await fetchUsersData(feedNotices, setGeneralFeedNotices, getAvatarUrl);

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

                await fetchUsersData(notices, setGeneralFeedNotices, getAvatarUrl);

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
            console.log('USER ID IN PERSONAL FEED:', userId);
            console.log('USER LOG IN IN PERSONAL FEED:', isLoggedIn);

            if (!userId || !isLoggedIn) {
                console.log('User not fully logged in. Skipping feed fetch.');
                return;
            }

            try {
                console.log('userId in fetchInitialPersonalFeed()', userId);
                console.log('isLoggedIn in fetchInitialPersonalFeed()', isLoggedIn);


                console.log('STARTING INITIAL PERSONAL FEED.');

                setIsLoadingPersonalFeedNotices(true);
                setIsLoadingMorePersonalInitial(true);

                const allNotices = await getPersonalFeedNotices(limitPersonal, null);

                if (allNotices === undefined || allNotices.length === 0) {
                    setHasMorePersonalNotices(false);
                    return;
                }

                console.log('allNotices', allNotices);

                let usrNtcs = allNotices?.flat();

                console.log('AFTER FLATATION:', usrNtcs);

                await fetchUsersData(usrNtcs, setPersonalFeedNotices, getAvatarUrl);

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
                setIsLoadingMorePersonalInitial(false);
                console.log('ENDING INITIAL PERSONAL FEED.');
            }
        };
        // if (personalFeedNotices.length === 0) {
        //     fetchInitialPersonalFeed();
        // }
        if (personalFeedNotices.length === 0 && userId && isLoggedIn) {
            console.log('Calling fetchInitialPersonalFeed()');
            fetchInitialPersonalFeed();
        }

    }, [userId]);

    // Fetch feed (personal)-(subsequent)
    useEffect(() => {
        if (!loadMorePersonal) return;

        const fetchSubsequentPersonalFeed = async () => {
            try {
                setIsLoadingMorePersonal(true);

                const allNotices = await getPersonalFeedNotices(limitPersonal, lastIdPersonal);

                if (allNotices === undefined || allNotices.length === 0) {
                    return;
                }

                console.log('allNotices', allNotices);

                let usrNtcs = allNotices.flat();

                await fetchUsersData(usrNtcs, setPersonalFeedNotices, getAvatarUrl);

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
        (isLoadingPersonalFeedNotices || isLoadingMorePersonalInitial)
        &&
        (personalFeedNotices.length === 0 || generalFeedNotices.length === 0)
    ) {
        return <div className='pt-5 h-100 user-feed__loading-div' role='status' aria-live='polite'>
            <div>
                <LoadingSpinner /><span className='ms-2'>{`Loading your feed...`}</span>

                <span className='visually-hidden'>Loading your feed</span>
            </div>
        </div>;
    }

    return (
        <div style={{ marginTop: '80px' }} className='w-100'>
            <FeedBody
                personalFeedNotices={personalFeedNotices}
                isAnyTagSelected={isAnyTagSelected}
                isFeedToggled={isFeedToggled}
                isLoadingPersonalFeedNotices={isLoadingPersonalFeedNotices}
                isLoadingMorePersonalInitial={isLoadingMorePersonalInitial}
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
                    <>
                        <LoadingSpinner />
                        <span className='visually-hidden' role='status' aria-live='polite'>
                            Loading interests...
                        </span>
                    </>
                }

                    <p className='mb-3' style={{ marginLeft: '10px' }} id='interest-tags-info'>
                        <i className='bi bi-info-square' aria-hidden='true' /> Ineterest tags are applicable to your general feed only.
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
                            onGeminiRunClick={async (templateSubject) => {
                                console.log('templateSubject - UserFeed.jsx', templateSubject);
                                await onGeminiRunClick(templateSubject, setNoticeText)
                            }}
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
                        user_id={userId}
                        username={username}
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
                        getUsersByIdQuery={getUsersByIdQuery}
                        getReactionByReactionId={getReactionByReactionId}
                        reportReaction={reportReaction}
                    />
                }

                {/* Loading component */}
                {
                    // (isLoadingPersonalFeedNotices || isLoadingGeneralFeedNotices || isFetchingUsersData) &&
                    (isLoadingMorePersonalInitial || isLoadingMoreInitial) &&
                    <div className='h-100 user-feed__loading-div my-5'>
                        <div className='my-5 d-flex justify-content-center'>
                            <LoadingSpinner />
                            <span className='ms-2'>
                                Loading {feedType} feed...
                            </span>
                            <span className='visually-hidden' role='status' aria-live='polite'>
                                Loading {feedType} feed...
                            </span>
                        </div>
                    </div>
                }

                {/* Tag selection message */}
                {
                    !isAnyTagSelected && isFeedToggled ?
                        <div className='h-100 pt-4' role="note" aria-live="polite">
                            <p className='text-center'>
                                {`To view notices in your general feed, you must select at least one interest tag in your ${!isLargeScreen ? 'side menu' : 'settings'}`}.
                            </p>
                        </div>
                        :
                        null
                }

                {/* Load More Button */}
                <div className='d-flex justify-content-center' aria-live="polite" aria-atomic="true">
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
                            aria-label={
                                isLoadingPersonalFeedNotices || isLoadingMore || isLoadingMorePersonal
                                    ? 'Loading more notices'
                                    : 'Load more notices'
                            }
                        >
                            {isLoadingPersonalFeedNotices || isLoadingMore || isLoadingMorePersonal ?
                                <>
                                    <LoadingSpinner size={16} /> Loading...
                                    <span className='visually-hidden' role='status'>
                                        Loading {feedType} feed...
                                    </span>
                                </>
                                : 'Load More'
                            }
                        </Button>
                        :
                        <div className={`${isAnyTagSelected && 'my-4'}`}>
                            {!isFeedToggled && <>{personalFeedNotices.length === 0 ?
                                <p role="alert" className="text-center">
                                    Start following accounts to populate your personal feed!
                                </p>
                                : <EndAsterisks />}
                            </>}

                            {(isFeedToggled && isAnyTagSelected) && <EndAsterisks />}
                        </div>
                    }
                </div>
            </FeedBody>

        </div>
    )
}

export default UserFeed