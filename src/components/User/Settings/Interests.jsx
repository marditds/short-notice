import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import { Loading } from '../../Loading/Loading';

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
    const { user_id, updateInterests, getInterests } = useNotices(googleUserData);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchUserInterests = async () => {
            if (user_id) {
                try {
                    const userInterests = await getInterests(user_id);
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


    const toggleTag = (tagKey) => {
        setSelectedTags(prevSelectedTags => ({
            ...prevSelectedTags,
            [tagKey]: !prevSelectedTags[tagKey]
        }));
    };

    const handleUpdateInterests = async () => {

        setIsUpdating(true);

        if (user_id) {
            try {
                const interests = await updateInterests(user_id, selectedTags);
                console.log('Interests updated:', interests);
            } catch (error) {
                console.error('Error updating interests:', error);
            } finally {
                setIsUpdating(false);
            }
        } else {
            console.error('User ID not found');
        }
    };

    const allTags = tagCategories.flatMap(category => category.tags);

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4 className='mb-0 mb-sm-2'>Update Interests:</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, vitae!.</p>
            </Col>
            <Col className='d-flex'>
                <div className='d-grid  w-100'>
                    <div
                        className='d-flex flex-wrap'
                    >
                        {allTags.map((tag) => (
                            <div
                                key={tag.key}
                                className='settings__update-interests-tag-col' >
                                <div
                                    onClick={() => toggleTag(tag.key)}

                                    className={`settings__update-interests-tag ${selectedTags[tag.key] && 'tagIsChecked'}`}
                                >
                                    {tag.name}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button
                        onClick={handleUpdateInterests}
                        className='settings__update-interests-btn'
                    >
                        {isUpdating ? <Loading /> : 'Update Interests'}
                    </Button>
                </div>
            </Col>
        </Row>
    )
}
