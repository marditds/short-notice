import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import useUserAvatar from '../../../lib/hooks/useUserAvatar';
import { getAvatarUrl } from '../../../lib/utils/avatarUtils';
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
    const { user_id, getInterests, getFeedNotices } = useNotices(googleUserData);

    const { getUsersData } = useUserInfo(googleUserData);
    const [feedNotices, setFeedNotices] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

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




    // Notices based on interests
    useEffect(() => {

        setIsLoading(true);

        const fetchFeedNotices = async () => {

            try {

                // console.log('Selected Tags:', selectedTags);

                const filteredNotices = await getFeedNotices(selectedTags);

                // console.log('Filtered notices:', filteredNotices);

                setFeedNotices(filteredNotices);


            } catch (error) {
                console.error('Error fetching feed notices:', error);
            } finally {
                setIsLoading(false);
            }

        };

        fetchFeedNotices();

    }, [selectedTags])



    // All users info
    useEffect(() => {

        const fetchUsersData = async () => {
            try {
                const allUsersData = await getUsersData();
                // console.log('This is allUsersData', allUsersData);
                setUsersData(allUsersData);
            } catch (error) {
                console.error('Error getting users data', error);

            }
        };

        fetchUsersData();

    }, []);


    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const allUsersData = await getUsersData();
                const updatedFeedNotices = await Promise.all(
                    feedNotices.map(async (notice) => {
                        const user = allUsersData.documents.find(user => user.$id === notice.user_id);
                        if (user && user.avatar) {
                            const avatarUrl = getAvatarUrl(user.avatar);
                            return { ...notice, avatarUrl, username: user.username };
                        }
                        return { ...notice, avatarUrl: null, username: user?.username || 'Unknown User' };
                    })
                );

                if (JSON.stringify(updatedFeedNotices) !== JSON.stringify(feedNotices)) {
                    setFeedNotices(updatedFeedNotices);
                }

            } catch (error) {
                console.error('Error getting users data', error);
            }
        };

        fetchUsersData();
    }, [feedNotices]);




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

            {!isLoading ?
                <Notices
                    notices={feedNotices}
                    username={username}
                /> :
                <Loading size={24} />
            }

        </div>
    )
}

export default UserFeed