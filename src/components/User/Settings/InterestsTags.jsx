import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from './UpdateMessage';
import { screenUtils } from '../../../lib/utils/screenUtils';

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

    const location = useLocation();

    const { isSmallScreen } = screenUtils();

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    return (
        <div className='d-flex flex-column'>
            <div className='d-flex flex-wrap'>
                {allTags.map((tag) => (
                    <div
                        key={tag.key}
                        className='settings__update-interests-tag-col' >
                        <div
                            onClick={() => toggleInterestsTag(tag.key)}

                            className={`settings__update-interests-tag ${selectedTags[tag.key] ? 'tagIsChecked' : ''}`}
                        >
                            {tag.name}
                        </div>
                    </div>
                ))}
            </div>
            <div className='d-xxl-flex d-grid'>
                <Button
                    onClick={async () => {
                        const updateInterestsRes = await updateInterests();

                        console.log('THIS IS updateInterestsRes:', updateInterestsRes);

                        if (typeof updateInterestsRes === 'string') {
                            setErrorMsg('Something went wrong. Please try again later.');
                            return;
                        }

                        setErrorMsg('');
                        setSuccessMsg('Interest(s) updated successfully.')

                        if (isAnyTagSelected && onUpdateInterests) {
                            onUpdateInterests();
                        }
                    }
                    }
                    className='settings__update-interests-btn'
                >
                    {isInterestsUpdating ? <LoadingSpinner /> : 'Update Interests'}
                </Button>
                <Button onClick={deselectAllInterestTags}
                    className='settings__update-interests-btn'
                >
                    Deselect All
                </Button>
            </div>
            <div style={{ height: location.pathname === '/user/feed' ? null : '24px', marginLeft: !isSmallScreen ? '10px' : '5px' }}>
                <SuccessMessage message={successMsg} />
            </div>
            <div style={{ height: location.pathname === '/user/feed' ? null : '24px', marginLeft: !isSmallScreen ? '10px' : '5px' }}>
                <ErrorMessage message={errorMsg} />
            </div>
        </div>
    )
} 