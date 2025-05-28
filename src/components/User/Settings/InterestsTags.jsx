import { useState } from 'react';
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
        <fieldset aria-labelledby='interests-legend' className='border-0 p-0 m-0'>

            <legend id='interests-legend' className='visually-hidden'>
                Select your interests
            </legend>

            <div className='d-flex flex-wrap' aria-label='Interest tags'>
                {allTags.map((tag) => (
                    <div
                        key={tag.key}
                        className='settings__update-interests-tag-col' >
                        <Button
                            onClick={() => toggleInterestsTag(tag.key)}

                            className={`bg-transparent settings__update-interests-tag ${selectedTags[tag.key] ? 'tagIsChecked' : ''}`}

                            aria-pressed={selectedTags[tag.key]}
                        >
                            {tag.name}
                        </Button>
                    </div>
                ))}
            </div>

            {/* Update and deselect buttons */}
            <div className='d-xxl-flex d-grid' role='group' aria-label='Interest tag actions'>
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

                        // For user feed only
                        if (isAnyTagSelected && onUpdateInterests) {
                            onUpdateInterests();
                        }
                    }
                    }
                    className='settings__update-interests-btn'
                    aria-describedby={successMsg ? 'success-message' : errorMsg ? 'error-message' : undefined}
                    aria-label='Update selected interest tags'
                >
                    {isInterestsUpdating ? (
                        <>
                            <LoadingSpinner />
                            <span className='visually-hidden' role='status' aria-live='polite'>
                                Updating interests...
                            </span>
                        </>
                    ) : (
                        'Update Interests'
                    )}
                </Button>

                <Button onClick={deselectAllInterestTags}
                    className='settings__update-interests-btn'
                    aria-label='Deselect all selected interest tags'
                >
                    Deselect All
                </Button>
            </div>


            <div
                id='success-message'
                aria-live='polite'
                role='status'
                style={{
                    height: location.pathname === '/user/feed' ? undefined : '24px',
                    marginLeft: !isSmallScreen ? '10px' : '5px',
                }}
            >
                <SuccessMessage message={successMsg} />
            </div>

            <div
                id='error-message'
                role='alert'
                aria-live='assertive'
                style={{
                    height: location.pathname === '/user/feed' ? undefined : '24px',
                    marginLeft: !isSmallScreen ? '10px' : '5px',
                }}
            >
                <ErrorMessage message={errorMsg} />
            </div>

        </fieldset>
    )
} 