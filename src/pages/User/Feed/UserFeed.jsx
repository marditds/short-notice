import React, { useEffect, useState } from 'react';
import useNotices from '../../../lib/hooks/useNotices';
import { NoticeTags } from '../../../components/User/NoticeTags';
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
                { name: 'Other', key: 'other' }
            ],
            values: [false, false, false, false, false]
        }
    ]);

    const [selectedTags, setSelectedTags] = useState({});

    const { getFeedNotices, isLoading } = useNotices();

    useEffect(() => {

        const fetchFeedNotices = async () => {

            try {

                const filteredNotices = await getFeedNotices(selectedTags);


                setFeedNotices(filteredNotices);


                console.log('Filtered notices:', filteredNotices);


            } catch (error) {
                console.error('Error fetching feed notices:', error);
            }

        };

        fetchFeedNotices();

    }, [selectedTags])


    const handleTagSelect = (categoryName, tagIndex, tag, isSelected) => {

        console.log('Tag:', tag.key);

        setSelectedTags(prevTags => {
            const updatedTags = { ...prevTags };
            if (updatedTags.hasOwnProperty(tag.key)) {
                delete updatedTags[tag.key];
            } else {
                updatedTags[tag.key] = true;
            }
            return updatedTags;
        });

    };

    if (isLoading) {
        return <div><Loading />Loading your feed</div>;
    }

    return (
        <div>


            <h2>Select a tag to see related notices:</h2>

            <NoticeTags
                tagCategories={tagCategories}
                handleTagSelect={handleTagSelect}
                selectedTags={selectedTags}
            />


            {feedNotices.length > 0 ? (
                <ul>
                    {feedNotices.map((notice) => (
                        <li key={notice.$id}>{notice.text}</li>
                    ))}
                </ul>
            ) : (
                <p>No notices found for the selected tag.</p>
            )}
        </div>
    )
}

export default UserFeed