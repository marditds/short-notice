import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { NoticeTags } from '../../../components/User/NoticeTags';
import { Notices } from '../../../components/User/Notices';
import { Button } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';

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
    const { googleUserData, username } = useUserContext();

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
        setNoticesReactions,
        fetchReactionsForNotices
    } = useNotices(googleUserData);

    const { fetchUsersData } = useUserInfo(googleUserData);

    const [feedNotices, setFeedNotices] = useState([]);

    const [isLoadingNotices, setIsLoadingNotices] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const [limit] = useState(10); // Number of notices per page
    const [offset, setOffset] = useState(0); // For pagination
    const [hasMore, setHasMore] = useState(true); // To track if more notices are available

    // User's interets (tags)
    useEffect(() => {
        const fetchUserInterests = async () => {
            if (user_id) {
                try {
                    const userInterests = await getInterests(user_id);

                    // console.log('these are user interests:', userInterests);

                    if (userInterests) {
                        const newSelectedTags = {};
                        tagCategories.forEach(category => {
                            category.tags.forEach(tag => {
                                newSelectedTags[tag.key] = userInterests[tag.key] || false;
                            });
                        });
                        setSelectedTags(newSelectedTags);
                    }
                } catch (error) {
                    console.error('Error fetching user interests:', error);
                    if (error.code === 404) {
                        const newSelectedTags = {};
                        tagCategories.forEach(category => {
                            category.tags.forEach(tag => {
                                newSelectedTags[tag.key] = false;
                            });
                        });
                        setSelectedTags(newSelectedTags);
                    }
                }
            }
        };

        fetchUserInterests();
    }, [user_id, tagCategories]);


    // User's interests
    useEffect(() => {

        const fetchFeedData = async () => {

            setIsLoadingNotices(true);
            setIsLoadingUsers(true);

            try {

                // console.log('Selected Tags:', selectedTags);

                const filteredNotices = await getFeedNotices(selectedTags, limit, offset);

                console.log('Filtered notices length:', filteredNotices.length);
                console.log('Filtered notices:', filteredNotices);

                // Check if there are more notices to load
                if (filteredNotices.length < limit) {
                    setHasMore(false);
                }
                // Append new notices to the current feed
                setFeedNotices(filteredNotices);

                // setFeedNotices(filteredNotices);


                await fetchUsersData(filteredNotices, setFeedNotices, avatarUtil);

                // console.log('likedNotices:', likedNotices);

                // console.log('spreadNotices:', spreadNotices);


            } catch (error) {
                console.error('Error fetching feed notices:', error);
            } finally {
                // setIsLoading(false);
                setIsLoadingNotices(false);
                setIsLoadingUsers(false);
            }

        };

        fetchFeedData();

    }, [selectedTags, offset])


    const handleTagSelect = (categoryName, tagIndex, tag, isSelected) => {

        console.log('Tag:', tag.key);

        setSelectedTags(prevTags => ({
            ...prevTags,
            [tag.key]: !prevTags[tag.key]
        }));

    };

    //Fetch reactions to feed notices 
    useEffect(() => {
        try {
            fetchReactionsForNotices(feedNotices, setNoticesReactions);
        } catch (error) {
            console.error(error);
        }

    }, [feedNotices])


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
    if (isLoadingNotices || isLoadingUsers) {
        return <div><Loading size={24} />Loading feed...</div>;
    }

    return (
        <div>

            <h2>Select a tag to see related notices:</h2>

            <NoticeTags
                tagCategories={tagCategories}
                handleTagSelect={handleTagSelect}
                selectedTags={selectedTags}
            />


            <Notices
                notices={feedNotices}
                user_id={user_id}
                likedNotices={likedNotices}
                spreadNotices={spreadNotices}
                reactions={noticesReactions}
                handleLike={handleLike}
                handleSpread={handleSpread}
                handleReport={handleReport}
                handleReact={handleReact}
            />

            {/* Load More Button */}
            {/* {hasMore && ( */}
            <div className="d-flex justify-content-center mt-4">
                <Button onClick={() => setOffset(offset + limit)}>
                    Load More
                </Button>
            </div>
            {/* )} */}

            {/* Show a loading spinner if fetching more notices */}
            {isLoadingNotices && <Loading size={24} />}

        </div>
    )
}

export default UserFeed