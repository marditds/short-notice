import React, { useEffect, useState } from 'react';
import useNotices from '../../../lib/hooks/useNotices';
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

    const { getFeedNotices } = useNotices();

    useEffect(() => {

        const fetchFeedNotices = async () => {

            try {

                console.log('Selected Tags:', selectedTags);

                // const selectedTagKeys = Object.keys(selectedTags).filter(tag => selectedTags[tag]);

                // console.log('selected Tag Keys:', selectedTagKeys);

                const filteredNotices = await getFeedNotices(selectedTags);

                console.log('Filtered notices:', filteredNotices);

                setFeedNotices(filteredNotices);

                console.log('Feed Notices:', feedNotices);


            } catch (error) {
                console.error('Error fetching feed notices:', error);
            }

        };

        fetchFeedNotices();

    }, [selectedTags])


    const handleTagSelect = (categoryName, tagIndex, tag, isSelected) => {

        console.log('Tag:', tag.key);

        setSelectedTags(prevTags => ({
            ...prevTags,
            [tag.key]: !prevTags[tag.key]
        }));

        // setSelectedTags(prevTags => {
        //     const updatedTags = { ...prevTags };
        //     if (updatedTags.hasOwnProperty(tag.key)) {
        //         delete updatedTags[tag.key];
        //     } else {
        //         updatedTags[tag.key] = true;
        //     }
        //     return updatedTags;
        // });

    };

    // if (isLoading) {
    //     return <div><Loading />Loading your feed</div>;
    // }

    return (
        <div>


            <h2>Select a tag to see related notices:</h2>

            <NoticeTags
                tagCategories={tagCategories}
                handleTagSelect={handleTagSelect}
                selectedTags={selectedTags}
            />

            <Notices notices={feedNotices} />

            {/* {feedNotices.length > 0 ? (
                <ul>
                    {feedNotices.map((notice) => (
                        <li key={notice.$id}>{notice.text}</li>
                    ))}
                </ul>
            ) : (
                <p>No notices found for the selected tag.</p>
            )} */}

        </div>
    )
}

export default UserFeed