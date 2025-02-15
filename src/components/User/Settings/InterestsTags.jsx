import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';

export const InterestsTags = ({ tagCategories, toggleInterestsTag, selectedTags, updateInterests, handleRefresh, isInterestsUpdating }) => {

    const location = useLocation();

    const allTags = tagCategories.flatMap(category => category.tags);

    return (
        <Col className='d-flex'>
            <div className='d-flex flex-column'>
                <div
                    className='d-flex flex-wrap'
                >
                    {allTags.map((tag) => (
                        <div
                            key={tag.key}
                            className='settings__update-interests-tag-col' >
                            <div
                                onClick={() => toggleInterestsTag(tag.key)}

                                className={`settings__update-interests-tag ${selectedTags[tag.key] && 'tagIsChecked'}`}
                            >
                                {tag.name}
                            </div>
                        </div>
                    ))}
                </div>
                <Button
                    onClick={() => {
                        if (location.pathname !== '/user/feed') {
                            updateInterests();
                        } else {
                            updateInterests();
                            handleRefresh();
                        }
                    }
                    }
                    className='settings__update-interests-btn'
                >
                    {isInterestsUpdating ? <Loading /> : 'Update Interests'}
                </Button>
            </div>
        </Col>
    )
}
