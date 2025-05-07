import React from 'react';
import { Tab, Button } from 'react-bootstrap';
import { Notices } from './Notices';
import { NoticesPlaceholder } from './NoticesPlaceholder';
import { LoadingSpinner } from '../Loading/LoadingSpinner';
import { EndAsterisks } from './EndAsterisks';

export const NoticeTab = ({
    isOwnProfile,
    section,
    eventKey,
    title,
    noticesData,
    isLoading,
    hasMore,
    isLoadingMore,
    offset,
    limit,
    setOffset,
    username,
    otherUsername,
    userId,
    location,
    placeholderIcon,
    loadingTextOwn,
    loadingTextOther,
    likedNotices,
    savedNotices,
    handleLike,
    handleSave,
    setLikedNotices,
    setSavedNotices,
    handleReportNotice,
    handleReact,
    getReactionsForNotice,
    getUserAccountByUserId,
    getUsersByIdQuery,
    getReactionByReactionId,
    reportReaction
}) => {
    const displayName = isOwnProfile ? username : otherUsername;
    const loadingText = isOwnProfile ? loadingTextOwn : `${loadingTextOther} ${otherUsername}'s ${section}...`;
    const loadMoreClass = isOwnProfile
        ? 'notices__load-more-notices-btn'
        : 'user-profile__load-more-notices-btn';
    const spacingClass = isOwnProfile
        ? 'd-flex justify-content-center mt-4 pb-5'
        : 'd-flex justify-content-center pt-4 pb-5';
    const loadingContainerClass = isOwnProfile
        ? 'd-flex justify-content-center'
        : 'd-flex justify-content-center pt-5';

    return (
        <Tab eventKey={eventKey} title={title}>
            {!isLoading ? (
                noticesData.length !== 0 ? (
                    <>
                        <Notices
                            notices={noticesData}
                            user_id={userId}
                            eventKey={eventKey}
                            likedNotices={likedNotices}
                            savedNotices={savedNotices}
                            handleLike={handleLike}
                            handleSave={handleSave}
                            setLikedNotices={setLikedNotices}
                            setSavedNotices={setSavedNotices}
                            handleReportNotice={handleReportNotice}
                            handleReact={handleReact}
                            getReactionsForNotice={getReactionsForNotice}
                            getUserAccountByUserId={getUserAccountByUserId}
                            getUsersByIdQuery={getUsersByIdQuery}
                            getReactionByReactionId={getReactionByReactionId}
                            reportReaction={reportReaction}
                            {...(isOwnProfile && { username })}
                        />
                        <div className={spacingClass}>
                            {hasMore ? (
                                <Button
                                    onClick={() => setOffset(offset + limit)}
                                    disabled={isLoadingMore || !hasMore}
                                    className={loadMoreClass}
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <LoadingSpinner size={24} /> Loading...
                                        </>
                                    ) : (
                                        'Load More'
                                    )}
                                </Button>
                            ) : (
                                <EndAsterisks componentName='notices' />
                            )}
                        </div>
                    </>
                ) : (
                    <NoticesPlaceholder
                        location={location}
                        section={section}
                        icon={placeholderIcon}
                        {...(!isOwnProfile && { otherUsername })}
                    />
                )
            ) : (
                <div className={loadingContainerClass}>
                    <LoadingSpinner />
                    <span className='ms-2'>{loadingText}</span>
                </div>
            )}
        </Tab>
    );
};
