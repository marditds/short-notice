import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { NoticeTags } from '../../../components/User/NoticeTags';
import { Notices } from '../../../components/User/Notices';
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

    const { user_id, getInterests, getFeedNotices, addSpreads, reportNotice, likeNotice, likedNotices } = useNotices(googleUserData);

    const { fetchUsersData } = useUserInfo(googleUserData);

    const [feedNotices, setFeedNotices] = useState([]);

    const [isLoadingNotices, setIsLoadingNotices] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);



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

                const filteredNotices = await getFeedNotices(selectedTags);

                // console.log('Filtered notices:', filteredNotices);

                setFeedNotices(filteredNotices);

                await fetchUsersData(filteredNotices, setFeedNotices, avatarUtil);

            } catch (error) {
                console.error('Error fetching feed notices:', error);
            } finally {
                // setIsLoading(false);
                setIsLoadingNotices(false);
                setIsLoadingUsers(false);
            }

        };

        fetchFeedData();

    }, [selectedTags])




    const handleTagSelect = (categoryName, tagIndex, tag, isSelected) => {

        console.log('Tag:', tag.key);

        setSelectedTags(prevTags => ({
            ...prevTags,
            [tag.key]: !prevTags[tag.key]
        }));

    };


    const handleCreateSpread = async (notice) => {
        try {
            await addSpreads(notice.$id, notice.user_id, user_id);
        } catch (error) {
            console.error('Error creating spread entry:', error);
        }
    };


    const handleLike = async (notice) => {
        try {
            await likeNotice(notice.$id, notice.user_id)
        } catch (error) {
            console.error('Could not like notice');
        }
    }


    const handleReport = async (notice) => {
        try {
            await reportNotice(notice.$id, notice.user_id, reason, user_id);
            console.log('Notice REPORTED!');
        } catch (error) {
            console.error('Could not report notice');
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
                username={username}
                handleCreateSpread={handleCreateSpread}
                likedNotices={likedNotices}
                handleLike={handleLike}
                handleReport={handleReport}
            />

        </div>
    )
}

export default UserFeed