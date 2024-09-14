import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import useUserAvatar from '../../../lib/hooks/useUserAvatar';
import { NoticeTags } from '../../../components/User/NoticeTags';
import { Notices } from '../../../components/User/Notices';
import { Loading } from '../../../components/Loading/Loading';

const UserFeed = () => {

    const [feedNotices, setFeedNotices] = useState([]);
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
    const { user_id, getInterests, getFeedNotices } = useNotices(googleUserData);

    const { getUserData } = useUserInfo(googleUserData);

    const { avatarUrl } = useUserAvatar(user_id);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserInterests = async () => {
            if (user_id) {
                try {
                    const userInterests = await getInterests(user_id);

                    console.log('these are user interests:', userInterests);

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

    useEffect(() => {

        setIsLoading(true);

        const fetchFeedNotices = async () => {

            try {

                console.log('Selected Tags:', selectedTags);

                const filteredNotices = await getFeedNotices(selectedTags);

                console.log('Filtered notices:', filteredNotices);

                setFeedNotices(filteredNotices);

                console.log('Feed Notices:', feedNotices);


            } catch (error) {
                console.error('Error fetching feed notices:', error);
            } finally {
                setIsLoading(false);
            }

        };

        fetchFeedNotices();

    }, [selectedTags])

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const userData = await getUserData(user_id);
                console.log('This is user data', userData);

            } catch (error) {
                console.error('Error getting user data', error);

            }
        };

        fetchUserData();

    }, [googleUserData])


    const handleTagSelect = (categoryName, tagIndex, tag, isSelected) => {

        console.log('Tag:', tag.key);

        setSelectedTags(prevTags => ({
            ...prevTags,
            [tag.key]: !prevTags[tag.key]
        }));

    };


    return (
        <div>


            <h2>Select a tag to see related notices:</h2>

            <NoticeTags
                tagCategories={tagCategories}
                handleTagSelect={handleTagSelect}
                selectedTags={selectedTags}
            />

            {
                isLoading ?
                    <Loading size={24} />
                    :
                    <Notices
                        notices={feedNotices}
                        username={username}
                        avatarUrl={avatarUrl}
                    />
            }
        </div>
    )
}

export default UserFeed