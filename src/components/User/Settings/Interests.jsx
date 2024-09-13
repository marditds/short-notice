import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';

export const Interests = () => {

    const [tagCategories, setTagCategories] = useState([
        {
            group: 'STEM',
            tags: [
                { name: 'Science', key: 'science' },
                { name: 'Technology', key: 'technology' },
                { name: 'Engineering', key: 'engineering' },
                { name: 'Math', key: 'math' }
            ]
        },
        {
            group: 'Humanities and Arts',
            tags: [
                { name: 'Literature', key: 'literature' },
                { name: 'History', key: 'history' },
                { name: 'Philosophy', key: 'philosophy' },
                { name: 'Music', key: 'music' }
            ]
        },
        {
            group: 'Social Sciences and Professions',
            tags: [
                { name: 'Medicine', key: 'medicine' },
                { name: 'Economics', key: 'economics' },
                { name: 'Law', key: 'law' },
                { name: 'Political Science', key: 'polSci' },
                { name: 'Sports', key: 'sports' }
            ]
        }
    ]);

    const [selectedTags, setSelectedTags] = useState({});
    const { googleUserData } = useUserContext();
    const { user_id, updateInterests } = useNotices(googleUserData);

    const toggleTag = (tagKey) => {
        setSelectedTags(prevSelectedTags => ({
            ...prevSelectedTags,
            [tagKey]: !prevSelectedTags[tagKey] // Toggle between true/false
        }));
    };

    const handleUpdateInterests = async () => {
        if (user_id) {
            try {
                await updateInterests(user_id, selectedTags); // Send selectedTags to update in Appwrite
                console.log('Interests updated:', selectedTags);
            } catch (error) {
                console.error('Error updating interests:', error);
            }
        } else {
            console.error('User ID not found');
        }
    };

    return (
        <Row>
            <Col>
                <h4>Update Interests:</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, vitae!.</p>
            </Col>
            <Col className='d-flex'>


                <div className='d-grid'>
                    <div
                        className='mb-3'
                    // style={{
                    //     maxWidth: '500px',
                    //     display: 'flex',
                    //     flexWrap: 'wrap',
                    //     gap: '10px'
                    // }}
                    >
                        {
                            tagCategories.map((category, idx) => (
                                <div key={idx}
                                    style={{
                                        maxWidth: '500px',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px',
                                        margin: '10px'
                                    }}>
                                    {
                                        category.tags.map((tag, index) => (
                                            <div
                                                key={tag.key}
                                                onClick={() => toggleTag(tag.key)}
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: selectedTags[tag.key] ? 'var(--main-accent-color)' : 'black',
                                                    border: '1px solid',
                                                    borderRadius: '5px',
                                                    borderColor: 'var(--main-accent-color)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {tag.name}
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                    <Button
                        onClick={handleUpdateInterests}
                        className='settings__update-interests-btn'
                    >
                        Update Interests
                    </Button>
                </div>
            </Col>
        </Row>
    )
}
