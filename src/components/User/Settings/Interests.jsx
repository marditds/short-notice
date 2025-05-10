import { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNotices } from '../../../lib/hooks/useNotices';
import { InterestsTags } from './InterestsTags';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';

export const Interests = ({ userId }) => {

    const {
        tagCategories,
        isInterestsUpdating,
        selectedTags,
        isInterestsLoading,
        fetchUserInterests,
        updateInterests,
        toggleInterestsTag,
        deselectAllInterestTags
    } = useNotices();

    useEffect(() => {
        // if (location.pathname === feed or settings)
        fetchUserInterests();
        // else return,
    }, [userId, tagCategories]);

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4>Update Interests:</h4>
                <p>You decide the kind of notices fetch in your general feed.</p>
            </Col>
            <Col>
                {
                    !isInterestsLoading
                        ?
                        <InterestsTags
                            tagCategories={tagCategories}
                            isInterestsUpdating={isInterestsUpdating}
                            selectedTags={selectedTags}
                            toggleInterestsTag={toggleInterestsTag}
                            deselectAllInterestTags={deselectAllInterestTags}
                            updateInterests={updateInterests}
                        />
                        :
                        <LoadingSpinner />
                }
            </Col>
        </Row>
    )
}
