import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { Notices } from '../../../components/User/Notices';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { FaCircleExclamation } from "react-icons/fa6";

const UserFeed = () => {

    const [usersData, setUsersData] = useState([]);

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
        noticesReactions,
        getInterests,
        getFeedNotices,
        spreadNotice,
        reportNotice,
        likeNotice,
        sendReaction,
        likedNotices,
        spreadNotices,
        getReactionsForNotice
        // fetchReactionsForNotices,
        // setNoticesReactions
    } = useNotices(googleUserData);

    const { fetchUsersData, getBlockedUsersByUser } = useUserInfo(googleUserData);

    const [feedNotices, setFeedNotices] = useState([]);

    const [isLoadingNotices, setIsLoadingNotices] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [hasMoreNotices, setHasMoreNotices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

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
                    // if (error.code === 404) {
                    //     const newSelectedTags = {};
                    //     tagCategories.forEach(category => {
                    //         category.tags.forEach(tag => {
                    //             newSelectedTags[tag.key] = false;
                    //         });
                    //     });
                    //     setSelectedTags(newSelectedTags);
                    // }
                }
            }
        };

        fetchUserInterests();
    }, [user_id, tagCategories]);


    // Fetch User's feed  
    useEffect(() => {
        const fetchFeedData = async () => {

            setIsLoadingNotices(true);
            setIsLoadingUsers(true);
            setIsLoadingMore(true);
            try {
                let falseVal = Object.values(selectedTags).filter((tag) => tag === false);
                // console.log('trueVal', trueVal.indexOf(false, 0));
                // console.log('these are selectedTags:', Object.values(selectedTags));

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
                console.log('indices', indices.length);

                if (indices.length < 13) {
                    setIsTagSelected(true);
                } else {
                    setIsTagSelected(false);
                }

                console.log('limit:', limit);
                console.log('offset:', offset);
                const notices = await getFeedNotices(selectedTags, limit, offset);

                const blockedUsers = await getBlockedUsersByUser(user_id);

                console.log('blockedUsers', blockedUsers);

                const filtering = notices.filter((notice) =>
                    !blockedUsers.some((user) => notice.user_id === user.blocked_id)
                );

                console.log('filtering', filtering);


                const filteredNotices = filtering || [];

                await fetchUsersData(filteredNotices, setFeedNotices, avatarUtil);

                if (filteredNotices.length < limit) {
                    setHasMoreNotices(false);
                } else {
                    setHasMoreNotices(true);
                }

            } catch (error) {
                console.error('Error fetching feed notices:', error);
            } finally {
                setIsLoadingNotices(false);
                setIsLoadingUsers(false);
                setIsLoadingMore(false);
            }

        };
        fetchFeedData();
    }, [selectedTags, offset]);


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


    const handleSpread = async (notice) => {
        try {
            await spreadNotice(notice.$id, notice.user_id, user_id);
        } catch (error) {
            console.error('Error creating spread entry:', error);
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

    const handleReact = async (currUserId, content, notice_id) => {
        try {
            await sendReaction(currUserId, content, notice_id);
            console.log('Success handleReact.');
        } catch (error) {
            console.error('Failed handleReact:', error);
        }
    }


    // Render loading state while data is being fetched
    if ((isLoadingNotices || isLoadingUsers) && feedNotices.length === 0) {
        return <div><Loading size={24} />Loading feed...</div>;
    }

    return (
        <div>


            <h2 style={{ marginTop: '30px' }}>

                {!isTagSelected ?
                    <span>
                        <FaCircleExclamation /> To view notices in your feed, set your interests in your profile <a href='../user/settings'>settings</a>.
                    </span>
                    :
                    <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip>{'Update you interests in your profile settings.'}</Tooltip>}>
                        <Button>
                            <FaCircleExclamation />
                        </Button>
                    </OverlayTrigger>
                }
            </h2>


            <Notices
                notices={feedNotices}
                user_id={user_id}
                likedNotices={likedNotices}
                spreadNotices={spreadNotices}
                // reactions={noticesReactions}
                handleLike={handleLike}
                handleSpread={handleSpread}
                handleReport={handleReport}
                handleReact={handleReact}
                getReactionsForNotice={getReactionsForNotice}
            />

            {/* Load More Button */}
            <div className="d-flex justify-content-center mt-4">

                <div className="d-flex justify-content-center mt-4">
                    {hasMoreNotices ?
                        <Button
                            onClick={() => setOffset(offset + limit)}
                            disabled={isLoadingMore || !hasMoreNotices} // Disable if already loading or no more notices
                        >
                            {isLoadingMore ?
                                <><Loading size={24} /> Loading...</>
                                : 'Load More'}
                        </Button>
                        : 'No more notices'}
                </div>

            </div>

        </div>
    )
}

export default UserFeed