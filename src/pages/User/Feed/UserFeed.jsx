import React, { useEffect, useState } from 'react';
import useNotices from '../../../lib/hooks/useNotices';

const UserFeed = () => {

    const [feedNotices, setFeedNotices] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const { getFeedNotices } = useNotices();

    useEffect(() => {

        const fetchFeedNotices = async () => {
            if (selectedTag) {
                try {
                    const feed = await getFeedNotices(selectedTag);
                    setFeedNotices(feed);
                } catch (error) {
                    console.error('Error fetching feed notices:', error);
                }
            }
        };

        fetchFeedNotices();

    }, [selectedTag])



    return (
        <div>
            <h2>Select a tag to see related notices:</h2>
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">--Select a Tag--</option>
                <option value="science">Science</option>
                <option value="technology">Technology</option>
                <option value="engineering">Engineering</option>
                <option value="math">Math</option>
                <option value="literature">Literature</option>
            </select>

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