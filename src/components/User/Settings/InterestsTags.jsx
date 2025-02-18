import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';

export const InterestsTags = ({
    tagCategories,
    toggleInterestsTag,
    deselectAllInterestTags,
    selectedTags,
    updateInterests,
    handleRefresh,
    isInterestsUpdating,
    isAnyTagSelected,
    // handleFeedToggle
}) => {

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
                <div className='d-xxl-flex d-grid'>
                    <Button
                        onClick={() => {
                            if (location.pathname !== '/user/feed') {
                                updateInterests();
                            } else {
                                if (isAnyTagSelected) {
                                    updateInterests();
                                    handleRefresh();
                                }
                                else {
                                    updateInterests();
                                    // console.log('Stating handleFeedToggle().');

                                    // handleFeedToggle();

                                    // console.log('Finishing handleFeedToggle().');

                                }
                            }
                        }
                        }
                        className='settings__update-interests-btn'
                    >
                        {isInterestsUpdating ? <Loading /> : 'Update Interests'}
                    </Button>
                    <Button onClick={deselectAllInterestTags}
                        className='settings__update-interests-btn'
                    >
                        Deselect All
                    </Button>
                </div>
            </div>
        </Col>
    )
}
