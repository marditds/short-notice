import React from 'react';
import { Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';

export const InterestsTags = ({
    tagCategories,
    toggleInterestsTag,
    deselectAllInterestTags,
    selectedTags,
    updateInterests,
    onUpdateInterests,
    isInterestsUpdating,
    isAnyTagSelected
}) => {

    const allTags = tagCategories.flatMap(category => category.tags);

    return (
        <div className='d-flex flex-column'>
            <div className='d-flex flex-wrap'>
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
            {/* <div className='d-flex'> */}
            <div className='d-xxl-flex d-grid'>
                <Button
                    onClick={() => {
                        updateInterests();
                        if (isAnyTagSelected && onUpdateInterests) {
                            onUpdateInterests();
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
    )
} 